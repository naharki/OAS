from rest_framework import serializers
from ..model.designation import Designation

class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = ['id', 'title', 'english_title', 'view_order'] 
