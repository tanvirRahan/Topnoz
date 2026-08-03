from django.db import models

class SiteSettings(models.Model):
    site_name = models.CharField(max_length=100, default='Topnoz')
    contact_email = models.EmailField(default='support@topnoz.com')
    contact_phone = models.CharField(max_length=20, default='+880 1234 567 890')
    facebook_link = models.URLField(blank=True, null=True)
    instagram_link = models.URLField(blank=True, null=True)
    free_delivery_threshold = models.IntegerField(default=5000, help_text="Amount in Taka for free delivery")
    
    class Meta:
        verbose_name = 'Site Setting'
        verbose_name_plural = 'Site Settings'
        
    def __str__(self):
        return "Global Site Settings"
    
    def save(self, *args, **kwargs):
        if self.__class__.objects.exists() and not self.pk:
            self.pk = self.__class__.objects.first().pk
        super().save(*args, **kwargs)
