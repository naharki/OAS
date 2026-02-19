from rest_framework.viewsets import ModelViewSet
from ...model.darta_chalani.chalani import Chalani
from ...serializers.darta_chalani.chalani import ChalaniSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

class ChalaniViewSet(ModelViewSet):
   queryset = Chalani.objects.all().order_by("chalani_number")
   serializer_class = ChalaniSerializer
   
class NextChalaniNumberAPIView(APIView):
    def get(self, request):
        last = Chalani.objects.order_by('-chalani_number').first()
        return Response({
            "next_chalani_number": last.chalani_number + 1 if last else 1
        })