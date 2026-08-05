from django.db.models import QuerySet
from django.shortcuts import get_object_or_404
from .models import Item

def get_products(q: str = None, category: str = None, sort: str = None) -> QuerySet[Item]:
    """
    Returns a queryset of products based on search, category, and sorting filters.
    """
    queryset = Item.objects.prefetch_related('variation_set__itemvariation_set', 'media').all()
    
    if q:
        queryset = queryset.filter(title__icontains=q)
    if category:
        queryset = queryset.filter(product_type=category)
    if sort == 'new':
        queryset = queryset.order_by('-created_at')
        
    return queryset

def get_product_by_slug(slug: str) -> Item:
    """
    Returns a single product by slug or raises 404.
    """
    return get_object_or_404(
        Item.objects.prefetch_related('variation_set__itemvariation_set', 'media'), 
        slug=slug
    )
