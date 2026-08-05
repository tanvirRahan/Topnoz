from ninja import Router
from typing import List
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from .models import Item, Order
from .schema import ProductSchema, CartSchema, AddToCartSchema, CheckoutSchema, ContactSchema
from ninja_jwt.authentication import JWTAuth
from .services import CartService, OrderService

router = Router()

from .selectors import get_products, get_product_by_slug

@router.get("/products", response=List[ProductSchema])
def list_products(request, q: str = None, category: str = None, sort: str = None):
    return get_products(q=q, category=category, sort=sort)

@router.get("/products/{slug}", response=ProductSchema)
def get_product(request, slug: str):
    return get_product_by_slug(slug)

@router.get("/cart", auth=JWTAuth(), response=CartSchema)
def get_cart(request):
    order = Order.objects.filter(user=request.user, ordered=False).first()
    if not order:
        return {"items": [], "subtotal": 0.0, "delivery_fee": 160.0, "total": 160.0}

    items = []
    for item in order.items.all():
        items.append({
            "id": item.id,
            "product_title": item.item.title,
            "slug": item.item.slug,
            "quantity": item.quantity,
            "size": item.size,
            "price": float(item.item.price),
            "discount_price": float(item.item.discount_price) if item.item.discount_price else None,
            "total_price": float(item.get_final_price()),
            "image_url": item.item.image.url if item.item.image else None
        })
    
    subtotal = float(order.get_total())
    return {
        "items": items,
        "subtotal": subtotal,
        "delivery_fee": 160.0,
        "total": subtotal + 160.0
    }

@router.post("/cart/add", auth=JWTAuth())
def add_to_cart(request, payload: AddToCartSchema):
    item = get_object_or_404(Item, slug=payload.slug)
    try:
        created, msg = CartService.add_to_cart(request.user, item, payload.size)
        return {"success": True, "message": msg}
    except ValueError as e:
        return {"success": False, "message": str(e)}

@router.post("/cart/remove", auth=JWTAuth())
def remove_from_cart(request, payload: AddToCartSchema):
    item = get_object_or_404(Item, slug=payload.slug)
    try:
        removed = CartService.remove_from_cart(request.user, item, payload.size)
        if removed:
            return {"success": True, "message": "Removed from cart"}
        return {"success": False, "message": "Item not found in cart"}
    except ValueError as e:
        return {"success": False, "message": str(e)}

@router.post("/cart/reduce", auth=JWTAuth())
def reduce_quantity(request, payload: AddToCartSchema):
    item = get_object_or_404(Item, slug=payload.slug)
    order = Order.objects.filter(user=request.user, ordered=False).first()
    if order:
        order_item = order.items.filter(item=item, size=payload.size).first()
        if order_item:
            if order_item.quantity > 1:
                order_item.quantity -= 1
                order_item.save()
                return {"success": True, "message": "Quantity reduced"}
            else:
                order.items.remove(order_item)
                order_item.delete()
                return {"success": True, "message": "Item removed"}
    return {"success": False, "message": "Item not found"}

@router.post("/checkout", auth=JWTAuth())
def process_checkout(request, payload: CheckoutSchema):
    try:
        order = Order.objects.filter(user=request.user, ordered=False).first()
        if not order:
            return {"success": False, "message": "No active order"}

        # Simulate form request for service
        request.POST = {
            'name': payload.name,
            'email': payload.email,
            'phone': payload.phone,
            'address': payload.address,
            'city': payload.city,
        }
        
        OrderService.process_checkout(request, payload.payment_method, payload.bkash_number, payload.bkash_transaction)
        return {"success": True, "message": "Order placed successfully!"}
    except ValueError as e:
        return {"success": False, "message": str(e)}

@router.post("/contact")
def process_contact(request, payload: ContactSchema):
    try:
        full_message = f"Sender Name: {payload.name}\nSender Email: {payload.email}\n\nMessage:\n{payload.message}"
        send_mail(
            f'Contact Message From {payload.name}',
            full_message,
            'topnozweb@gmail.com',
            ['topnozweb@gmail.com'],
            fail_silently=True
        )
        return {"success": True, "message": "Your message has been received!"}
    except Exception as e:
        return {"success": False, "message": "Failed to send message."}
