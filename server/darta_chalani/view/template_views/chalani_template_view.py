import logging

import pandas as pd
import requests
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator
from django.http import HttpResponse
from django.shortcuts import redirect, render

logger = logging.getLogger(__name__)

# --- System API Configurations ---
API_BASE_URL = "http://127.0.0.1:8000/api/v1/darta-chalani/chalani/"
API_NEXT_NUMBER_URL = "http://127.0.0.1:8000/api/v1/darta-chalani/next-chalani-number/"
SECTION_API_URL = "http://127.0.0.1:8000/api/v1/darta-chalani/section/"
REQUEST_TIMEOUT = 5  # seconds

# Human-friendly field labels matching the ACTUAL Chalani model fields
FIELD_MAPPING = {
    "chalani_samuha": "चलानी समूह",
    "chalani_date": "चलानी मिति",
    "letter_receiver": "पत्र पाउने व्यक्ति/कार्यालय",
    "receiver_address": "पाउनेको ठेगाना",
    "letter_date": "पत्र मिति",
    "subject": "विषय",
    "remarks": "कैफियत",
    "sender_section": "पठाउने शाखा",
    "non_field_errors": "विवरण",
}


# --------------------------------------------------------------------------
# HELPERS
# --------------------------------------------------------------------------

def clean_api_errors(error_data):
    """Converts raw DRF validation errors into clean, user-facing messages."""
    error_msgs = []
    if isinstance(error_data, dict):
        for field, errors in error_data.items():
            friendly_field_name = FIELD_MAPPING.get(field, field.replace("_", " ").title())
            error_text = ", ".join(str(e) for e in errors) if isinstance(errors, list) else str(errors)
            error_msgs.append(f"{friendly_field_name}: {error_text}")
    else:
        error_msgs.append(str(error_data))
    return " | ".join(error_msgs)


