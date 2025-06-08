from django.contrib import admin
from .models import Item, OrderItem, Order, Variation, ItemVariation, CustomerOrder

class ItemVariationInline(admin.TabularInline):
    model = ItemVariation
    extra = 1
    readonly_fields = ['image_preview']
    
    def image_preview(self, obj):
        if obj.attachment:
            return obj.attachment.url
        return "No Image"
    image_preview.short_description = 'Image Preview'

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['item', 'quantity', 'get_final_price', 'user']
    can_delete = False
    fields = ['item', 'quantity', 'get_final_price', 'user']
    
    def get_final_price(self, obj):
        return f"৳{obj.get_final_price()}"
    get_final_price.short_description = 'Price'
    
    def has_add_permission(self, request, obj=None):
        return False

class ItemAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    list_display = ['title', 'price', 'discount_price', 'stock', 'categories']
    list_filter = ['categories', 'label']
    search_fields = ['title', 'description']
    readonly_fields = ['image_preview']
    
    def image_preview(self, obj):
        if obj.image:
            return obj.image.url
        return "No Image"
    image_preview.short_description = 'Image Preview'

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['user', 'item', 'quantity', 'ordered', 'customer_order_link']
    list_filter = ['ordered', 'user']
    search_fields = ['user__username', 'item__title']
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
            return obj.attachment.url
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
        'get_products',  # নতুন যোগ
        'get_quantities', # নতুন যোগ
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
                f"{item.item.title} (Qty: {item.quantity}) - ৳{item.get_final_price()}"
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

# Register all models
admin.site.register(Item, ItemAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Variation, VariationAdmin)
admin.site.register(ItemVariation, ItemVariationAdmin)
admin.site.register(CustomerOrder, CustomerOrderAdmin)
