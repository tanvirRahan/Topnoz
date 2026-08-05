from django.contrib import admin
from django.utils.html import format_html
from apps.store.models import Item, Variation, ItemVariation, ItemMedia
from unfold.admin import ModelAdmin, TabularInline
from import_export.admin import ImportExportActionModelAdmin
from unfold.contrib.import_export.forms import ExportForm, ImportForm

class ItemMediaInline(TabularInline):
    model = ItemMedia
    extra = 1
    readonly_fields = ['media_preview']

    def media_preview(self, obj):
        if obj.is_video:
            if obj.video_file:
                return format_html(
                    '<video width="120" controls><source src="{}" type="video/mp4"></video>',
                    obj.video_file.url
                )
            elif obj.video_url:
                if obj.is_youtube():
                    import re
                    youtube_id = None
                    match = re.search(r'(?:v=|be/)([A-Za-z0-9_-]{11})', obj.video_url)
                    if match:
                        youtube_id = match.group(1)
                    if youtube_id:
                        return format_html(
                            '<iframe width="120" height="90" src="https://www.youtube.com/embed/{}" frameborder="0" allowfullscreen></iframe>',
                            youtube_id
                        )
                elif obj.is_facebook():
                    return format_html(
                        '<iframe src="{}" width="120" height="90" frameborder="0" allowfullscreen></iframe>',
                        obj.video_url
                    )
                else:
                    return format_html(
                        '<video width="120" controls><source src="{}" type="video/mp4"></video>',
                        obj.video_url
                    )
        elif obj.image:
            return format_html(
                '<img src="{}" style="max-height: 100px; max-width: 100px;" />',
                obj.image.url
            )
        return "No Preview"
    media_preview.short_description = 'Preview'

class ItemVariationInline(TabularInline):
    model = ItemVariation
    extra = 1
    readonly_fields = ['image_preview']
    
    def image_preview(self, obj):
        if obj.attachment:
            return format_html(
                '<img src="{}" style="max-height: 100px; max-width: 100px;" />',
                obj.attachment.url
            )
        return "No Image"
    image_preview.short_description = 'Image Preview'

class ItemAdmin(ModelAdmin, ImportExportActionModelAdmin):
    import_form_class = ImportForm
    export_form_class = ExportForm
    prepopulated_fields = {'slug': ('title',)}
    list_display = ['image_preview', 'title', 'price', 'stock', 'product_type', 'available_sizes']
    list_filter = ['label', 'product_type']
    search_fields = ['title', 'description']
    readonly_fields = ['image_preview']
    exclude = ['order']
    inlines = [ItemMediaInline]
    ordering = ['order', '-created_at']

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 150px; max-width: 150px;" />',
                obj.image.url
            )
        return "No Image"
    image_preview.short_description = 'Image Preview'

class VariationAdmin(ModelAdmin, ImportExportActionModelAdmin):
    import_form_class = ImportForm
    export_form_class = ExportForm
    list_display = ['item', 'name']
    list_select_related = ['item']
    list_filter = ['name']
    search_fields = ['item__title']
    inlines = [ItemVariationInline]
    autocomplete_fields = ['item']

class ItemVariationAdmin(ModelAdmin, ImportExportActionModelAdmin):
    import_form_class = ImportForm
    export_form_class = ExportForm
    list_display = ['variation', 'value', 'image_preview']
    list_select_related = ['variation', 'variation__item']
    list_filter = ['variation']
    search_fields = ['value']
    readonly_fields = ['image_preview']
    
    def image_preview(self, obj):
        if obj.attachment:
            return format_html(
                '<img src="{}" style="max-height: 150px; max-width: 150px;" />',
                obj.attachment.url
            )
        return "No Image"
    image_preview.short_description = 'Image Preview'

admin.site.register(Item, ItemAdmin)
admin.site.register(Variation, VariationAdmin)
admin.site.register(ItemVariation, ItemVariationAdmin)
admin.site.register(ItemMedia)
