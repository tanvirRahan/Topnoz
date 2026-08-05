from ninja import Schema
from typing import List, Optional

class ProductSchema(Schema):
    id: int
    title: str
    price: float
    discount_price: Optional[float] = None
    slug: str
    description: str
    image_url: Optional[str] = None
    stock: int
    product_type: str
    sizes: List[str] = []
    images: List[str] = []

    @staticmethod
    def resolve_sizes(obj):
        sizes = []
        if obj.available_sizes:
            sizes = [s.strip() for s in obj.available_sizes.split(',') if s.strip()]
            
        variation = obj.variation_set.filter(name__iexact="size").first()
        if variation:
            for item_var in variation.itemvariation_set.all():
                if item_var.value not in sizes:
                    sizes.append(item_var.value)
        return sizes

    @staticmethod
    def resolve_image_url(obj):
        if obj.image:
            return obj.image.url
        return None

    @staticmethod
    def resolve_images(obj):
        gallery = []
        if obj.image:
            gallery.append(obj.image.url)
        for media in obj.media.filter(is_video=False).exclude(image=""):
            if media.image:
                gallery.append(media.image.url)
        return gallery

class CartItemSchema(Schema):
    id: int
    product_title: str
    slug: str
    quantity: int
    size: Optional[str]
    price: float
    discount_price: Optional[float]
    total_price: float
    image_url: Optional[str] = None

class CartSchema(Schema):
    items: List[CartItemSchema]
    subtotal: float
    delivery_fee: float
    total: float

class AddToCartSchema(Schema):
    slug: str
    size: Optional[str] = None

class CheckoutSchema(Schema):
    name: str
    email: str
    phone: str
    address: str
    city: str
    payment_method: str
    bkash_number: Optional[str] = None
    bkash_transaction: Optional[str] = None

class ContactSchema(Schema):
    name: str
    email: str
    message: str
