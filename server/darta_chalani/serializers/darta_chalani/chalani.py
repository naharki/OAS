from rest_framework import serializers
from ...model.darta_chalani.chalani import Chalani

class ChalaniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chalani
        fields = ['id', 'chalani_samuha', 'chalani_number', 'chalani_date', 'letter_receiver', 'letter_date', 'subject', 'remarks', 'sender_section']
        read_only_fields = ['chalani_number']