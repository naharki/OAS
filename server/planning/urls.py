from django.urls import path, include
from rest_framework_nested import routers

from .view.office_view import OfficeViewSet
from .view.fiscalyear import FiscalYearViewSet
from .view.ward import WardViewSet
from .view.committeetype import CommitteeTypeViewSet
from .view.committee import CommitteeViewSet
from .view.member import MemberViewSet
from .view.plan.planviews import PlanViewSet


router = routers.DefaultRouter()
router.register(r'offices', OfficeViewSet, basename='office')
router.register(r'fiscalyears', FiscalYearViewSet, basename='fiscalyear')
router.register(r'wards', WardViewSet, basename='ward')
router.register(r'committeetypes', CommitteeTypeViewSet, basename='committeetype')
router.register(r'committees', CommitteeViewSet, basename='committee')
router.register(r'plans', PlanViewSet, basename='plans')

members_router = routers.NestedDefaultRouter(
    router, r'committees', lookup='committee'
)
members_router.register(
    r'members', MemberViewSet, basename='committee-members'
)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/', include(members_router.urls)),
]
