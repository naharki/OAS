
from rest_framework import serializers
from ..model.committeetype import CommitteeType

class CommitteeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommitteeType
        fields = "__all__"

        