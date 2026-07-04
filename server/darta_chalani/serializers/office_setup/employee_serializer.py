from rest_framework import serializers
from ...model.office_setup.employee import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            'id', 
            'first_name', 
            'last_name', 
            'phone_number',
            'email', 
            'section', 
            'designation', 
            'level',
            'is_active'
        ]
        
    def to_representation(self, instance):
        """Overrides read operations to return full object details instead of just IDs."""
        representation = super().to_representation(instance)
        
        # Inject structural dictionary details dynamically on GET requests
        representation['section'] = {
            "id": instance.section.id,
            "name": getattr(instance.section, 'section_name', str(instance.section))
        }
        representation['designation'] = {
            "id": instance.designation.id,
            "name": getattr(instance.designation, 'designation_name', str(instance.designation)),
            "rank": getattr(instance.designation, 'designation_rank_number', None)
        }
        representation['level'] = {
            "id": instance.level.id,
            "name": getattr(instance.level, 'level_name', str(instance.level))
        }
        return representation