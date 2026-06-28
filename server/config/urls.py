from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('planning/', include('planning.urls')),
   
    path('api/users/', include('user_management.urls')),
    # template
    path('darta-chalani/', include('darta_chalani.urls')),
path('', include('core_portal.urls')),
# for api 
    path('api/v1/darta-chalani/',include('darta_chalani.urls_api'))
]+ static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)