from rest_framework import serializers
from ..model.committee import Committee
from .committeetype import CommitteeTypeSerializer
from .memberserializer import MemberSerializer
from ..model.committee import Member

class CommitteeSerializer(serializers.ModelSerializer):
    committeeType =CommitteeTypeSerializer(source='committee_type', read_only=True)
    members = MemberSerializer(many=True, read_only=True)
    class Meta:
        model = Committee
        fields = "__all__"

