from django.contrib import admin
from unfold.admin import ModelAdmin
from apps.store.models import SiteSettings

class SiteSettingsAdmin(ModelAdmin):
    list_display = ['site_name', 'contact_email', 'contact_phone', 'free_delivery_threshold']
    
    def has_add_permission(self, request):
        # Allow adding only if no settings exist
        if self.model.objects.count() >= 1:
            return False
        return super().has_add_permission(request)

admin.site.register(SiteSettings, SiteSettingsAdmin)
