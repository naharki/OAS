import requests
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import redirect, render

API_BASE_URL = "http://127.0.0.1:8000/api/v1/darta-chalani/office/"
REQUEST_TIMEOUT = 5


def fetch_all_offices_from_api(request=None):
    """
    Fetches offices from API. Differentiates between an empty database
    and an absolute network or API failure using None vs [].
    """
    try:
        response = requests.get(API_BASE_URL, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                return result.get("data", [])
            return result.get("data", [])  # Return raw array fallback
    except requests.exceptions.RequestException as e:
        if request:
            messages.error(request, f"सिस्टम API सँग सम्पर्क हुन सकेन (API Connection Error): {str(e)}")
    return None  # None indicates system level failure, not empty array


# @login_required
# def office_view(request):
#     """
#     If office exists -> Redirect to Edit page
#     If office doesn't exist -> Redirect to Create page
#     If API is broken -> Display failure layout gracefully
#     """
#     offices = fetch_all_offices_from_api(request)

#     if offices is None:
#         # Prevent forwarding to entry form if service layer is broken
#         return render(request, "office_setup/office_info/office_info_form.html", {"api_error": True})

#     if len(offices) > 0:
#         return redirect("office_edit", pk=offices[0]["id"])

#     return redirect("add_office")
@login_required
def office_view(request):
    """
    Acts as the entry router when the user clicks 'कार्यालय विवरण' in the sidebar.
    Redirects to the Detail view if an office exists.
    """
    offices = fetch_all_offices_from_api(request)

    if offices is None:
        return render(request, "office_setup/office_info/office_info_form.html", {"api_error": True})

    if len(offices) > 0:
        # REDIRECT TO DETAIL VIEW INSTEAD OF EDIT
        first_office_id = offices[0]["id"]
        return redirect("office_detail", pk=first_office_id)

    # If no office configuration exists at all, send them to create one
    return redirect("add_office")

@login_required
@user_passes_test(lambda u: u.is_superuser)
def office_detail_view(request, pk):
    endpoint = f"{API_BASE_URL}{pk}/"
    try:
        response = requests.get(endpoint, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            result = response.json()
            instance = result.get("data", result)

            return render(
                request,
                "office_setup/office_info/office_info_form.html",  # Reusing clean structural layout
                {
                    "instance": instance,
                    "is_detail_mode": True,
                    "is_edit_mode": False,
                },
            )
    except requests.exceptions.RequestException as e:
        messages.error(request, f"विवरण प्राप्त गर्न असफल: {str(e)}")

    return redirect("office_list")


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
            "is_active": "is_active" in request.POST,  # Bulletproof checkbox assignment
        }

        files = {}
        if request.FILES.get("office_logo"):
            files["office_logo"] = request.FILES["office_logo"]
        if request.FILES.get("nishan_chap"):
            files["nishan_chap"] = request.FILES["nishan_chap"]

        try:
            response = requests.post(
                API_BASE_URL,
                data=payload,
                files=files,
                timeout=REQUEST_TIMEOUT,
            )

            if response.status_code in [200, 201]:
                messages.success(request, "कार्यालय सफलतापूर्वक थपियो।")
                return redirect("office_list")

            messages.error(request, f"API Error ({response.status_code}): {response.text}")

        except requests.exceptions.RequestException as e:
            messages.error(request, f"अनुरोध त्रुटि: {str(e)}")

    return render(
        request,
        "office_setup/office_info/office_info_form.html",
        {
            "is_edit_mode": False,
            "is_detail_mode": False,
        },
    )


@login_required
@user_passes_test(lambda u: u.is_superuser)
def office_edit_view(request, pk):
    endpoint = f"{API_BASE_URL}{pk}/"

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
            "is_active": "is_active" in request.POST,
        }

        files = {}
        if request.FILES.get("office_logo"):
            files["office_logo"] = request.FILES["office_logo"]
        if request.FILES.get("nishan_chap"):
            files["nishan_chap"] = request.FILES["nishan_chap"]

        try:
            response = requests.patch(
                endpoint,
                data=payload,
                files=files,
                timeout=REQUEST_TIMEOUT,
            )

            if response.status_code in [200, 204]:
                messages.success(request, "कार्यालय विवरण अद्यावधिक गरियो।")
                return redirect("office_list")

            messages.error(request, f"अपडेट असफल भयो: {response.text}")

        except requests.exceptions.RequestException as e:
            messages.error(request, f"सञ्जाल त्रुटि: {str(e)}")

    try:
        response = requests.get(endpoint, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            result = response.json()
            instance = result.get("data", result)

            return render(
                request,
                "office_setup/office_info/office_info_form.html",
                {
                    "instance": instance,
                    "is_edit_mode": True,
                    "is_detail_mode": False,
                },
            )
    except requests.exceptions.RequestException as e:
        messages.error(request, f"डाटा लोड गर्न असफल: {str(e)}")

    return redirect("office_list")