from rest_framework.viewsets import ModelViewSet
from ....darta_chalani.model.designation import Designation
from ....darta_chalani.serializers.designation import DesignationSerializer

class DesignationViewSet(ModelViewSet):
    queryset = Designation.objects.all().order_by("view_order")
    serializer_class = DesignationSerializer
