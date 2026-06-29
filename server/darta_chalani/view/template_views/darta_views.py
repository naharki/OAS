import pandas as pd
import requests
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator
from django.http import HttpResponse
from django.shortcuts import redirect, render

# --- System API Configurations ---
API_BASE_URL = "http://127.0.0.1:8000/api/v1/darta-chalani/darta/"
API_NEXT_NUMBER_URL = (
    "http://127.0.0.1:8000/api/v1/darta-chalani/next-darta-number/"
)
REQUEST_TIMEOUT = 5  # Network thread safety limit in seconds

# darta_chalani/urls_api.py or views
from rest_framework.views import APIView
from rest_framework.response import Response

def fetch_all_darta_from_api():
    """Centrally isolation helper to fetch live datasets from the DRF endpoint."""
    try:
        response = requests.get(API_BASE_URL, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            return response.json()
    except requests.exceptions.RequestException:
        pass
    return []


@login_required
def darta_dashboard(request):
    return render(request, "dashboard.html")
@login_required
def darta_list_view(request):
    # 1. Fetch live baseline dataset from API endpoint
    raw_data = fetch_all_darta_from_api()

    # 2. Extract configuration and query filtering strings from GET request
    per_page = request.GET.get("per_page", "10")
    page_number = request.GET.get("page", 1)
    
    search_query = request.GET.get("search", "").strip()
    search_sender = request.GET.get("sender", "").strip()
    search_subject = request.GET.get("subject_filter", "").strip()
    
    # Extract Server-Side Date Range Limits
    start_date = request.GET.get("start_date", "").strip()
    end_date = request.GET.get("end_date", "").strip()

    # 3. Apply programmatic list filtering based on dictionary keys (Case-Insensitive)
    if search_query:
        raw_data = [
            item for item in raw_data 
            if search_query.lower() in str(item.get("darta_number", "")).lower()
        ]
        
    if search_sender:
        raw_data = [
            item for item in raw_data 
            if search_sender.lower() in str(item.get("letter_sender", "")).lower()
        ]
        
    if search_subject:
        raw_data = [
            item for item in raw_data 
            if search_subject.lower() in str(item.get("subject", "")).lower()
        ]

    # Server-Side Date Range Filter Execution (YYYY-MM-DD string comparisons match chronologically)
    if start_date:
        raw_data = [
            item for item in raw_data 
            if item.get("darta_date") and item.get("darta_date") >= start_date
        ]
        
    if end_date:
        raw_data = [
            item for item in raw_data 
            if item.get("darta_date") and item.get("darta_date") <= end_date
        ]

    # 4. Compute Dynamic Pagination Boundaries safely
    if per_page == "all":
        limit = len(raw_data) if len(raw_data) > 0 else 10
    else:
        try:
            limit = int(per_page)
        except ValueError:
            limit = 10

    paginator = Paginator(raw_data, limit)
    page_obj = paginator.get_page(page_number)

    # 5. Build dynamic backend elided navigation window ranges
    if per_page == "all":
        custom_page_range = [1]
    else:
        custom_page_range = paginator.get_elided_page_range(
            number=page_obj.number, 
            on_each_side=2, 
            on_ends=2
        )

    # 6. Hand off payload context metrics to view template engine
    return render(
        request,
        "darta/darta_list.html",
        {
            "page_obj": page_obj, 
            "per_page": per_page,
            "custom_page_range": custom_page_range,
            "search_query": search_query,
            "search_sender": search_sender,
            "search_subject": search_subject,
            "start_date": start_date,
            "end_date": end_date,
        },
    )
# PAGE 2: Structural Single Item Detail Inspector
@login_required
@user_passes_test(lambda u: u.is_superuser)
def darta_detail_view(request, pk):
    endpoint_url = f"{API_BASE_URL}{pk}/"

    try:
        response = requests.get(endpoint_url, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            instance_data = response.json()
        else:
            messages.error(request, "विवरण फेला परेन। (Data not found.)")
            return redirect("darta_list")
    except requests.exceptions.RequestException as e:
        messages.error(request, f"API Connection Failure: {e}")
        return redirect("darta_list")

    return render(
        request,
        "darta/darta_form.html",
        {"instance": instance_data, "is_edit_mode": False, "is_detail_mode": True},
    )


# PAGE 3: Document Insertion Framework
@login_required
@user_passes_test(lambda u: u.is_superuser)
def darta_create_view(request):
    if request.method == "POST":
        payload = {
    "darta_samuha": request.POST.get("darta_samuha"),
    "darta_date": request.POST.get("darta_date"),
    "letter_sender": request.POST.get("letter_sender"),
    "sender_email": request.POST.get("sender_email") or None,
    "sender_address": request.POST.get("sender_address") or None,
    "letter_date": request.POST.get("letter_date") or None,
    "ref_number": request.POST.get("ref_number") or None,
    "receiver_section": request.POST.get("receiver_section"),
    "subject": request.POST.get("subject"),
    "remarks": request.POST.get("remarks") or None,
}

        try:
            response = requests.post(
                API_BASE_URL, json=payload, timeout=REQUEST_TIMEOUT
            )
            if response.status_code in [200, 201]:
                messages.success(request, "नयाँ दर्ता सफलतापूर्वक थपियो।")
                return redirect("darta_list")
            else:
                messages.error(
                    request,
                    f"दर्ता असफल भयो (API Error {response.status_code}): {response.text}",
                )
        except requests.exceptions.RequestException as e:
            messages.error(request, f"Network Connection Error: {e}")

    # -------------------------------------------------------------------------
    # 2. GET ACTION: Initialize system token count sequences
    # -------------------------------------------------------------------------
    next_darta_number = ""
    try:
        response = requests.get(API_NEXT_NUMBER_URL, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            api_data = response.json()
            next_darta_number = api_data.get("next_darta_number", "")
    except requests.exceptions.RequestException:
        next_darta_number = "Auto"

    instance_data = {"darta_number": next_darta_number}

    return render(
        request,
        "darta/darta_form.html",
        {"instance": instance_data, "is_edit_mode": False},
    )


# PAGE 4: Document Modification Module
@login_required
@user_passes_test(lambda u: u.is_superuser)
def darta_edit_view(request, pk):
    endpoint_url = f"{API_BASE_URL}{pk}/"

    # 1. POST ACTION: Dispatch atomic structural updates via PATCH
    if request.method == "POST":
        payload = {
            "darta_samuha": request.POST.get("darta_samuha"),
            "darta_date": request.POST.get("darta_date"),
            "letter_sender": request.POST.get("letter_sender"),
            "sender_email": request.POST.get("sender_email") or None,
            "sender_address": request.POST.get("sender_address") or None,
            "letter_date": request.POST.get("letter_date") or None,
            "ref_number": request.POST.get("ref_number"),
            "receiver_section": request.POST.get("receiver_section"),
            "subject": request.POST.get("subject"),
            "remarks": request.POST.get("remarks") or None,
        }

        try:
            response = requests.patch(
                endpoint_url, json=payload, timeout=REQUEST_TIMEOUT
            )
            if response.status_code in [200, 204]:
                messages.success(request, "दर्ता विवरण सफलतापूर्वक सुरक्षित गरियो।")
                return redirect("darta_list")
            else:
                messages.error(
                    request,
                    f"परिमार्जन असफल भयो (API Error {response.status_code}): {response.text}",
                )
        except requests.exceptions.RequestException as e:
            messages.error(request, f"API Connectivity Error: {e}")

    # 2. GET ACTION: Fetch resource records for form initialization
    try:
        response = requests.get(endpoint_url, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            instance_data = response.json()
        else:
            messages.error(
                request,
                f"अभिलेख फेला परेन। (API Status Code: {response.status_code})",
            )
            return redirect("darta_list")
    except requests.exceptions.RequestException as e:
        messages.error(request, f"API connection failure: {e}")
        return redirect("darta_list")

    return render(
        request,
        "darta/darta_form.html",
        {"instance": instance_data, "is_edit_mode": True},
    )


# ACTION 1: Excel Binary Spreadsheet Transformer Engine
@login_required
def export_darta_excel(request):
    raw_data = fetch_all_darta_from_api()

    if not raw_data:
        messages.warning(request, "निर्यात गर्नका लागि कुनै डाटा उपलब्ध छैन।")
        return redirect("darta_list")

    df = pd.DataFrame(raw_data)
    df.columns = [col.replace("_", " ").title() for col in df.columns]

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=Darta_Report_2026.xlsx"

    with pd.ExcelWriter(response, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Darta Records")

    return response


# ACTION 2: Native PDF Print Interface Rendering Engine
@login_required
def export_darta_pdf(request):
    raw_data = fetch_all_darta_from_api()
    return render(
        request, "darta/darta_print_template.html", {"records": raw_data}
    )