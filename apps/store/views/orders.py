from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from apps.store.models import Order
from apps.store.services import OrderService

@login_required
def order_page(request):
    try:
        order = Order.objects.filter(user=request.user, ordered=False).first()
        if not order:
            messages.warning(request, "No active order")
            return redirect('cart')
        subtotal = float(order.get_total())
        delivery_fee = float(160)
        total = subtotal + delivery_fee
        return render(request, "order.html", {
            'cart_items': order.items.all(),
            'subtotal': subtotal,
            'delivery_fee': delivery_fee,
            'total': total,
        })
    except Exception as e:
        messages.error(request, f"Error: {str(e)}")
        return redirect('cart')

@login_required
def checkout(request):
    return render(request, "checkout.html")

@login_required
def process_order(request):
    if request.method == "POST":
        try:
            payment_method = request.POST.get('payment_method')
            bkash_number = request.POST.get('bkash_number') if payment_method == 'bkash' else request.POST.get('cod_bkash_number', '')
            bkash_transaction = request.POST.get('bkash_transaction') if payment_method == 'bkash' else request.POST.get('cod_bkash_transaction', '')

            if payment_method in ['bkash', 'cod'] and (not bkash_number or not bkash_transaction):
                messages.error(request, "Please provide bKash details")
                return redirect('order')

            OrderService.process_checkout(request, payment_method, bkash_number, bkash_transaction)
            
            messages.success(request, "Order placed successfully!")
            return redirect('thanks')
        except ValueError as e:
            messages.error(request, str(e))
            return redirect('cart')
        except Exception as e:
            messages.error(request, f"Error: {str(e)}")
            return redirect('order')
    return redirect('HomeView')

@login_required
def order_complete(request):
    if request.method == "POST":
        try:
            order = Order.objects.filter(user=request.user, ordered=False).first()
            if order:
                order.ordered = True
                order.ordered_date = timezone.now()
                order.save()
                messages.success(request, "Order completed!")
                return redirect('thanks')
            messages.error(request, "No active order")
            return redirect('cart')
        except Exception as e:
            messages.error(request, f"Error: {str(e)}")
            return redirect('cart')
    return redirect('HomeView')

@login_required
def thanks(request):
    return render(request, "thanks.html")
