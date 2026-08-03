from django.db import models
from django.contrib.auth.models import User
from .items import Item

class OrderItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    customer_order = models.ForeignKey('CustomerOrder', on_delete=models.SET_NULL, null=True, blank=True)
    size = models.CharField(max_length=20, blank=True, null=True) 

    class Meta:
        db_table = 'web_orderitem'

    def __str__(self):
        return f"{self.quantity} x {self.item.title} ({self.size or 'No Size'}) for {self.user.username} (Order: {self.customer_order.id if self.customer_order else 'N/A'})"

    def get_total_item_price(self):
        return self.quantity * self.item.price

    def get_total_discount_item_price(self):
        return self.quantity * self.item.discount_price

    def get_amount_saved(self):
        return self.get_total_item_price() - self.get_total_discount_item_price()

    def get_final_price(self):
        if self.item.discount_price:
            return self.get_total_discount_item_price()
        return self.get_total_item_price()

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    items = models.ManyToManyField(OrderItem)
    ordered_date = models.DateTimeField()
    ordered = models.BooleanField(default=False)

    class Meta:
        db_table = 'web_order'

    def __str__(self):
        return f"Order #{self.id} for {self.user.username}"

    def get_total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_final_price()
        return total

class CustomerOrder(models.Model):
    PAYMENT_METHODS = (
        ('cod', 'Cash on Delivery'),
        ('bkash', 'bKash'),
    )
    ORDER_STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Rejected', 'Rejected'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='Pending')
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=50)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS)
    bkash_number = models.CharField(max_length=15, blank=True, null=True)
    bkash_transaction = models.CharField(max_length=50, blank=True, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    order_total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    products = models.CharField(max_length=255, blank=True, null=True)
    quantities = models.CharField(max_length=255, blank=True, null=True)
    sizes = models.CharField(max_length=255, blank=True, null=True) 

    class Meta:
        db_table = 'web_customerorder'

    def __str__(self):
        return f"Order #{self.id} by {self.name} ({self.email})"

    def get_order_items(self):
        return self.orderitem_set.all()
