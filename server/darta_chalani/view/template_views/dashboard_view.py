from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def dashboard_view(request):
    context = {
        "page_title": "Dashboard",
    }
    return render(
        request,
        "dashboard.html",
        context,
    )