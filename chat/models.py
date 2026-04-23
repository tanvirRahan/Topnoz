

from django.db import models


class FashionTip(models.Model):
    occasion = models.CharField(max_length=100, help_text="e.g., Wedding, Office Party, Casual")
    suggestion = models.TextField(help_text="Provide a detailed fashion tip.")

    def __str__(self):
        return self.occasion


class ChatSession(models.Model):
   
    session_id = models.CharField(max_length=100, unique=True, db_index=True)
    
   
    history = models.JSONField(default=list, blank=True)
    
   
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.session_id