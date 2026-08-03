from django.contrib import admin
from apps.store.models import OrderItem, Order, CustomerOrder
from unfold.admin import ModelAdmin, TabularInline
from import_export.admin import ImportExportActionModelAdmin
from unfold.contrib.import_export.forms import ExportForm, ImportForm

class OrderItemInline(TabularInline):
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

class OrderItemAdmin(ModelAdmin, ImportExportActionModelAdmin):
    import_form_class = ImportForm
    export_form_class = ExportForm
    list_display = ['user', 'item', 'size', 'quantity', 'ordered', 'customer_order_link']
    list_select_related = ['user', 'item', 'customer_order']
    list_filter = ['ordered', 'user', 'size']
    search_fields = ['user__username', 'user__email', 'item__title', 'size']
    autocomplete_fields = ['user', 'item']
    
    def customer_order_link(self, obj):
        if obj.customer_order:
            return f"Order #{obj.customer_order.id}"
        return "-"
    customer_order_link.short_description = 'Customer Order'

class OrderAdmin(ModelAdmin, ImportExportActionModelAdmin):
    import_form_class = ImportForm
    export_form_class = ExportForm
    list_display = ['user', 'ordered_date', 'ordered', 'get_total', 'customer_order_link']
    list_select_related = ['user']
    list_filter = ['ordered', 'ordered_date']
    search_fields = ['user__username', 'user__email']
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

class CustomerOrderAdmin(ModelAdmin, ImportExportActionModelAdmin):
    import_form_class = ImportForm
    export_form_class = ExportForm
    list_display = [
        'id', 'user', 'name', 'phone', 'payment_method', 'get_order_total', 
        'created_at', 'status', 'get_products', 'get_quantities', 
        'get_sizes', 'get_item_count'
    ]
    list_editable = ['status']
    list_select_related = ['user', 'order']
    list_filter = ['status', 'payment_method', 'city', 'created_at']
    search_fields = ['name', 'email', 'phone', 'user__username', 'user__email']
    autocomplete_fields = ['user']
    readonly_fields = ['created_at', 'get_order_total', 'payment_details', 'get_order_items']
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
            'fields': ('status', 'order', 'get_order_total', 'created_at', 'get_order_items')
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
    
    def get_order_items(self, obj):
        items = obj.order.items.all() if obj.order else []
        if not items:
            return "No items in this order"
        item_list = []
        for item in items:
            item_list.append(f"{item.item.title} (Qty: {item.quantity}) - ৳{item.get_final_price()} (Size: {item.size or 'N/A'})")
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

admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(CustomerOrder, CustomerOrderAdmin)
