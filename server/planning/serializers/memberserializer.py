from rest_framework import serializers
from ..model.committee import Member


class MemberSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source="get_role_display", read_only=True)
    sex_display = serializers.CharField(source="get_sex_display", read_only=True)

    class Meta:
        model = Member
        fields = "__all__"
        read_only_fields = ["committee"]
