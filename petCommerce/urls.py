from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('pet.urls')),              # This is main app Url
    path('accounts/', include('allauth.urls')), # 🔗 This is main allauth.urls for (google login)
]

if settings.DEBUG:
    # When DEBUG=True, serve static and media files from development server
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    # When DEBUG=False, serve manually
    from django.views.static import serve
    from django.urls import re_path

    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
        re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    ]
  