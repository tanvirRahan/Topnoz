

from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin

urlpatterns = [
    path('adminpanel/', admin.site.urls),
    path('', include('apps.store.urls')),              # This is main app Url
    path('', include('apps.users.urls')),              # Users app (login/register)
    path('accounts/', include('allauth.urls')), # 🔗 This is main allauth.urls for (google login)
  
    path('api/', include('apps.chat.urls')),
]

if settings.DEBUG:
    # When DEBUG=True, serve static and media files from development server
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)