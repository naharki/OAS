from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ...model.office_setup.employee import Employee
from ...serializers.office_setup.employee_serializer import EmployeeSerializer
from ...serializers.office_setup.employee_serializer import EmployeeSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related('section', 'designation', 'level').all()
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        queryset = self.queryset
        employee_id = self.request.query_params.get('employee_id')
        if employee_id:
            queryset = queryset.filter(id=employee_id)
        return queryset
