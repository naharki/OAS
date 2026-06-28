from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages

def home_view(request):
    """Renders the central applications grid portal framework."""
    apps_list = [
        {
            "name": "Darta Chalani", 
            "description": "Track, register, and route incoming (Darta) and outgoing (Chalani) official documents.", 
            "url": "/darta-chalani/",
            "icon": "📝",
            "badge": "Active"
        },
        {
            "name": "Planning Module", 
            "description": "Manage rural municipality development plans, budget allocations, and execution tracking.", 
            "url": "/under-construction/",
            "icon": "📊",
            "badge": "Planning"
        },
        {
            "name": "User Management", 
            "description": "Administer system roles, permissions, employee accounts, and security logs.", 
            "url": "/admin/",
            "icon": "👥",
            "badge": "Admin Only"
        },
        {
            "name": "Core System Settings", 
            "description": "Configure base office details, fiscal years, ward boundaries, and committee structures.", 
            "url": "/api/",
            "icon": "⚙️",
            "badge": "System"
        }
    ]
    return render(request, 'apps_list.html', {'apps': apps_list})


def under_construction_view(request):
    """Graceful route parking configuration template switcher."""
    return render(request, 'under_construction.html')


def login_page_view(request):
    """Renders standard Django Form authentication pages or redirects active users."""
    if request.user.is_authenticated:
        return redirect('home')
        
    if request.method == "POST":
        # Handle standard HTML fallback login submit actions cleanly
        username = request.POST.get('username')
        password = request.POST.get('password')
        next_url = request.POST.get('next', '/')
        
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect(next_url if next_url else 'home')
        else:
            return render(request, 'login.html', {'form': {'errors': True}})
            
    return render(request, 'login.html')


def logout_action_view(request):
    """Destroys current active user browser session."""
    logout(request)
    return redirect('home')