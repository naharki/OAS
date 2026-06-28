from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.exceptions import PermissionDenied
from django.urls import reverse
from django.conf import settings
from django.contrib import messages
from rest_framework_simplejwt.tokens import RefreshToken
from user_management.models import User, App

def login_view(request):
    """
    Renders login screen and validates user.
    Sets standard Django session and JWT access/refresh token cookies.
    """
    if request.user.is_authenticated:
        return redirect('launchpad')

    next_url = request.GET.get('next', 'launchpad')

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(username=username, password=password)
        if user is not None:
            # Login for Django session views
            auth_login(request, user)

            # Generate JWT tokens for DRF API endpoints
            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)

            response = redirect(next_url)
            
            # Use secure cookies if in production
            secure_cookie = not settings.DEBUG
            response.set_cookie(
                key='access_token',
                value=access,
                httponly=True,
                samesite='Lax',
                secure=secure_cookie,
                max_age=15 * 60,  # 15 minutes
                path="/",
            )
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                samesite='Lax',
                secure=secure_cookie,
                max_age=7 * 24 * 60 * 60,  # 7 days
                path="/",
            )
            messages.success(request, f"Welcome back, {user.username}!")
            return response
        else:
            messages.error(request, "Invalid username or password.")

    return render(request, 'core_portal/login.html')


def logout_view(request):
    """
    Clears Django session and JWT token cookies.
    """
    auth_logout(request)
    response = redirect('login')
    response.delete_cookie('access_token', path='/')
    response.delete_cookie('refresh_token', path='/')
    messages.success(request, "Logged out successfully.")
    return response


def launchpad_view(request):
    """
    Ecosystem entry launchpad dashboard.
    Guests see login links, authenticated users see only assigned apps.
    """
    if not request.user.is_authenticated:
        public_apps = [
            {
                'name': 'Darta Chalani',
                'description': 'Office Darta & Chalani Registry System',
                'icon': 'file-text',
                'url': reverse('login') + '?next=/darta-chalani/',
                'color': 'from-blue-600 to-indigo-700'
            },
            {
                'name': 'Planning',
                'description': 'Municipal Planning, Budgeting, & Committee Management',
                'icon': 'calendar-days',
                'url': reverse('login') + '?next=/planning/',
                'color': 'from-emerald-500 to-teal-700'
            },
        ]
        return render(request, 'core_portal/launchpad.html', {'apps': public_apps, 'is_guest': True})

    user = request.user
    apps = []

    # Map application visibility based on role mapping
    if user.role == 'superadmin':
        apps = [
            {
                'name': 'Darta Chalani',
                'description': 'Office Darta & Chalani Registry System',
                'icon': 'file-text',
                'url': '/darta-chalani/',
                'color': 'from-blue-600 to-indigo-700'
            },
            {
                'name': 'Planning',
                'description': 'Municipal Planning, Budgeting, & Committee Management',
                'icon': 'calendar-days',
                'url': '/planning/',
                'color': 'from-emerald-500 to-teal-700'
            },
            {
                'name': 'User Management',
                'description': 'Administrative System Engine',
                'icon': 'shield-check',
                'url': '/user-management/',
                'color': 'from-rose-500 to-red-700'
            },
        ]
    else:
        assigned = user.assigned_apps.all()
        for app in assigned:
            if app.name == 'Darta Chalani':
                apps.append({
                    'name': 'Darta Chalani',
                    'description': 'Office Darta & Chalani Registry System',
                    'icon': 'file-text',
                    'url': '/darta-chalani/',
                    'color': 'from-blue-600 to-indigo-700'
                })
            elif app.name == 'Planning':
                apps.append({
                    'name': 'Planning',
                    'description': 'Municipal Planning, Budgeting, & Committee Management',
                    'icon': 'calendar-days',
                    'url': '/planning/',
                    'color': 'from-emerald-500 to-teal-700'
                })

    return render(request, 'core_portal/launchpad.html', {'apps': apps, 'is_guest': False})


@login_required
@user_passes_test(lambda u: u.role == 'superadmin', login_url='/')
def user_management_panel_view(request):
    """
    Administrative Portal Panel. Only Super Admins can manage users.
    """
    users = User.objects.all().order_by('-id')
    apps = App.objects.all()

    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'create':
            username = request.POST.get('username')
            email = request.POST.get('email')
            password = request.POST.get('password')
            role = request.POST.get('role')
            app_ids = request.POST.getlist('apps')

            if not username or not password:
                messages.error(request, "Username and Password are required.")
            elif User.objects.filter(username=username).exists():
                messages.error(request, "Username is already taken.")
            else:
                new_user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    role=role
                )
                if role != 'superadmin':
                    new_user.assigned_apps.set(App.objects.filter(id__in=app_ids))
                messages.success(request, f"User {username} created successfully!")
                return redirect('user_management')

        elif action == 'edit':
            user_id = request.POST.get('user_id')
            user_to_edit = get_object_or_404(User, id=user_id)
            
            # Prevent altering self or other superadmins
            if user_to_edit == request.user and request.POST.get('role') != 'superadmin':
                messages.error(request, "You cannot downgrade your own role.")
            else:
                role = request.POST.get('role')
                app_ids = request.POST.getlist('apps')
                email = request.POST.get('email')

                user_to_edit.role = role
                user_to_edit.email = email
                
                password = request.POST.get('password')
                if password and password.strip():
                    user_to_edit.set_password(password)
                
                user_to_edit.save()
                
                if role != 'superadmin':
                    user_to_edit.assigned_apps.set(App.objects.filter(id__in=app_ids))
                else:
                    user_to_edit.assigned_apps.clear()
                    
                messages.success(request, f"User {user_to_edit.username} updated successfully!")
                return redirect('user_management')

    return render(request, 'core_portal/user_management.html', {
        'users': users,
        'apps': apps
    })


@login_required
@user_passes_test(lambda u: u.role == 'superadmin', login_url='/')
def delete_user_view(request, pk):
    """
    Deletes the user from database. Prevents self-deletion.
    """
    user_to_delete = get_object_or_404(User, pk=pk)
    if user_to_delete == request.user:
        messages.error(request, "You cannot delete your own account.")
    else:
        user_to_delete.delete()
        messages.success(request, "User deleted successfully.")
    return redirect('user_management')
