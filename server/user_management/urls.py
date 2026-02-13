from django.urls import path
from .views import (
    AdminDeleteView,
    AdminDetailView,
    AdminListView,
    LoginView,
    LogOutView,
    MeView,
    CreateAppView,
    CreateAdminView,
    CreateUserView,
    AppListView,
)

urlpatterns = [
    path("login/", LoginView.as_view()),
    path("logout/", LogOutView.as_view()),
    path("me/", MeView.as_view()),

    path("create-app/", CreateAppView.as_view()),
    path("apps/", AppListView.as_view()),
    path("create-admin/", CreateAdminView.as_view()),
    path("admins/", AdminListView.as_view()),
    path("update-admin/<int:pk>/", AdminDetailView.as_view()),
    path("delete-admin/<int:pk>/", AdminDeleteView.as_view()),
    path("create-user/", CreateUserView.as_view()),
]
