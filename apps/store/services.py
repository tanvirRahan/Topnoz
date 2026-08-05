from django.core.mail import send_mail
from django.utils import timezone
from .models import Order, CustomerOrder, OrderItem, Variation

class OrderService:
    @staticmethod
    def process_checkout(request, payment_method, bkash_number, bkash_transaction):
        order = Order.objects.filter(user=request.user, ordered=False).first()
        if not order:
            raise ValueError("No active order found")
            
        order_items = order.items.all()
        if not order_items.exists():
            raise ValueError("Your cart is empty. Please add products before checking out.")
        product_names = [item.item.title for item in order_items]
        quantities = [str(item.quantity) for item in order_items]
        sizes = [item.size or '' for item in order_items]

        customer_order = CustomerOrder.objects.create(
            user=request.user,
            name=request.POST.get('name'),
            email=request.POST.get('email'),
            phone=request.POST.get('phone'),
            address=request.POST.get('address'),
            city=request.POST.get('city'),
            payment_method=payment_method,
            bkash_number=bkash_number,
            bkash_transaction=bkash_transaction,
            order=order,
            order_total=order.get_total(),
            products=", ".join(product_names),
            quantities=", ".join(quantities),
            sizes=", ".join(sizes)
        )

        for item in order_items:
            item.customer_order = customer_order
            item.save()

        order.ordered = True
        order.ordered_date = timezone.now()
        order.save()
        
        # Send emails
        product_details = ""
        for item in order_items:
            product_details += f"Product: {item.item.title}, Quantity: {item.quantity}\n"

        subject = f"Order Confirmation - Order #{order.id}"
        message = (
            f"Dear {request.user.first_name},\n\n"
            f"Thank you for your order!\n\n"
            f"Order Details:\n"
            f"{product_details}\n"
            f"Delivery Address: {customer_order.address}, {customer_order.city}\n"
            f"Phone: {customer_order.phone}\n\n"
            f"We will contact you soon for delivery.\n"
            f"Best regards,\n"
            f"TopNoz Team"
        )
        send_mail(subject, message, 'topnozweb@gmail.com', [request.user.email], fail_silently=False)

        admin_message = (
            f"New order placed by {request.user.username} ({request.user.email})\n\n"
            f"Order Details:\n"
            f"{product_details}\n"
            f"Delivery Address: {customer_order.address}, {customer_order.city}\n"
            f"Phone: {customer_order.phone}\n"
            f"Order ID: {order.id}\n"
        )
        send_mail(f"New Order Placed - Order #{order.id}",
                  admin_message, 'topnozweb@gmail.com', ['topnozweb@gmail.com'], fail_silently=False)
                  
        return order


class CartService:
    @staticmethod
    def add_to_cart(user, item, size):
        has_size_variation = Variation.objects.filter(item=item, name__iexact="size", itemvariation__isnull=False).exists()
        if has_size_variation and not size:
            raise ValueError("Please select a size before adding to cart.")
            
        order, _ = Order.objects.get_or_create(
            user=user,
            ordered=False,
            defaults={'ordered_date': timezone.now()}
        )
        
        order_item, created_item = OrderItem.objects.get_or_create(
            user=user,
            item=item,
            size=size,
            ordered=False,
            defaults={'quantity': 1}
        )
        
        if created_item:
            if item.stock < 1:
                order_item.delete()
                raise ValueError("This item is currently out of stock.")
            order.items.add(order_item)
            return True, f"'{item.title}' was added to your cart."
        else:
            if order_item.quantity >= item.stock:
                raise ValueError(f"Only {item.stock} items are available in stock.")
            order_item.quantity += 1
            order_item.save()
            return False, f"'{item.title}' quantity was updated in your cart."
            
    @staticmethod
    def remove_from_cart(user, item, size):
        order = Order.objects.filter(user=user, ordered=False).first()
        if not order:
            raise ValueError("No active order")

        order_item = OrderItem.objects.filter(
            item=item, user=user, ordered=False, size=size
        ).first()

        if order_item:
            order.items.remove(order_item)
            order_item.delete()
            order.save()
            return True
        return False
