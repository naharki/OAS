from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
import pandas as pd
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ...model.office_setup.section import Section_model
from ...serializers.office_setup.section import SectionSerializer


class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section_model.objects.all().order_by("section_rank_number")
    serializer_class = SectionSerializer
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)