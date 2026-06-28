from rest_framework import serializers
from ..model.ward import Ward

class WardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ward
        fields = "__all__"
        