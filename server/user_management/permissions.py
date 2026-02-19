from rest_framework.permissions import BasePermission

class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and request.user.role == 'superadmin'
        )

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and request.user.role=='admin'
        )

class HasAppAccess(BasePermission):
    def has_permission (self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.role =='superadmin':
            return True
        app_name = getattr(view, 'app_name', None)
        if not app_name:
            return False
        return request.user.assigned_apps.filter(name= app_name).exists()