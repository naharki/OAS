from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
import pandas as pd
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ...model.office_setup.level import Level_model
from ...serializers.office_setup.level_serializer import LevelSerializer


class LevelViewSet(viewsets.ModelViewSet):
    queryset = Level_model.objects.all().order_by("level_rank_number")
    serializer_class = LevelSerializer
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)