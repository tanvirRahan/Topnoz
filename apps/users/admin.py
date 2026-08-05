from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.admin import ModelAdmin
from import_export.admin import ImportExportActionModelAdmin
from unfold.contrib.import_export.forms import ExportForm, ImportForm
from .models import UserProfile

class UserProfileAdmin(ModelAdmin, ImportExportActionModelAdmin):
    import_form_class = ImportForm
    export_form_class = ExportForm
    list_display = ['user', 'photo_preview', 'get_email', 'phone_number', 'os_browser', 'last_ip_address', 'utm_source']
    list_select_related = ['user']
    search_fields = ['user__username', 'user__email', 'city', 'country', 'phone_number', 'utm_source', 'utm_campaign']
    list_filter = ['country', 'os', 'browser', 'utm_source', 'utm_medium']
    readonly_fields = ['photo_preview', 'os', 'browser', 'isp', 'timezone', 'latitude', 'longitude', 'zip_code', 'device_info', 'last_ip_address', 'city', 'country', 'referrer_url', 'utm_source', 'utm_medium', 'utm_campaign', 'screen_resolution', 'viewed_products']

    fieldsets = (
        ('Personal Info', {
            'fields': ('user', 'photo', 'photo_preview', 'phone_number')
        }),
        ('Device Information', {
            'fields': ('os', 'browser', 'device_info', 'screen_resolution')
        }),
        ('Network & Location', {
            'fields': ('last_ip_address', 'isp', 'city', 'country', 'zip_code', 'timezone', 'latitude', 'longitude')
        }),
        ('Marketing & Acquisition', {
            'fields': ('referrer_url', 'utm_source', 'utm_medium', 'utm_campaign', 'viewed_products')
        })
    )

    def photo_preview(self, obj):
        if obj.photo:
            from django.utils.html import format_html
            return format_html('<img src="{}" width="40" height="40" style="border-radius: 50%; object-fit: cover;" />', obj.photo.url)
        return "-"
    photo_preview.short_description = "Photo"

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = "Email"

    def os_browser(self, obj):
        return f"{obj.os or 'Unknown'} / {obj.browser or 'Unknown'}"
    os_browser.short_description = "OS & Browser"

# Re-register User to use Unfold and Export features
from django.contrib.auth.models import User, Group
admin.site.unregister(User)
admin.site.unregister(Group)

@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin, ImportExportActionModelAdmin):
    import_form_class = ImportForm
    export_form_class = ExportForm
    pass

from .models import UserProfile, VisitorLog

class VisitorLogAdmin(ModelAdmin, ImportExportActionModelAdmin):
    import_form_class = ImportForm
    export_form_class = ExportForm
    list_display = ['ip_address', 'os_browser', 'city', 'country', 'utm_source', 'visit_count', 'last_visit']
    search_fields = ['ip_address', 'city', 'country', 'utm_source', 'utm_campaign', 'referrer_url']
    list_filter = ['country', 'os', 'browser', 'utm_source', 'utm_medium']
    readonly_fields = ['ip_address', 'os', 'browser', 'device_info', 'screen_resolution', 'isp', 'city', 'country', 'timezone', 'latitude', 'longitude', 'zip_code', 'referrer_url', 'utm_source', 'utm_medium', 'utm_campaign', 'viewed_products', 'first_visit', 'last_visit', 'visit_count']
    
    fieldsets = (
        ('Visitor Basics', {
            'fields': ('ip_address', 'visit_count', 'first_visit', 'last_visit')
        }),
        ('Device & Network', {
            'fields': ('os', 'browser', 'device_info', 'screen_resolution', 'isp', 'city', 'country', 'timezone', 'latitude', 'longitude', 'zip_code')
        }),
        ('Marketing & Acquisition', {
            'fields': ('referrer_url', 'utm_source', 'utm_medium', 'utm_campaign', 'viewed_products')
        })
    )

    def os_browser(self, obj):
        return f"{obj.os or 'Unknown'} / {obj.browser or 'Unknown'}"
    os_browser.short_description = "OS & Browser"
    
    def has_add_permission(self, request):
        return False  # Prevent manual addition of visitors

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(VisitorLog, VisitorLogAdmin)
