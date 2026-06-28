from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from ..model.fiscalyear import FiscalYear

class Fiscal_year_serializer(serializers.ModelSerializer):
    class Meta:
        model = FiscalYear
        fields = "__all__"