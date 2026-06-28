from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .view.designation import DesignationViewSet
from .view.darta_chalani.darta import (
    DartaViewSet,
    NextDartaNumberAPIView,
)
from .view.darta_chalani.chalani import (
    ChalaniViewSet,
    NextChalaniNumberAPIView,
)

router = DefaultRouter()

router.register("designations", DesignationViewSet)
router.register("darta", DartaViewSet)
router.register("chalani", ChalaniViewSet)

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