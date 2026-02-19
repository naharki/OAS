from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
import pandas as pd
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ...model.suchiDarta.suchiDarta import SuchiDarta
from ...serializers.suchiDarta.suchiDarta import SuchiDartaSerializer

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
class SuchiDartaViewSet(viewsets.ModelViewSet):
   queryset = SuchiDarta.objects.all().order_by("darta_number")
   serializer_class = SuchiDartaSerializer

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
              "pan_Vat_number",
              "darta_date",
              "firm_name",
              "tax_clearance_FY",
              "application_date",
              "firm_address",
              "contact_person",
              "contact_number",
              "firm_darta_number",
              "firm_registration_address",
              "email",
              "firm_working_sector",
              "suchikrit_dastur_bill_number",
              "suchikrit_dastur_bill_date",
    
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
             if SuchiDarta.objects.filter(darta_number=darta_number).exists():
                 errors.append({
                    'row': index + 2,
                    'error': f"Darta number {darta_number} already exists"
                 })
                 continue
             
             # Create object but don't call save() yet
             # bulk_create will insert all at once, preserving darta_number from file
             darta_obj = SuchiDarta(
                 darta_number = darta_number,
                 darta_date = normalize_excel_date(row['darta_date']),
                 pan_Vat_number = str(row['pan_Vat_number']).strip(),
                 firm_name = str(row['firm_name']).strip(),
                 tax_clearance_FY = str(row['tax_clearance_FY']).strip(),
                 application_date = normalize_excel_date_special_Case(row['application_date']),
                 firm_address = str(row['firm_address']).strip(),
                 contact_person = str(row['contact_person']).strip(),
                 contact_number = str(row['contact_number']).strip(),
                 firm_darta_number = str(row['firm_darta_number']).strip(),
                 firm_registration_address = str(row['firm_registration_address']).strip(),
                 email = str(row['email']).strip(),
                 firm_working_sector = str(row['firm_working_sector']).strip(),
                 suchikrit_dastur_bill_number = str(row['suchikrit_dastur_bill_number']).strip(),
                 suchikrit_dastur_bill_date = normalize_excel_date_special_Case(row['suchikrit_dastur_bill_date']),
                 remarks = str(row['remarks']).strip(),
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
           SuchiDarta.objects.bulk_create(darta_objects)
           saved = len(darta_objects)
       
       return Response(
           {
             "message": f"{saved} records imported successfully.",
             "errors": errors
           }, status=status.HTTP_201_CREATED)   
           
class NextSuchiDartaNumberAPIView(APIView):
    def get(self, request):
        last = SuchiDarta.objects.order_by('-darta_number').first()
        return Response({
            "next_darta_number": last.darta_number + 1 if last else 1
        })
