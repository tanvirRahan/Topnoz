from django.db import models
from django.contrib.auth.models import User
from django.shortcuts import reverse

class ItemVariation(models.Model):
    variation = models.ForeignKey('Variation', on_delete=models.CASCADE)
    value = models.CharField(max_length=50)
    attachment = models.ImageField(upload_to='item_variation/', blank=True, null=True)

    def __str__(self):
        return self.value

class Variation(models.Model):
    item = models.ForeignKey('Item', on_delete=models.CASCADE)
    name = models.CharField(max_length=50)

    class Meta:
        unique_together = ('item', 'name')

    def __str__(self):
        return self.name

class Item(models.Model):
    title = models.CharField(max_length=100)
    price = models.FloatField()
    discount_price = models.FloatField(blank=True, null=True)
    categories = models.CharField(max_length=10, choices=[
        ('ME', "Men's Wear"), ('WO', "Women's Wear"), ('KI', "Kids Wear"), 
        ('AC', "Accessories"), ('OT', "Other")
    ])
    label = models.CharField(max_length=1, choices=[
        ('P', 'primary'), ('S', 'secondary'), ('D', 'danger')
    ], blank=True, null=True)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='products/')
    stock = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("ProductDetailView", kwargs={"slug": self.slug})

    def get_add_to_cart_url(self):
        return reverse("add-to-cart", kwargs={"slug": self.slug})

    def get_remove_from_cart_url(self):
        return reverse("remove-from-cart", kwargs={"slug": self.slug})

class OrderItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    customer_order = models.ForeignKey('CustomerOrder', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.quantity} of {self.item.title}"

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
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
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
    
    def __str__(self):
        return f"Order #{self.id} by {self.name}"
    
    def get_order_items(self):
        return self.orderitem_set.all()