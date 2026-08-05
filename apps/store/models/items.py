from django.db import models
from django.shortcuts import reverse

PRODUCT_TYPE_CHOICES = [
    ('shirt', 'Shirt'),
    ('polo-tshirt', 'Polo Tshirt'),
    ('tshirt', 'Tshirt'),
    ('punjabi', 'Punjabi'),
    ('pant', 'Pant'),
    ('footware', 'Footware'),
    ('lifestyle', 'Lifestyle'),
]

class Item(models.Model):
    title = models.CharField(max_length=100)
    price = models.FloatField()
    discount_price = models.FloatField(blank=True, null=True)
    label = models.CharField(max_length=1, choices=[
        ('P', 'primary'), ('S', 'secondary'), ('D', 'danger')
    ], blank=True, null=True)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='products/')
    stock = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE_CHOICES, default='shirt')
    available_sizes = models.CharField(
        max_length=255, blank=True, null=True, 
        help_text="Enter sizes separated by comma (e.g., S, M, L, XL)"
    )
    order = models.IntegerField(default=0, help_text="Optional. Higher number = shows first. Default 0 uses newest first.")

    class Meta:
        db_table = 'web_item'

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("ProductDetailView", kwargs={"slug": self.slug})

    def get_add_to_cart_url(self):
        return reverse("add-to-cart", kwargs={"slug": self.slug})

    def get_remove_from_cart_url(self):
        return reverse("remove-from-cart", kwargs={"slug": self.slug})

class Variation(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)

    class Meta:
        unique_together = ('item', 'name')
        db_table = 'web_variation'

    def __str__(self):
        return self.name

class ItemVariation(models.Model):
    variation = models.ForeignKey(Variation, on_delete=models.CASCADE)
    value = models.CharField(max_length=50)
    attachment = models.ImageField(upload_to='item_variation/', blank=True, null=True)

    class Meta:
        db_table = 'web_itemvariation'

    def __str__(self):
        return self.value

class ItemMedia(models.Model):
    item = models.ForeignKey(Item, related_name='media', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/extra/', blank=True, null=True)
    is_video = models.BooleanField(default=False)
    video_file = models.FileField(upload_to='products/videos/', blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)

    class Meta:
        db_table = 'web_itemmedia'

    def __str__(self):
        return f"{self.item.title} - {'Video' if self.is_video else 'Image'}"

    def is_youtube(self):
        return self.video_url and ('youtube.com' in self.video_url or 'youtu.be' in self.video_url)

    def is_facebook(self):
        return self.video_url and 'facebook.com' in self.video_url
