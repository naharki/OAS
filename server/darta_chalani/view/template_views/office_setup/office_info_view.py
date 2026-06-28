import requests
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator
from django.shortcuts import redirect, render

API_BASE_URL = "http://127.0.0.1:8000/api/v1/darta-chalani/office-profile/"
REQUEST_TIMEOUT = 5

def dashboard_index_view(request):
    """
    Renders the unified main launchpad ecosystem index. 
    Session permissions conditionally hide or show sensitive functional modules.
    """
    raw_data = fetch_all_offices_from_api()
    office_count = len(raw_data) if raw_data else 0
    return render(request, "office_setup/index.html", {"office_count": office_count})

def fetch_all_offices_from_api():
    try:
        response = requests.get(API_BASE_URL, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            res_json = response.json()
            if isinstance(res_json, dict) and "data" in res_json:
                return res_json["data"]
            return res_json
    except requests.exceptions.RequestException:
        pass
    return []

@login_required
def office_list_view(request):
    raw_data = fetch_all_offices_from_api()
    per_page = request.GET.get("per_page", 10)
    paginator = Paginator(raw_data, per_page)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(
        request,
        "office_setup/office_info/office_list.html",
        {"page_obj": page_obj, "per_page": int(per_page)},
    )

@login_required
@user_passes_test(lambda u: u.is_superuser)
def office_detail_view(request, pk):
    endpoint_url = f"{API_BASE_URL}{pk}/"
    try:
        response = requests.get(endpoint_url, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            res_json = response.json()
            instance_data = res_json.get("data", res_json) if isinstance(res_json, dict) else res_json
        else:
            messages.error(request, "विवरण फेला परेन।")
            return redirect("office_list")
    except requests.exceptions.RequestException as e:
        messages.error(request, f"API Connectivity Error: {e}")
        return redirect("office_list")

    return render(
        request,
        "office_setup/office_info/office_form.html",
        {"instance": instance_data, "is_edit_mode": False, "is_detail_mode": True},
    )

@login_required
@user_passes_test(lambda u: u.is_superuser)
def office_create_view(request):
    if request.method == "POST":
        payload = {
            "name": request.POST.get("name"),
            "full_name": request.POST.get("full_name"),
            "location": request.POST.get("location"),
            "established_date": request.POST.get("established_date") or None,
            "email": request.POST.get("email"),
            "phone_number": request.POST.get("phone_number"),
            "website": request.POST.get("website"),
            "slogan": request.POST.get("slogan"),
            "is_active": request.POST.get("is_active") == "True",
        }
        files = {}
        if "nishan_chap" in request.FILES:
            files["nishan_chap"] = request.FILES["nishan_chap"]
        if "office_logo" in request.FILES:
            files["office_logo"] = request.FILES["office_logo"]

        try:
            response = requests.post(API_BASE_URL, data=payload, files=files, timeout=REQUEST_TIMEOUT)
            if response.status_code in [200, 201]:
                messages.success(request, "कार्यालय सफलतापूर्वक थपियो।")
                return redirect("office_list")
            messages.error(request, f"त्रुटी (API Error): {response.text}")
        except requests.exceptions.RequestException as e:
            messages.error(request, f"Network Failure: {e}")

    return render(
        request,
        "office_setup/office_info/office_form.html",
        {"is_edit_mode": False, "is_detail_mode": False},
    )

@login_required
@user_passes_test(lambda u: u.is_superuser)
def office_edit_view(request, pk):
    endpoint_url = f"{API_BASE_URL}{pk}/"

    if request.method == "POST":
        payload = {
            "name": request.POST.get("name"),
            "full_name": request.POST.get("full_name"),
            "location": request.POST.get("location"),
            "established_date": request.POST.get("established_date") or None,
            "email": request.POST.get("email"),
            "phone_number": request.POST.get("phone_number"),
            "website": request.POST.get("website"),
            "slogan": request.POST.get("slogan"),
            "is_active": request.POST.get("is_active") == "True",
        }
        files = {}
        if "nishan_chap" in request.FILES:
            files["nishan_chap"] = request.FILES["nishan_chap"]
        if "office_logo" in request.FILES:
            files["office_logo"] = request.FILES["office_logo"]

        try:
            response = requests.patch(endpoint_url, data=payload, files=files, timeout=REQUEST_TIMEOUT)
            if response.status_code in [200, 204]:
                messages.success(request, "कार्यालय विवरण सफलतापूर्वक सुरक्षित गरियो।")
                return redirect("office_list")
            messages.error(request, f"परिमार्जन असफल: {response.text}")
        except requests.exceptions.RequestException as e:
            messages.error(request, f"Network Connection Error: {e}")

    try:
        response = requests.get(endpoint_url, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            res_json = response.json()
            instance_data = res_json.get("data", res_json) if isinstance(res_json, dict) else res_json
        else:
            messages.error(request, "अभिलेख फेला परेन।")
            return redirect("office_list")
    except requests.exceptions.RequestException as e:
        messages.error(request, f"API Connection failure: {e}")
        return redirect("office_list")

    return render(
        request,
        "office_setup/office_info/office_form.html",
        {"instance": instance_data, "is_edit_mode": True, "is_detail_mode": False},
    )