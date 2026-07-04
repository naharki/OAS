import logging
import requests
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator
from django.shortcuts import redirect, render

logger = logging.getLogger(__name__)

# --- System API Configurations ---
API_BASE_URL = "http://127.0.0.1:8000/api/v1/darta-chalani/employee/"
SECTION_API_URL = "http://127.0.0.1:8000/api/v1/darta-chalani/section/"
DESIGNATION_API_URL = "http://127.0.0.1:8000/api/v1/darta-chalani/designation/"
LEVEL_API_URL = "http://127.0.0.1:8000/api/v1/darta-chalani/level/"
REQUEST_TIMEOUT = 5  # Network thread safety limit in seconds

# Human-friendly mapping to hide database/model variable names from users
FIELD_MAPPING = {
    "first_name": "पहिलो नाम",
    "last_name": "थर",
    "phone_number": "फोन नम्बर",
    "email": "इमेल",
    "section": "शाखा",
    "designation": "पद",
    "level": "तह",
    "non_field_errors": "विवरण",
}


# --------------------------------------------------------------------------
# HELPERS
# --------------------------------------------------------------------------

def clean_api_errors(error_data):
    """
    Transforms raw DRF validation error dicts into clean, user-friendly
    Nepali/English messages, hiding raw field/model names.
    """
    error_msgs = []
    if isinstance(error_data, dict):
        for field, errors in error_data.items():
            friendly_field_name = FIELD_MAPPING.get(field, field.replace('_', ' ').title())
            if isinstance(errors, list):
                error_text = ', '.join(str(e) for e in errors)
            else:
                error_text = str(errors)
            error_msgs.append(f"{friendly_field_name}: {error_text}")
    else:
        error_msgs.append(str(error_data))
    return " | ".join(error_msgs)


