from django.urls import path
from .view.template_views.dashboard_view import dashboard_view
from .view.template_views.office_setup import office_info_view
from .view.template_views import darta_views
# app_name = "darta_chalani"


urlpatterns = [

    path("", dashboard_view, name="home"),

    # darta Template url 
    path('darta/',darta_views.darta_list_view, name="darta_list" ),
    path("darta/add/", darta_views.darta_create_view, name="add_darta"),
    path("darta/<int:pk>/", darta_views.darta_detail_view, name="darta_detail"),
    path("darta/<int:pk>/edit/", darta_views.darta_edit_view, name="edit_darta"),
    path("darta/export_pdf/", darta_views.export_darta_pdf, name="export_darta_pdf"),
    path("darta/export_excel/", darta_views.export_darta_excel, name="export_darta_excel"),



    path("office/", office_info_view.office_list_view, name="office_list"),
    path("office/add/", office_info_view.office_create_view, name="add_office"),
    path("office/<int:pk>/", office_info_view.office_detail_view, name="office_detail"),
    path("office/<int:pk>/edit/", office_info_view.office_edit_view, name="edit_office"),

]