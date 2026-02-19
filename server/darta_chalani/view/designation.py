from rest_framework.viewsets import ModelViewSet
from ..model.designation import Designation
from ..serializers.designation import DesignationSerializer

class DesignationViewSet(ModelViewSet):
    queryset = Designation.objects.all().order_by("view_order")
    serializer_class = DesignationSerializer
    