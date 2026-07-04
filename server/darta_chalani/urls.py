from django.urls import path

from .view.template_views.office_setup import designation_view_template
from .view.template_views.dashboard_view import dashboard_view
from .view.template_views.office_setup import office_info_view
from .view.template_views.office_setup import section_view_template
from .view.template_views import darta_views
from .view.template_views.office_setup import level_view_template
from .view.template_views.office_setup import employee_view_template

urlpatterns = [
    path("", dashboard_view, name="home"),

    # Darta Templates Engine Routes 
    path('darta/', darta_views.darta_list_view, name="darta_list"),
    path("darta/add/", darta_views.darta_create_view, name="add_darta"),
    path("darta/<int:pk>/", darta_views.darta_detail_view, name="darta_detail"),
    path("darta/<int:pk>/edit/", darta_views.darta_edit_view, name="edit_darta"),
    path("darta/export_pdf/", darta_views.export_darta_pdf, name="export_darta_pdf"),
    path("darta/export_excel/", darta_views.export_darta_excel, name="export_darta_excel"),

    # Standardized Office Architecture Configs
    path("office/", office_info_view.office_view, name="office_list"),  # Matches templates
    path("office/add/", office_info_view.office_create_view, name="add_office"),
    path("office/<int:pk>/", office_info_view.office_detail_view, name="office_detail"),
    path("office/<int:pk>/edit/", office_info_view.office_edit_view, name="office_edit"),

    # section template view configs
    path("section/", section_view_template.section_list_view, name="section_list"),  # Matches templates
    path("section/add/", section_view_template.section_create_view, name="add_section"),
    path("section/<int:pk>/", section_view_template.section_detail_view, name="section_detail"),
    path("section/<int:pk>/edit/", section_view_template.section_edit_view, name="edit_section"),

     # section template view configs
    path("designation/", designation_view_template.designation_list_view, name="designation_list"),  # Matches templates
    path("designation/add/", designation_view_template.designation_create_view, name="add_designation"),
    path("designation/<int:pk>/", designation_view_template.designation_detail_view, name="designation_detail"),
    path("designation/<int:pk>/edit/", designation_view_template.designation_edit_view, name="edit_designation"),

    # level template view configs
    path("level/", level_view_template.level_list_view, name="level_list"),
    path("level/add/", level_view_template.level_create_view, name="add_level"),
    path("level/<int:pk>/", level_view_template.level_detail_view, name="level_detail"),
    path("level/<int:pk>/edit/", level_view_template.level_edit_view, name="edit_level"),

    # employee template view configs
    path("employee/", employee_view_template.employee_list_view, name="employee_list"),
    path("employee/add/", employee_view_template.employee_create_view, name="add_employee"),
    path("employee/<int:pk>/", employee_view_template.employee_detail_view, name="employee_detail"),
    path("employee/<int:pk>/edit/", employee_view_template.employee_edit_view, name="edit_employee"),
    
]