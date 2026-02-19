from django.urls import path, include
from rest_framework_nested import routers

from .view.suchiDarta.suchiDarta import NextSuchiDartaNumberAPIView, SuchiDartaViewSet
from .view.designation import DesignationViewSet
from .view.darta_chalani.darta import DartaViewSet, NextDartaNumberAPIView
from .view.darta_chalani.chalani import ChalaniViewSet, NextChalaniNumberAPIView

router = routers.DefaultRouter()
router.register(r'designations', DesignationViewSet, basename='designation')
router.register(r'darta', DartaViewSet, basename='darta')
router.register(r'chalani', ChalaniViewSet, basename='chalani')
router.register(r'suchi-darta', SuchiDartaViewSet, basename='suchi-darta')

urlpatterns = [
    path('', include(router.urls)),
    path('next-darta-number/', NextDartaNumberAPIView.as_view(), name='next-darta-number'),
    path('next-chalani-number/', NextChalaniNumberAPIView.as_view(), name='next-chalani-number'),
    path('next-suchi-darta-number/', NextSuchiDartaNumberAPIView.as_view(), name='next-suchi-darta-number'),
]