from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    last_ip_address = models.GenericIPAddressField(blank=True, null=True)
    device_info = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    photo = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    os = models.CharField(max_length=50, blank=True, null=True)
    browser = models.CharField(max_length=50, blank=True, null=True)
    isp = models.CharField(max_length=150, blank=True, null=True)
    timezone = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    
    # Advanced Marketing Data
    referrer_url = models.URLField(blank=True, null=True)
    utm_source = models.CharField(max_length=100, blank=True, null=True)
    utm_medium = models.CharField(max_length=100, blank=True, null=True)
    utm_campaign = models.CharField(max_length=100, blank=True, null=True)
    screen_resolution = models.CharField(max_length=50, blank=True, null=True)
    viewed_products = models.JSONField(default=list, blank=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

class VisitorLog(models.Model):
    ip_address = models.GenericIPAddressField(unique=True)
    os = models.CharField(max_length=50, blank=True, null=True)
    browser = models.CharField(max_length=50, blank=True, null=True)
    device_info = models.CharField(max_length=255, blank=True, null=True)
    isp = models.CharField(max_length=150, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    timezone = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    
    # Advanced Marketing Data
    referrer_url = models.URLField(blank=True, null=True)
    utm_source = models.CharField(max_length=100, blank=True, null=True)
    utm_medium = models.CharField(max_length=100, blank=True, null=True)
    utm_campaign = models.CharField(max_length=100, blank=True, null=True)
    screen_resolution = models.CharField(max_length=50, blank=True, null=True)
    viewed_products = models.JSONField(default=list, blank=True)
    
    first_visit = models.DateTimeField(auto_now_add=True)
    last_visit = models.DateTimeField(auto_now=True)
    visit_count = models.IntegerField(default=1)

    class Meta:
        db_table = 'web_visitorlog'
        verbose_name = 'Unauthenticated User'
        verbose_name_plural = 'Unauthenticated Users'
        ordering = ['-last_visit']

    def __str__(self):
        return f"Visitor: {self.ip_address} ({self.country})"
