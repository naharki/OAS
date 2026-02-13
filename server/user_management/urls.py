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

# create-app
    path("create-app/", CreateAppView.as_view()),
    path("apps/", AppListView.as_view()),
    # admin -level 
    path("create-admin/", CreateAdminView.as_view()),
    path("admins/", AdminListView.as_view()),
    path("update-admin/<int:pk>/", AdminDetailView.as_view()),
    path("delete-admin/<int:pk>/", AdminDeleteView.as_view()),

# user created by admin
    path("create-user/", CreateUserView.as_view()),
]
