from django.urls import path
from .views import (
    launchpad_view,
    login_view,
    logout_view,
    user_management_panel_view,
    delete_user_view,
)

urlpatterns = [
    path('', launchpad_view, name='launchpad'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('user-management/', user_management_panel_view, name='user_management'),
    path('user-management/delete/<int:pk>/', delete_user_view, name='delete_user'),
]
