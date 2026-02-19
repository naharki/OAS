from rest_framework import serializers
from ...model.suchiDarta.suchiDarta import SuchiDarta

class SuchiDartaSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuchiDarta
        fields = ['id', 'pan_Vat_number', 'darta_number', 'darta_date', 'firm_name', 'tax_clearance_FY', 'application_date', 'firm_address', 'contact_person', 'contact_number', 'firm_darta_number', 'firm_registration_address', 'email', 'firm_working_sector', 'suchikrit_dastur_bill_number', 'suchikrit_dastur_bill_date', 'remarks']
        read_only_fields = ['darta_number']