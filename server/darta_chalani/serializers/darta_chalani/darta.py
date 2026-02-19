from rest_framework import serializers
from ...model.darta_chalani.darta import Darta

class DartaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Darta
        fields = ['id', 'darta_samuha', 'darta_number', 'darta_date', 'letter_sender', 'sender_email', 'sender_address', 'letter_date', 'ref_number', 'subject', 'remarks', 'letter_catagory', 'receiver_section']
        read_only_fields = ['darta_number']