from django.contrib import messages
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from apps.store.models import Item, Order, OrderItem
from apps.store.services import CartService

@login_required
def add_to_cart(request, slug):
    item = get_object_or_404(Item, slug=slug)
    size = request.POST.get('size') or None
    try:
        created, msg = CartService.add_to_cart(request.user, item, size)
        if created:
            messages.success(request, msg)
        else:
            messages.info(request, msg)
    except ValueError as e:
        messages.error(request, str(e))
    return redirect('ProductDetailView', slug=slug)

@login_required
def remove_from_cart(request, slug):
    item = get_object_or_404(Item, slug=slug)
    size = request.POST.get('size') or None
    try:
        removed = CartService.remove_from_cart(request.user, item, size)
        if removed:
            messages.success(request, f"{item.title} ({size or 'No Size'}) removed from cart")
        else:
            messages.info(request, f"{item.title} not found in your cart")
    except ValueError as e:
        messages.info(request, str(e))
    return redirect('cart')

@login_required
def cart_view(request):
    try:
        order = Order.objects.get(user=request.user, ordered=False)
        subtotal = float(order.get_total())
        tax = 0
        total = round(subtotal + tax, 2)
        return render(request, "cart.html", {
            'cart_items': order.items.all(),
            'subtotal': subtotal,
            'tax': tax,
            'total': total,
        })
    except Order.DoesNotExist:
        return render(request, "cart.html", {'cart_items': [], 'subtotal': 0, 'tax': 0, 'total': 0})

@login_required
def add_quantity(request, slug):
    order = Order.objects.filter(user=request.user, ordered=False).first()
    if not order:
        return redirect('cart')

    item = get_object_or_404(Item, slug=slug)
    size = request.POST.get('size') or None
    order_item = OrderItem.objects.filter(item=item, user=request.user, ordered=False, size=size).first()

    if order_item:
        order_item.quantity += 1
        order_item.save()

    order.save()
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        subtotal = order.get_total()
        total = round(subtotal, 2)
        return JsonResponse({
            'success': True,
            'quantity': order_item.quantity if order_item else 0,
            'item_total': float(order_item.get_final_price()) if order_item else 0.0,
            'subtotal': float(subtotal),
            'tax': 0,
            'total': total,
            'cart_empty': not order.items.exists(),
        })
    return redirect('cart')

@login_required
def remove_quantity(request, slug):
    order = Order.objects.filter(user=request.user, ordered=False).first()
    if not order:
        return redirect('cart')

    item = get_object_or_404(Item, slug=slug)
    size = request.POST.get('size') or None
    order_item = OrderItem.objects.filter(item=item, user=request.user, ordered=False, size=size).first()

    if order_item:
        if order_item.quantity > 1:
            order_item.quantity -= 1
            order_item.save()
        else:
            order.items.remove(order_item)
            order_item.delete()

    order.save()
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        subtotal = order.get_total()
        total = round(subtotal, 2)
        return JsonResponse({
            'success': True,
            'quantity': order_item.quantity if order_item else 0,
            'item_total': float(order_item.get_final_price()) if order_item else 0.0,
            'subtotal': float(subtotal),
            'tax': 0,
            'total': total,
            'cart_empty': not order.items.exists(),
        })
    return redirect('cart')
