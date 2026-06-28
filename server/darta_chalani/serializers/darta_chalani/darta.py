from rest_framework import serializers
from ...model.darta_chalani.darta import Darta


class DartaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Darta
        fields = "__all__"
        read_only_fields = ["darta_number"]

    def validate(self, data):
        # clean empty strings → None (IMPORTANT FIX)
        for key, value in data.items():
            if value == "":
                data[key] = None
        return data