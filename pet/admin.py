from django.contrib import admin
from django.utils.html import format_html
from .models import Item, OrderItem, Order, Variation, ItemVariation, CustomerOrder, ItemMedia

# =========================
# Smart Inline for Extra Images & Video
# =========================
class ItemMediaInline(admin.TabularInline):
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
                # YouTube embed
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
                # Facebook embed
                elif obj.is_facebook():
                    return format_html(
                        '<iframe src="{}" width="120" height="90" frameborder="0" allowfullscreen></iframe>',
                        obj.video_url
                    )
                # Other direct video link
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

class ItemVariationInline(admin.TabularInline):
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

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['item', 'size', 'quantity', 'get_final_price', 'user']
    can_delete = False
    fields = ['item', 'size', 'quantity', 'get_final_price', 'user']
    
    def get_final_price(self, obj):
        return f"৳{obj.get_final_price()}"
    get_final_price.short_description = 'Price'
    
    def has_add_permission(self, request, obj=None):
        return False

class ItemAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    list_display = ['title', 'order', 'price', 'discount_price', 'stock', 'product_type']
    list_filter = ['label', 'product_type']
    search_fields = ['title', 'description']
    readonly_fields = ['image_preview']
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

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['user', 'item', 'size', 'quantity', 'ordered', 'customer_order_link']
    list_filter = ['ordered', 'user', 'size']
    search_fields = ['user__username', 'item__title', 'size']
    autocomplete_fields = ['user', 'item']
    
    def customer_order_link(self, obj):
        if obj.customer_order:
            return f"Order #{obj.customer_order.id}"
        return "-"
    customer_order_link.short_description = 'Customer Order'

class OrderAdmin(admin.ModelAdmin):
    list_display = ['user', 'ordered_date', 'ordered', 'get_total', 'customer_order_link']
    list_filter = ['ordered', 'ordered_date']
    search_fields = ['user__username']
    autocomplete_fields = ['user']
    date_hierarchy = 'ordered_date'
    
    def get_total(self, obj):
        return f"৳{obj.get_total()}"
    get_total.short_description = 'Total Amount'
    
    def customer_order_link(self, obj):
        customer_order = CustomerOrder.objects.filter(order=obj).first()
        if customer_order:
            return f"Order #{customer_order.id}"
        return "-"
    customer_order_link.short_description = 'Customer Order'

class VariationAdmin(admin.ModelAdmin):
    list_display = ['item', 'name']
    list_filter = ['name']
    search_fields = ['item__title']
    inlines = [ItemVariationInline]
    autocomplete_fields = ['item']

class ItemVariationAdmin(admin.ModelAdmin):
    list_display = ['variation', 'value', 'image_preview']
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

class CustomerOrderAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'user',
        'name',
        'payment_method',
        'get_order_total',
        'created_at',
        'order_status',
        'get_products',
        'get_quantities',
        'get_sizes',
        'get_item_count'
    ]
    list_filter = [
        'payment_method',
        'city',
        'created_at'
    ]
    search_fields = [
        'name',
        'email',
        'phone',
        'user__username'
    ]
    readonly_fields = [
        'created_at',
        'get_order_total',
        'payment_details',
        'get_order_items'
    ]
    inlines = [OrderItemInline]
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Customer Information', {
            'fields': ('user', 'name', 'email', 'phone')
        }),
        ('Delivery Information', {
            'fields': ('address', 'city')
        }),
        ('Payment Information', {
            'fields': ('payment_method', 'bkash_number', 'bkash_transaction', 'payment_details')
        }),
        ('Order Details', {
            'fields': ('order', 'get_order_total', 'created_at', 'get_order_items')
        }),
    )
    
    def get_order_total(self, obj):
        return f"৳{obj.order_total}"
    get_order_total.short_description = 'Order Total'
    
    def payment_details(self, obj):
        if obj.payment_method == 'bkash':
            return f"bKash Number: {obj.bkash_number}, Transaction ID: {obj.bkash_transaction}"
        return "Cash on Delivery"
    payment_details.short_description = 'Payment Details'
    
    def order_status(self, obj):
        if obj.order and obj.order.ordered:
            return "Completed"
        return "Pending"
    order_status.short_description = 'Status'
    
    def get_order_items(self, obj):
        items = obj.order.items.all() if obj.order else []
        if not items:
            return "No items in this order"
        
        item_list = []
        for item in items:
            item_list.append(
                f"{item.item.title} (Qty: {item.quantity}) - ৳{item.get_final_price()} (Size: {item.size or 'N/A'})"
            )
        return "\n".join(item_list)
    get_order_items.short_description = 'Order Items'
    
    def get_item_count(self, obj):
        return obj.order.items.count() if obj.order else 0
    get_item_count.short_description = 'Items Count'
    
    def get_products(self, obj):
        if not obj.order:
            return "-"
        return ", ".join([item.item.title for item in obj.order.items.all()])
    get_products.short_description = 'Products'
    
    def get_quantities(self, obj):
        if not obj.order:
            return "-"
        return ", ".join([str(item.quantity) for item in obj.order.items.all()])
    get_quantities.short_description = 'Quantities'

    def get_sizes(self, obj):
        return obj.sizes or "-"
    get_sizes.short_description = 'Sizes'

# Register all models
admin.site.register(Item, ItemAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Variation, VariationAdmin)
admin.site.register(ItemVariation, ItemVariationAdmin)
admin.site.register(CustomerOrder, CustomerOrderAdmin)
admin.site.register(ItemMedia)

# =========================
# User Signup Method Show (Google/Manual)
# =========================
from django.contrib.auth.models import User
from allauth.socialaccount.models import SocialAccount

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'signup_method')
    search_fields = ['username', 'email', 'first_name', 'last_name']

    def signup_method(self, obj):
        if SocialAccount.objects.filter(user=obj).exists():
            return "Google"
        return "Manual"
    signup_method.short_description = 'Signup Method'

admin.site.unregister(User)
admin.site.register(User, UserAdmin)