from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from ...model.darta_chalani.chalani import Chalani
from ...serializers.darta_chalani.chalani import ChalaniSerializer


class ChalaniViewSet(ModelViewSet):
    """
    CRUD endpoint for outgoing correspondence (चलानी) records.
    Ordered newest-first by chalani_number for the register view.
    """
    queryset = Chalani.objects.all().order_by("-chalani_number")
    serializer_class = ChalaniSerializer


class NextChalaniNumberAPIView(APIView):
    """
    Returns the next sequential chalani_number so the create form
    can display it as a read-only reference before the record is saved.
    """
    def get(self, request):
        last = Chalani.objects.order_by("-chalani_number").first()
        next_number = last.chalani_number + 1 if last else 1
        return Response({"next_chalani_number": next_number})