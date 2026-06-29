from django.contrib import admin
from .model.darta_chalani.darta import Darta
from .model.darta_chalani.chalani import Chalani
from .model.office_setup.office_info import Office_model

# Register your models here.

@admin.register(Office_model)
class OfficeAdmin(admin.ModelAdmin):
    list_display = ('name', 'full_name', 'location', 'established_date', 'created_at')
    search_fields = ('name', 'full_name')
    list_filter = ('established_date', 'created_at')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')


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