from rest_framework import serializers, viewsets, status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..model.committeetype import CommitteeType
from ..serializers.committeetype import CommitteeTypeSerializer


class CommitteeTypeViewSet(viewsets.ModelViewSet):
    queryset = CommitteeType.objects.all()
    serializer_class = CommitteeTypeSerializer
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            "success": True,
            "count": queryset.count(),
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except:
            raise NotFound("Committee Type not found")

        serializer = self.get_serializer(instance)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Committee Type created successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Committee Type updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({
            "success": True,
            "message": "Committee Type deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)