def fetch_all_employee_from_api():
    """Fetches the live employee list from the DRF endpoint. Returns [] on any failure."""
    try:
        response = requests.get(API_BASE_URL, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            return response.json()
        logger.warning("fetch_all_employee_from_api: status=%s body=%s", response.status_code, response.text[:300])
    except requests.exceptions.RequestException as e:
        logger.error("fetch_all_employee_from_api: request failed: %s", e)
    return []


def fetch_dropdown_options():
    """Fetches section, designation, and level lists for form dropdowns."""
    sections, designations, levels = [], [], []

    try:
        r = requests.get(SECTION_API_URL, timeout=REQUEST_TIMEOUT)
        if r.status_code == 200:
            sections = r.json()
        else:
            logger.warning("fetch_dropdown_options: section API status=%s", r.status_code)
    except requests.exceptions.RequestException as e:
        logger.error("fetch_dropdown_options: section API failed: %s", e)

    try:
        r = requests.get(DESIGNATION_API_URL, timeout=REQUEST_TIMEOUT)
        if r.status_code == 200:
            designations = r.json()
        else:
            logger.warning("fetch_dropdown_options: designation API status=%s", r.status_code)
    except requests.exceptions.RequestException as e:
        logger.error("fetch_dropdown_options: designation API failed: %s", e)

    try:
        r = requests.get(LEVEL_API_URL, timeout=REQUEST_TIMEOUT)
        if r.status_code == 200:
            levels = r.json()
        else:
            logger.warning("fetch_dropdown_options: level API status=%s", r.status_code)
    except requests.exceptions.RequestException as e:
        logger.error("fetch_dropdown_options: level API failed: %s", e)

    return sections, designations, levels


def build_employee_payload(request):
    """
    Builds and cleans the employee payload from POST data.
    Converts FK fields (section/designation/level) to int or None,
    since Django's request.POST values are always strings.
    """
    payload = {
        "first_name": request.POST.get("first_name", "").strip(),
        "last_name": request.POST.get("last_name", "").strip(),
        "phone_number": request.POST.get("phone_number", "").strip(),
        "email": request.POST.get("email", "").strip() or None,
        "section": request.POST.get("section") or None,
        "designation": request.POST.get("designation") or None,
        "level": request.POST.get("level") or None,
        "is_active": request.POST.get("is_active") == "on",
    }

    for fk_field in ("section", "designation", "level"):
        if payload[fk_field] is not None:
            try:
                payload[fk_field] = int(payload[fk_field])
            except (TypeError, ValueError):
                payload[fk_field] = None

    return payload


def flatten_fk_fields(instance_data):
    """
    Converts nested FK objects (e.g. {'id': 1, 'name': '...'}) returned by
    read endpoints into plain IDs, so <select> dropdowns can pre-select them.
    """
    for fk_field in ("section", "designation", "level"):
        value = instance_data.get(fk_field)
        if isinstance(value, dict):
            instance_data[fk_field] = value.get("id")
    return instance_data


# --------------------------------------------------------------------------
# VIEWS
# --------------------------------------------------------------------------

@login_required
def employee_dashboard(request):
    return render(request, "dashboard.html")


@login_required
def employee_list_view(request):
    raw_data = fetch_all_employee_from_api()

    per_page = request.GET.get("per_page", "10")
    page_number = request.GET.get("page", 1)

    search_query = request.GET.get("search", "").strip()

    if search_query:
        raw_data = [
            item for item in raw_data
            if search_query.lower() in f"{item.get('first_name', '')} {item.get('last_name', '')}".lower()
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
            number=page_obj.number,
            on_each_side=2,
            on_ends=2
        )

    return render(
        request,
        "office_setup/employee/employee_list.html",
        {
            "page_obj": page_obj,
            "per_page": per_page,
            "custom_page_range": custom_page_range,
            "search_query": search_query,
        },
    )


@login_required
@user_passes_test(lambda u: u.is_superuser, login_url="/accounts/login/")
def employee_detail_view(request, pk):
    endpoint_url = f"{API_BASE_URL}{pk}/"

    try:
        response = requests.get(endpoint_url, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            instance_data = response.json()
        elif response.status_code == 404:
            messages.error(request, "कर्मचारी विवरण फेला परेन।")
            return redirect("employee_list")
        else:
            messages.error(request, f"त्रुटि (API Error {response.status_code}): {response.text[:300]}")
            return redirect("employee_list")
    except requests.exceptions.ConnectionError:
        messages.error(request, "API सर्भरसँग जडान हुन सकेन। (Is the API server running?)")
        return redirect("employee_list")
    except requests.exceptions.Timeout:
        messages.error(request, "API अनुरोध समय सकियो।")
        return redirect("employee_list")
    except requests.exceptions.RequestException as e:
        logger.exception("employee_detail_view: unexpected error pk=%s", pk)
        messages.error(request, f"API Connection Failure: {e}")
        return redirect("employee_list")

    sections, designations, levels = fetch_dropdown_options()

    return render(
        request,
        "office_setup/employee/employee_form.html",
        {
            "instance": instance_data,
            "is_edit_mode": False,
            "is_detail_mode": True,
            "sections": sections,
            "designations": designations,
            "levels": levels,
        },
    )


@login_required
@user_passes_test(lambda u: u.is_superuser, login_url="/accounts/login/")
def employee_create_view(request):
    payload = None

    if request.method == "POST":
        payload = build_employee_payload(request)
        logger.debug("EMPLOYEE CREATE PAYLOAD: %s", payload)

        try:
            response = requests.post(API_BASE_URL, json=payload, timeout=REQUEST_TIMEOUT)
            logger.debug("EMPLOYEE CREATE RESPONSE [%s]: %s", response.status_code, response.text)

            if response.status_code in (200, 201):
                messages.success(request, "नयाँ कर्मचारी सफलतापूर्वक थपियो।")
                return redirect("employee_list")

            elif response.status_code == 400:
                try:
                    friendly_error = clean_api_errors(response.json())
                except ValueError:
                    friendly_error = response.text
                messages.error(request, f"कर्मचारी थप असफल! {friendly_error}")

            elif response.status_code in (401, 403):
                messages.error(request, "अनुमति अस्वीकृत। API प्रमाणीकरण जाँच गर्नुहोस्।")

            elif response.status_code == 404:
                messages.error(request, f"API बाटो फेला परेन: {API_BASE_URL}")

            else:
                messages.error(
                    request,
                    f"सर्भरमा समस्या आयो (API Error {response.status_code}): {response.text[:300]}"
                )

        except requests.exceptions.ConnectionError:
            messages.error(request, "API सर्भरसँग जडान हुन सकेन। (Connection refused — is the API server running?)")
        except requests.exceptions.Timeout:
            messages.error(request, "API अनुरोध समय सकियो। (Request timed out.)")
        except requests.exceptions.RequestException as e:
            logger.exception("employee_create_view: unexpected error")
            messages.error(request, f"अनपेक्षित त्रुटि: {e}")

    sections, designations, levels = fetch_dropdown_options()

    return render(
        request,
        "office_setup/employee/employee_form.html",
        {
            "is_edit_mode": False,
            "is_detail_mode": False,
            "instance": payload,
            "sections": sections,
            "designations": designations,
            "levels": levels,
        },
    )


@login_required
@user_passes_test(lambda u: u.is_superuser, login_url="/accounts/login/")
def employee_edit_view(request, pk):
    endpoint_url = f"{API_BASE_URL}{pk}/"
    instance_data = None

    if request.method == "POST":
        payload = build_employee_payload(request)
        logger.debug("EMPLOYEE EDIT PAYLOAD (pk=%s): %s", pk, payload)

        try:
            response = requests.patch(endpoint_url, json=payload, timeout=REQUEST_TIMEOUT)
            logger.debug("EMPLOYEE EDIT RESPONSE [%s]: %s", response.status_code, response.text)

            if response.status_code in (200, 204):
                messages.success(request, "कर्मचारी विवरण सफलतापूर्वक सुरक्षित गरियो।")
                return redirect("employee_list")

            elif response.status_code == 400:
                try:
                    friendly_error = clean_api_errors(response.json())
                except ValueError:
                    friendly_error = response.text
                messages.error(request, f"कर्मचारी संशोधन असफल! {friendly_error}")
                instance_data = payload

            elif response.status_code in (401, 403):
                messages.error(request, "अनुमति अस्वीकृत। API प्रमाणीकरण जाँच गर्नुहोस्।")
                instance_data = payload

            elif response.status_code == 404:
                messages.error(request, "कर्मचारी फेला परेन। (Record may have been deleted.)")
                return redirect("employee_list")

            else:
                messages.error(
                    request,
                    f"संशोधन असफल भयो (API Error {response.status_code}): {response.text[:300]}"
                )
                instance_data = payload

        except requests.exceptions.ConnectionError:
            messages.error(request, "API सर्भरसँग जडान हुन सकेन।")
            instance_data = payload
        except requests.exceptions.Timeout:
            messages.error(request, "API अनुरोध समय सकियो।")
            instance_data = payload
        except requests.exceptions.RequestException as e:
            logger.exception("employee_edit_view: unexpected error pk=%s", pk)
            messages.error(request, f"अनपेक्षित त्रुटि: {e}")
            instance_data = payload

    if instance_data is None:
        try:
            response = requests.get(endpoint_url, timeout=REQUEST_TIMEOUT)
            if response.status_code == 200:
                instance_data = flatten_fk_fields(response.json())
            elif response.status_code == 404:
                messages.error(request, "अभिलेख फेला परेन। (Record may have been deleted.)")
                return redirect("employee_list")
            else:
                messages.error(request, f"अभिलेख फेला परेन। (API Status Code: {response.status_code})")
                return redirect("employee_list")
        except requests.exceptions.ConnectionError:
            messages.error(request, "API सर्भरसँग जडान हुन सकेन।")
            return redirect("employee_list")
        except requests.exceptions.Timeout:
            messages.error(request, "API अनुरोध समय सकियो।")
            return redirect("employee_list")
        except requests.exceptions.RequestException as e:
            logger.exception("employee_edit_view: unexpected error fetching pk=%s", pk)
            messages.error(request, f"API connection failure: {e}")
            return redirect("employee_list")

    sections, designations, levels = fetch_dropdown_options()

    return render(
        request,
        "office_setup/employee/employee_form.html",
        {
            "instance": instance_data,
            "is_edit_mode": True,
            "is_detail_mode": False,
            "sections": sections,
            "designations": designations,
            "levels": levels,
        },
    )