from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
import pandas as pd
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ...model.darta_chalani.darta import Darta
from ...serializers.darta_chalani.darta import DartaSerializer

def normalize_excel_date(value):
    """Convert Excel date to string format (works with both Gregorian and Nepali dates)"""
    if pd.isna(value):
        return ""
    if hasattr(value, "strftime"):
        return value.strftime("%Y-%m-%d")
    # Return as-is for Nepali date format (already in string)
    return str(value).split(" ")[0]
def normalize_excel_date_special_Case(value):
    if pd.isna(value):
        return ""
    if hasattr(value, "strftime"):
        return value.strftime("%Y/%m/%d")
    return str(value).split(" ")[0]
class DartaViewSet(viewsets.ModelViewSet):
    queryset = Darta.objects.all().order_by("darta_number")
    serializer_class = DartaSerializer
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        # 🚨 ensure auto-number is not manually set
        data.pop("darta_number", None)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@action(detail=False, methods=['post'], url_path='excel-upload')
def excel_upload(self, request):
       file = request.FILES.get("file")
       if not file : 
           return Response(
               {"error" : "No file uploaded"}, 
               status= status.HTTP_400_BAD_REQUEST
           )
       
       try:
           df = pd.read_excel(file, engine="openpyxl")
       except Exception as e:
           return Response(
               {"error": f"Excel read error: {str(e)}"},
               status=status.HTTP_400_BAD_REQUEST   
           )
       required_columns= [
           "darta_number",
           "darta_date",
            "receiver_section",
           "subject",
           "letter_sender",
           "letter_date",
        ]
       missing = [c for c in required_columns if c not in df.columns]
       if missing:
           return Response(
               {"error": f"Missing columns: {missing}"},
               status=status.HTTP_400_BAD_REQUEST
           )
       saved = 0
       errors = []
       darta_objects = []
       
       for index, row in df.iterrows():
          try :
             darta_number = int(row['darta_number'])
             
             # Check if darta_number already exists
             if Darta.objects.filter(darta_number=darta_number).exists():
                 errors.append({
                    'row': index + 2,
                    'error': f"Darta number {darta_number} already exists"
                 })
                 continue
             
             # Create object but don't call save() yet
             # bulk_create will insert all at once, preserving darta_number from file
             darta_obj = Darta(
                 darta_number = darta_number,
                 darta_date = normalize_excel_date(row['darta_date']),
                 subject = str(row['subject']).strip(),
                 letter_sender = str(row['letter_sender']).strip(),
                 receiver_section = str(row['receiver_section']).strip(),
                 letter_date = normalize_excel_date(row['letter_date']),
             )
             darta_objects.append(darta_obj)
             
          except Exception as e:
                errors.append({
                   'row': index + 2,
                    'error': str(e)
                })
       
       # Use bulk_create to bypass save() method and preserve darta_number from file
       if darta_objects:
           Darta.objects.bulk_create(darta_objects)
           saved = len(darta_objects)
       
       return Response(
           {
             "message": f"{saved} records imported successfully.",
             "errors": errors
           }, status=status.HTTP_201_CREATED)           
class NextDartaNumberAPIView(APIView):
    def get(self, request):
        last = Darta.objects.order_by('-darta_number').first()
        return Response({
            "next_darta_number": last.darta_number + 1 if last else 1
        })
