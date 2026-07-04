from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .view.darta_chalani.employee import EmployeeViewSet
from .view.darta_chalani.designation import DesignationViewSet
from .view.darta_chalani.section_viewset import SectionViewSet
from .view.darta_chalani.level import LevelViewSet
from .view.darta_chalani.darta import (
    DartaViewSet,
    NextDartaNumberAPIView,
)
from .view.darta_chalani.chalani import (
    ChalaniViewSet,
    NextChalaniNumberAPIView,
)
from .view.darta_chalani.office_setup import OfficeViewSet
router = DefaultRouter()

router.register("designation", DesignationViewSet)
router.register("darta", DartaViewSet)
router.register("chalani", ChalaniViewSet)
router.register("section", SectionViewSet)
router.register(r'office', OfficeViewSet, basename='office')
router.register(r'level', LevelViewSet, basename='level')
router.register(r'employee', EmployeeViewSet, basename='employee')
urlpatterns = [

    path("", include(router.urls)),

    path(
        "next-darta-number/",
        NextDartaNumberAPIView.as_view(),
        name="next-darta-number",
    ),

    path(
        "next-chalani-number/",
        NextChalaniNumberAPIView.as_view(),
        name="next-chalani-number",
    ),
]