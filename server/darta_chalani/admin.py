from django.contrib import admin

from .model.office_setup.designation import Designation_model
from .model.office_setup.section import Section_model
from .model.office_setup.level import Level_model
from .model.darta_chalani.darta import Darta
from .model.darta_chalani.chalani import Chalani
from .model.office_setup.office_info import Office_model
from .model.office_setup.employee import Employee as Employee_model

# Register your models here.

@admin.register(Office_model)
class OfficeAdmin(admin.ModelAdmin):
    list_display = ('name', 'full_name', 'location', 'established_date')
    search_fields = ('name', 'full_name')
    list_filter = ('established_date',)
   


@admin.register(Darta) 
class DartaAdmin(admin.ModelAdmin):
    list_display = ('darta_number', "darta_date","letter_sender","subject",'receiver_section')
    search_fields = ('darta_number',"darta_date","letter_Sender", "subject")
    list_filter = ('darta_number', "darta_date")
    ordering = ('darta_number',)

@admin.register(Chalani) 
class ChalaniAdmin(admin.ModelAdmin):
    list_display = ('chalani_number','chalani_date','letter_receiver','sender_section','subject')
    search_fields = ('chalani_number','chalani_date','letter_sender','subject')
    list_filter = ('chalani_number',"chalani_date")
    ordering = ('chalani_number',)


@admin.register(Designation_model)
class DesignationAdmin(admin.ModelAdmin):
    list_display = ('designation_name', 'designation_rank_number')
    search_fields = ('designation_name',)
    ordering = ('designation_rank_number',)
   

@admin.register(Section_model)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('section_name', 'section_rank_number', 'section_eng_name')
    search_fields = ('section_name',)
    ordering = ('section_name',)
   

@admin.register(Level_model)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('level_name', 'level_rank_number', 'level_eng_name')
    search_fields = ('level_name',)
    ordering = ('level_rank_number',)
 
@admin.register(Employee_model)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'phone_number')
    search_fields = ('first_name', 'last_name', 'email')
    list_filter = ('created_at',)
