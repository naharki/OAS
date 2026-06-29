from rest_framework import serializers
from ...model.office_setup.office_info import Office_model

class OfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Office_model
        fields = "__all__"
