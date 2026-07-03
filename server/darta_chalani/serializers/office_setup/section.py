from rest_framework import serializers
from ...model.office_setup.section import Section_model


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section_model
        fields = "__all__"

    def validate(self, data):
        # clean empty strings → None (IMPORTANT FIX)
        for key, value in data.items():
            if value == "":
                data[key] = None
        return data