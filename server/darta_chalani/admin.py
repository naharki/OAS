from django.contrib import admin

from .model.suchiDarta.suchiDarta import SuchiDarta
from .model.darta_chalani.darta import Darta
from .model.darta_chalani.chalani import Chalani

# Register your models here.
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

@admin.register(SuchiDarta)
class SuchiDartaAdmin(admin.ModelAdmin):
    list_display = ('darta_number', 'firm_name', 'pan_Vat_number','darta_date')
    search_fields = ('darta_number', 'firm_name', 'pan_Vat_number')
    list_filter = ('darta_date',)
    ordering = ('darta_number',)