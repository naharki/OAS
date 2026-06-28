import pandas as pd
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from ...model.plan import Plan
from ...serializers.plan.panserializer import PlanSerializer


def normalize_excel_date(value):
    if pd.isna(value):
        return ""
    if hasattr(value, "strftime"):
        return value.strftime("%Y-%m-%d")
    return str(value).split(" ")[0]

class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all().order_by("-id")
    serializer_class = PlanSerializer

    @action(detail=False, methods=["post"], url_path="excel-upload")
    def excel_upload(self, request):
        file = request.FILES.get("file")

        if not file:
            return Response(
                {"error": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            df = pd.read_excel(file, engine="openpyxl")
        except Exception as e:
            return Response(
                {"error": f"Excel read error: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        required_columns = ["registration_number", "plan_name", "ward_number","location","allocated_budget","implementation_level", "implementation_status","date"]
        missing = [c for c in required_columns if c not in df.columns]

        if missing:
            return Response(
                {"error": f"Missing columns: {missing}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        saved = 0
        errors = []
        
        for index, row in df.iterrows():
            try:
                Plan.objects.create(
                    registration_number = int(row['registration_number']),
                    plan_name=str(row["plan_name"]).strip(),
                    ward_number=int(row["ward_number"]),
                    location= str(row["location"]).strip(),
                    allocated_budget = int(row['allocated_budget']),
                    implementation_level= str(row['implementation_level']).strip(),
                    implementation_status = str(row['implementation_status']).strip(),
                      date=normalize_excel_date(row["date"]), 
                )
                saved += 1
            except Exception as e:
                errors.append({
                    "row": index + 2,
                    "error": str(e)
                })

        return Response(
            {
                "message": f"{saved} records imported successfully",
                "errors": errors
            },
            status=status.HTTP_201_CREATED
        )
