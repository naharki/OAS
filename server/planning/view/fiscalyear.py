from rest_framework import viewsets, status
from rest_framework.response import Response
from ..model.fiscalyear import FiscalYear
from ..serializers.fiscalyear import Fiscal_year_serializer


class FiscalYearViewSet(viewsets.ModelViewSet):
   queryset = FiscalYear.objects.all()
   serializer_class = Fiscal_year_serializer

   def list(self, request, *args, **kwargs):
      queryset = self.filter_queryset(self.get_queryset())
      serializer = self.get_serializer(queryset, many=True)

      return Response({
            "success": True,
            "count": queryset.count(),
            "data": serializer.data
        }, status=status.HTTP_200_OK)
      def retrieve(self, request, *args, **kwargs):
        try :
            instance = self.get_object()
        except:
            raise NotFound("Fiscal Year not found")
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
                "message": "Fiscal Year created successfully",
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
                "message": "Fiscal Year updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
      def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            "success": True,
            "message": "Fiscal Year deleted successfully"
        }, status=status.HTTP_204_NO_CONTENT)