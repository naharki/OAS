from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.urls import reverse

def app_access_required(app_name):
    """
    Decorator for views that checks whether the logged-in user has access
    to the specified application. Super Admin always has access.
    Admins and Data Entry staff must be explicitly mapped.
    Raises PermissionDenied (403) if unauthorized.
    """
    def decorator(view_func):
        def _wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return redirect(f"{reverse('login')}?next={request.path}")
            
            # Super Admin bypasses app assignment checks
            if request.user.role == 'superadmin':
                return view_func(request, *args, **kwargs)
            
            # Check assigned apps
            if request.user.assigned_apps.filter(name__iexact=app_name).exists():
                return view_func(request, *args, **kwargs)
            
            raise PermissionDenied("You do not have access to this application.")
        return _wrapped_view
    return decorator
