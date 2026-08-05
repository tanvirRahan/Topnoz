from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin
from .api import api

from django.shortcuts import redirect
from ninja_jwt.tokens import RefreshToken
from django.contrib.auth.decorators import login_required

@login_required
def google_login_callback(request):
    refresh = RefreshToken.for_user(request.user)
    access = str(refresh.access_token)
    return redirect(f"http://localhost:3001/auth/callback?access_token={access}&refresh_token={str(refresh)}")

urlpatterns = [
    path('adminpanel/', admin.site.urls),
    path('api/', api.urls),
    path('accounts/google/success/', google_login_callback), # OAuth success callback
    path('accounts/', include('allauth.urls')), # 🔗 This is main allauth.urls for (google login)
  
    path('api/', include('apps.ai_core.urls')),
]

if settings.DEBUG:
    # When DEBUG=True, serve static and media files from development server
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)