def fetch_all_chalani_from_api():
    """Fetches the live chalani list from the DRF endpoint. Returns [] on any failure."""
    try:
        response = requests.get(API_BASE_URL, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            return response.json()
        logger.warning("fetch_all_chalani_from_api: status=%s body=%s", response.status_code, response.text[:300])
    except requests.exceptions.RequestException as e:
        logger.error("fetch_all_chalani_from_api: request failed: %s", e)
    return []


def fetch_section_options():
    """Fetches the section list to populate the 'sender_section' dropdown."""
    try:
        response = requests.get(SECTION_API_URL, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            return response.json()
        logger.warning("fetch_section_options: status=%s", response.status_code)
    except requests.exceptions.RequestException as e:
        logger.error("fetch_section_options: request failed: %s", e)
    return []


def fetch_next_chalani_number():
    """Fetches the next sequential chalani_number for display on the create form."""
    try:
        response = requests.get(API_NEXT_NUMBER_URL, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            return response.json().get("next_chalani_number", "")
    except requests.exceptions.RequestException as e:
        logger.error("fetch_next_chalani_number: failed: %s", e)
    return "Auto"


def build_chalani_payload(request):
    """
    Builds the chalani payload matching the ACTUAL Chalani model fields.
    sender_section is converted to int since it's a ForeignKey PK.
    chalani_number is never sent — it's server-generated (editable=False).
    """
    payload = {
        "chalani_samuha": request.POST.get("chalani_samuha", "").strip(),
        "chalani_date": request.POST.get("chalani_date", "").strip(),
        "letter_receiver": request.POST.get("letter_receiver", "").strip(),
        "receiver_address": request.POST.get("receiver_address", "").strip(),
        "letter_date": request.POST.get("letter_date", "").strip(),
        "subject": request.POST.get("subject", "").strip(),
        "remarks": request.POST.get("remarks", "").strip() or None,
        "sender_section": request.POST.get("sender_section") or None,
    }

    if payload["sender_section"] is not None:
        try:
            payload["sender_section"] = int(payload["sender_section"])
        except (TypeError, ValueError):
            payload["sender_section"] = None

    return payload


def flatten_fk_fields(instance_data):
    """
    Converts a nested FK object (e.g. {'id': 1, 'section_name': '...'}) into
    a plain ID, so the <select> dropdown can pre-select the right option.
    Safe no-op if sender_section is already a plain int/PK.
    """
    value = instance_data.get("sender_section")
    if isinstance(value, dict):
        instance_data["sender_section"] = value.get("id")
    return instance_data


# --------------------------------------------------------------------------
# VIEWS
# --------------------------------------------------------------------------

@login_required
def chalani_dashboard(request):
    return render(request, "dashboard.html")


@login_required
def chalani_list_view(request):
    raw_data = fetch_all_chalani_from_api()

    per_page = request.GET.get("per_page", "10")
    page_number = request.GET.get("page", 1)

    search_query = request.GET.get("search", "").strip()
    search_receiver = request.GET.get("receiver", "").strip()
    search_subject = request.GET.get("subject_filter", "").strip()

    start_date = request.GET.get("start_date", "").strip()
    end_date = request.GET.get("end_date", "").strip()

    if search_query:
        raw_data = [
            item for item in raw_data
            if search_query.lower() in str(item.get("chalani_number", "")).lower()
        ]

    if search_receiver:
        raw_data = [
            item for item in raw_data
            if search_receiver.lower() in str(item.get("letter_receiver", "")).lower()
        ]

    if search_subject:
        raw_data = [
            item for item in raw_data
            if search_subject.lower() in str(item.get("subject", "")).lower()
        ]

    if start_date:
        raw_data = [
            item for item in raw_data
            if item.get("chalani_date") and item.get("chalani_date") >= start_date
        ]

    if end_date:
        raw_data = [
            item for item in raw_data
            if item.get("chalani_date") and item.get("chalani_date") <= end_date
        ]

    if per_page == "all":
        limit = len(raw_data) if len(raw_data) > 0 else 10
    else:
        try:
            limit = int(per_page)
        except ValueError:
            limit = 10

    paginator = Paginator(raw_data, limit)
    page_obj = paginator.get_page(page_number)

    if per_page == "all":
        custom_page_range = [1]
    else:
        custom_page_range = paginator.get_elided_page_range(
            number=page_obj.number, on_each_side=2, on_ends=2,
        )

    return render(
        request,
        "chalani/chalani_list.html",
        {
            "page_obj": page_obj,
            "per_page": per_page,
            "custom_page_range": custom_page_range,
            "search_query": search_query,
            "search_receiver": search_receiver,
            "search_subject": search_subject,
            "start_date": start_date,
            "end_date": end_date,
        },
    )


@login_required
@user_passes_test(lambda u: u.is_superuser, login_url="/accounts/login/")
def chalani_detail_view(request, pk):
    endpoint_url = f"{API_BASE_URL}{pk}/"

    try:
        response = requests.get(endpoint_url, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            instance_data = flatten_fk_fields(response.json())
        elif response.status_code == 404:
            messages.error(request, "विवरण फेला परेन।")
            return redirect("chalani_list")
        else:
            messages.error(request, f"त्रुटि (API Error {response.status_code})")
            return redirect("chalani_list")
    except requests.exceptions.ConnectionError:
        messages.error(request, "API सर्भरसँग जडान हुन सकेन।")
        return redirect("chalani_list")
    except requests.exceptions.Timeout:
        messages.error(request, "API अनुरोध समय सकियो।")
        return redirect("chalani_list")
    except requests.exceptions.RequestException as e:
        logger.exception("chalani_detail_view: unexpected error pk=%s", pk)
        messages.error(request, f"API Connection Failure: {e}")
        return redirect("chalani_list")

    sections = fetch_section_options()

    return render(
        request,
        "chalani/chalani_form.html",
        {
            "instance": instance_data,
            "is_edit_mode": False,
            "is_detail_mode": True,
            "sections": sections,
        },
    )


@login_required
@user_passes_test(lambda u: u.is_superuser, login_url="/accounts/login/")
def chalani_create_view(request):
    payload = None

    if request.method == "POST":
        payload = build_chalani_payload(request)
        logger.debug("CHALANI CREATE PAYLOAD: %s", payload)

        try:
            response = requests.post(API_BASE_URL, json=payload, timeout=REQUEST_TIMEOUT)
            logger.debug("CHALANI CREATE RESPONSE [%s]: %s", response.status_code, response.text)

            if response.status_code in (200, 201):
                messages.success(request, "नयाँ चलानी सफलतापूर्वक थपियो।")
                return redirect("chalani_list")

            elif response.status_code == 400:
                try:
                    friendly_error = clean_api_errors(response.json())
                except ValueError:
                    friendly_error = response.text
                messages.error(request, f"चलानी थप असफल! {friendly_error}")

            elif response.status_code in (401, 403):
                messages.error(request, "अनुमति अस्वीकृत। API प्रमाणीकरण जाँच गर्नुहोस्।")

            else:
                messages.error(request, f"सर्भरमा समस्या आयो (API Error {response.status_code})")

        except requests.exceptions.ConnectionError:
            messages.error(request, "API सर्भरसँग जडान हुन सकेन। (Is the API server running?)")
        except requests.exceptions.Timeout:
            messages.error(request, "API अनुरोध समय सकियो।")
        except requests.exceptions.RequestException as e:
            logger.exception("chalani_create_view: unexpected error")
            messages.error(request, f"अनपेक्षित त्रुटि: {e}")

    sections = fetch_section_options()
    instance_data = payload or {"chalani_number": fetch_next_chalani_number()}
    if payload is None:
        instance_data["chalani_number"] = fetch_next_chalani_number()

    return render(
        request,
        "chalani/chalani_form.html",
        {
            "instance": instance_data,
            "is_edit_mode": False,
            "is_detail_mode": False,
            "sections": sections,
        },
    )


@login_required
@user_passes_test(lambda u: u.is_superuser, login_url="/accounts/login/")
def chalani_edit_view(request, pk):
    endpoint_url = f"{API_BASE_URL}{pk}/"
    instance_data = None

    if request.method == "POST":
        payload = build_chalani_payload(request)
        logger.debug("CHALANI EDIT PAYLOAD (pk=%s): %s", pk, payload)

        try:
            response = requests.patch(endpoint_url, json=payload, timeout=REQUEST_TIMEOUT)
            logger.debug("CHALANI EDIT RESPONSE [%s]: %s", response.status_code, response.text)

            if response.status_code in (200, 204):
                messages.success(request, "चलानी विवरण सफलतापूर्वक सुरक्षित गरियो।")
                return redirect("chalani_list")

            elif response.status_code == 400:
                try:
                    friendly_error = clean_api_errors(response.json())
                except ValueError:
                    friendly_error = response.text
                messages.error(request, f"चलानी संशोधन असफल! {friendly_error}")
                instance_data = payload

            elif response.status_code in (401, 403):
                messages.error(request, "अनुमति अस्वीकृत।")
                instance_data = payload

            elif response.status_code == 404:
                messages.error(request, "अभिलेख फेला परेन। (Record may have been deleted.)")
                return redirect("chalani_list")

            else:
                messages.error(request, f"परिमार्जन असफल भयो (API Error {response.status_code})")
                instance_data = payload

        except requests.exceptions.ConnectionError:
            messages.error(request, "API सर्भरसँग जडान हुन सकेन।")
            instance_data = payload
        except requests.exceptions.Timeout:
            messages.error(request, "API अनुरोध समय सकियो।")
            instance_data = payload
        except requests.exceptions.RequestException as e:
            logger.exception("chalani_edit_view: unexpected error pk=%s", pk)
            messages.error(request, f"API Connectivity Error: {e}")
            instance_data = payload

    if instance_data is None:
        try:
            response = requests.get(endpoint_url, timeout=REQUEST_TIMEOUT)
            if response.status_code == 200:
                instance_data = flatten_fk_fields(response.json())
            elif response.status_code == 404:
                messages.error(request, "अभिलेख फेला परेन।")
                return redirect("chalani_list")
            else:
                messages.error(request, f"अभिलेख फेला परेन। (API Status Code: {response.status_code})")
                return redirect("chalani_list")
        except requests.exceptions.ConnectionError:
            messages.error(request, "API सर्भरसँग जडान हुन सकेन।")
            return redirect("chalani_list")
        except requests.exceptions.Timeout:
            messages.error(request, "API अनुरोध समय सकियो।")
            return redirect("chalani_list")
        except requests.exceptions.RequestException as e:
            logger.exception("chalani_edit_view: unexpected error fetching pk=%s", pk)
            messages.error(request, f"API connection failure: {e}")
            return redirect("chalani_list")

    sections = fetch_section_options()

    return render(
        request,
        "chalani/chalani_form.html",
        {
            "instance": instance_data,
            "is_edit_mode": True,
            "is_detail_mode": False,
            "sections": sections,
        },
    )


@login_required
def export_chalani_excel(request):
    raw_data = fetch_all_chalani_from_api()

    if not raw_data:
        messages.warning(request, "निर्यात गर्नका लागि कुनै डाटा उपलब्ध छैन।")
        return redirect("chalani_list")

    df = pd.DataFrame(raw_data)
    df.columns = [col.replace("_", " ").title() for col in df.columns]

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=Chalani_Report.xlsx"

    with pd.ExcelWriter(response, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Chalani Records")

    return response


@login_required
def export_chalani_pdf(request):
    raw_data = fetch_all_chalani_from_api()
    return render(request, "chalani/chalani_export_pdf.html", {"records": raw_data})