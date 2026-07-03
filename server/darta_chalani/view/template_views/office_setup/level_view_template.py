import pandas as pd
import requests
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator
from django.http import HttpResponse
from django.shortcuts import redirect, render

# --- System API Configurations ---
API_BASE_URL = "http://127.0.0.1:8000/api/v1/darta-chalani/level/"
REQUEST_TIMEOUT = 5  # Network thread safety limit in seconds

# Human-friendly mapping to hide database/model variable names from users
FIELD_MAPPING = {
    "level_name": "स्तरको नाम",
    "level_eng_name": "अंग्रेजी नाम",
    "level_rank_number": "Rank",
    "non_field_errors": "विवरण"
}


def clean_api_errors(error_data):
    """
    Best Practice Interceptor: Transforms raw API validation messages into 
    clean, user-friendly language, removing structural database or model metadata.
    """
    error_msgs = []
    for field, errors in error_data.items():
        # 1. Translate structural dictionary key names
        friendly_field_name = FIELD_MAPPING.get(field, field.replace('_', ' ').title())
        
        # 2. Convert error list to string
        error_text = ', '.join(errors)
        
        # 3. Strip out default automated database constraints/model metadata strings
        error_text = error_text.replace("level_model with this ", "")
        error_text = error_text.replace("level_model ", "")
        error_text = error_text.replace("level rank number", "Rank")
        error_text = error_text.replace("level name", "स्तरको नाम")
        
        error_msgs.append(f"{friendly_field_name}: {error_text}")
        
    return " | ".join(error_msgs)


def fetch_all_level_from_api():
    """Centrally isolated helper to fetch live datasets from the DRF endpoint."""
    try:
        response = requests.get(API_BASE_URL, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            return response.json()
    except requests.exceptions.RequestException:
        pass
    return []


@login_required
def designation_dashboard(request):
    return render(request, "dashboard.html")


@login_required
def level_list_view(request):
    raw_data = fetch_all_level_from_api()

    per_page = request.GET.get("per_page", "10")
    page_number = request.GET.get("page", 1)
    
    search_query = request.GET.get("search", "").strip()
    search_section_name = request.GET.get("section_name", "").strip()
    
    if search_query:
        raw_data = [
            item for item in raw_data 
            if search_query.lower() in str(item.get("level_name", "")).lower()
        ]
        
    if search_section_name:
        raw_data = [
            item for item in raw_data 
            if search_section_name.lower() in str(item.get("level_eng_name", "")).lower()
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
        "office_setup/level/level_list.html",
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
def level_detail_view(request, pk):
    endpoint_url = f"{API_BASE_URL}{pk}/"

    try:
        response = requests.get(endpoint_url, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            instance_data = response.json()
        else:
            messages.error(request, "विवरण फेला परेन। (Level not found.)")
            return redirect("level_list")
    except requests.exceptions.RequestException as e:
        messages.error(request, f"API Connection Failure: {e}")
        return redirect("level_list")

    return render(
        request,
        "office_setup/level/level_form.html",
        {"instance": instance_data, "is_edit_mode": False, "is_detail_mode": True},
    )


# PAGE 3: Document Insertion Framework
@login_required
@user_passes_test(lambda u: u.is_superuser)
def level_create_view(request):
    payload = None
    
    if request.method == "POST":
        payload = {
            "level_name": request.POST.get("level_name"),
            "level_eng_name": request.POST.get("level_eng_name"),
            "level_rank_number": request.POST.get("level_rank_number")
        }

        try:
            response = requests.post(API_BASE_URL, json=payload, timeout=REQUEST_TIMEOUT)
            
            if response.status_code in [200, 201]:
                messages.success(request, "नयाँ तह सफलतापूर्वक थपियो।")
                return redirect("level_list")
            
            elif response.status_code == 400:
                try:
                    friendly_error = clean_api_errors(response.json())
                except ValueError:
                    friendly_error = response.text
                
                messages.error(request, f"तह थप असफल! {friendly_error}")
            else:
                messages.error(request, f"सर्भरमा समस्या आयो (API Error {response.status_code})")
                
        except requests.exceptions.RequestException as e:
            messages.error(request, f"Network Connection Error: {e}")

    return render(
        request,
        "office_setup/level/level_form.html",
        {
            "is_edit_mode": False, 
            "is_detail_mode": False,
            "instance": payload  
        },
    )


# PAGE 4: Document Modification Module
@login_required
@user_passes_test(lambda u: u.is_superuser)
def level_edit_view(request, pk):
    endpoint_url = f"{API_BASE_URL}{pk}/"
    instance_data = None

    if request.method == "POST":
        payload = {
            "level_name": request.POST.get("level_name"),
            "level_eng_name": request.POST.get("level_eng_name"),
            "level_rank_number": request.POST.get("level_rank_number")
        }

        try:
            response = requests.patch(endpoint_url, json=payload, timeout=REQUEST_TIMEOUT)
            
            if response.status_code in [200, 204]:
                messages.success(request, "तह विवरण सफलतापूर्वक सुरक्षित गरियो।")
                return redirect("level_list")
            
            elif response.status_code == 400:
                try:
                    friendly_error = clean_api_errors(response.json())
                except ValueError:
                    friendly_error = response.text
                
                messages.error(request, f"तह संशोधन असफल! {friendly_error}")
                instance_data = payload  
            else:
                messages.error(request, f"तह संशोधन असफल भयो (API Error {response.status_code})")
                instance_data = payload
                
        except requests.exceptions.RequestException as e:
            messages.error(request, f"API Connectivity Error: {e}")
            instance_data = payload

    if instance_data is None:
        try:
            response = requests.get(endpoint_url, timeout=REQUEST_TIMEOUT)
            if response.status_code == 200:
                instance_data = response.json()
            else:
                messages.error(request, f"अभिलेख फेला परेन। (API Status Code: {response.status_code})")
                return redirect("level_list")
        except requests.exceptions.RequestException as e:
            messages.error(request, f"API connection failure: {e}")
            return redirect("level_list")

    return render(
        request,
        "office_setup/level/level_form.html",
        {
            "instance": instance_data, 
            "is_edit_mode": True,
            "is_detail_mode": False
        },
    )