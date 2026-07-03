import pandas as pd
import requests
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator
from django.http import HttpResponse
from django.shortcuts import redirect, render

# --- System API Configurations ---
API_BASE_URL = "http://127.0.0.1:8000/api/v1/darta-chalani/section/"
REQUEST_TIMEOUT = 5  # Network thread safety limit in seconds

# darta_chalani/urls_api.py or views
from rest_framework.views import APIView
from rest_framework.response import Response

def fetch_all_section_from_api():
    """Centrally isolation helper to fetch live datasets from the DRF endpoint."""
    try:
        response = requests.get(API_BASE_URL, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            return response.json()
    except requests.exceptions.RequestException:
        pass
    return []


@login_required
def section_dashboard(request):
    return render(request, "dashboard.html")
@login_required
def section_list_view(request):
    # 1. Fetch live baseline dataset from API endpoint
    raw_data = fetch_all_section_from_api()

    # 2. Extract configuration and query filtering strings from GET request
    per_page = request.GET.get("per_page", "10")
    page_number = request.GET.get("page", 1)
    
    search_query = request.GET.get("search", "").strip()
    search_section_name = request.GET.get("section_name", "").strip()
    
    # 3. Apply programmatic list filtering based on dictionary keys (Case-Insensitive)
    if search_query:
        raw_data = [
            item for item in raw_data 
            if search_query.lower() in str(item.get("darta_number", "")).lower()
        ]
        
    if search_section_name:
        raw_data = [
            item for item in raw_data 
            if search_section_name.lower() in str(item.get("letter_sender", "")).lower()
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
        "office_setup/sections/section_list.html",
        {
            "page_obj": page_obj, 
            "per_page": per_page,
            "custom_page_range": custom_page_range,
            "search_query": search_query,
            "search_section_name": search_section_name,
        },
    )
# PAGE 2: Structural Single Item Detail Inspector
@login_required
@user_passes_test(lambda u: u.is_superuser)
def section_detail_view(request, pk):
    endpoint_url = f"{API_BASE_URL}{pk}/"

    try:
        response = requests.get(endpoint_url, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            instance_data = response.json()
        else:
            messages.error(request, "विवरण फेला परेन। (Section not found.)")
            return redirect("section_list")
    except requests.exceptions.RequestException as e:
        messages.error(request, f"API Connection Failure: {e}")
        return redirect("section_list")

    return render(
        request,
        "office_setup/sections/section_form.html",
        {"instance": instance_data, "is_edit_mode": False, "is_detail_mode": True},
    )


# PAGE 3: Document Insertion Framework
@login_required
@user_passes_test(lambda u: u.is_superuser)
def section_create_view(request):
    if request.method == "POST":
        payload = {
    "section_name": request.POST.get("section_name"),
    "section_eng_name": request.POST.get("section_eng_name"),
    "section_rank_number": request.POST.get("section_rank_number")
}

        try:
            response = requests.post(
                API_BASE_URL, json=payload, timeout=REQUEST_TIMEOUT
            )
            if response.status_code in [200, 201]:
                messages.success(request, "नयाँ शाखा सफलतापूर्वक थपियो।")
                return redirect("section_list")
            else:
                messages.error(
                    request,
                    f"शाखा असफल भयो (API Error {response.status_code}): {response.text}",
                )
        except requests.exceptions.RequestException as e:
            messages.error(request, f"Network Connection Error: {e}")
    return render(
        request,
        "office_setup/sections/section_form.html",
        { "is_edit_mode": False},
    )


# PAGE 4: Document Modification Module
@login_required
@user_passes_test(lambda u: u.is_superuser)
def section_edit_view(request, pk):
    endpoint_url = f"{API_BASE_URL}{pk}/"

    # 1. POST ACTION: Dispatch atomic structural updates via PATCH
    if request.method == "POST":
        payload = {
            "section_name": request.POST.get("section_name"),
            "section_eng_name": request.POST.get("section_eng_name"),
            "section_rank_number": request.POST.get("section_rank_number")
        }

        try:
            response = requests.patch(
                endpoint_url, json=payload, timeout=REQUEST_TIMEOUT
            )
            if response.status_code in [200, 204]:
                messages.success(request, "शाखा विवरण सफलतापूर्वक सुरक्षित गरियो।")
                return redirect("section_list")
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
            return redirect("section_list")
    except requests.exceptions.RequestException as e:
        messages.error(request, f"API connection failure: {e}")
        return redirect("section_list")

    return render(
        request,
        "office_setup/sections/section_form.html",
        {"instance": instance_data, "is_edit_mode": True},
    )
