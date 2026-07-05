from rest_framework import serializers
from ...model.darta_chalani.chalani import Chalani
class ChalaniSerializer(serializers.ModelSerializer):
       class Meta:
           model = Chalani
           fields = "__all__"
           read_only_fields = ["chalani_number"]

       def validate(self, data):
           for key, value in data.items():
               if value == "":
                   data[key] = None
           return data

       def to_representation(self, instance):
           rep = super().to_representation(instance)
           rep["sender_section"] = {
               "id": instance.sender_section.id,
               "section_name": instance.sender_section.section_name,
           }
           return rep