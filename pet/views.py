from django.contrib import messages
from django.contrib.auth.models import User, auth
from django.core.mail import send_mail
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
from django.views.generic import ListView, DetailView, TemplateView
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import Item, OrderItem, Order, CustomerOrder
from django.db import IntegrityError
from django.http import JsonResponse
from django.urls import reverse

class HomeView(ListView):
    model = Item
    template_name = "home.html"
    paginate_by = 20

    def get_queryset(self):
        queryset = super().get_queryset().order_by('order', '-created_at')
        query = self.request.GET.get('q')
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query)
            ).distinct()
        return queryset

class CategoryListView(TemplateView):
    template_name = 'category_list.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['product_types'] = [
            ('shirt', 'Shirt'),
            ('polo-tshirt', 'Polo Tshirt'),
            ('tshirt', 'Tshirt'),
            ('punjabi', 'Punjabi'),
            ('pant', 'Pant'),
            ('footware', 'Footware'),
            ('lifestyle', 'Lifestyle'),
        ]
        return context

class CategoryProductListView(ListView):
    model = Item
    template_name = 'category_products.html'
    context_object_name = 'object_list'
    paginate_by = 20

    def get_queryset(self):
        queryset = Item.objects.filter(product_type=self.kwargs['product_type']).order_by('order', '-created_at')
        query = self.request.GET.get('q')
        if query:
            queryset = queryset.filter(title__icontains=query)
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category_label'] = dict([
            ('shirt', 'Shirt'),
            ('polo-tshirt', 'Polo Tshirt'),
            ('tshirt', 'Tshirt'),
            ('punjabi', 'Punjabi'),
            ('pant', 'Pant'),
            ('footware', 'Footware'),
            ('lifestyle', 'Lifestyle'),
        ])[self.kwargs['product_type']]
        return context

class ProductDetailView(DetailView):
    model = Item
    template_name = "product.html"

def userLogin(request):
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')
        try:
            user_obj = User.objects.get(email=email)
            user = auth.authenticate(request, username=user_obj.username, password=password)
            if user is not None:
                auth.login(request, user)
                return redirect('/')
            else:
                messages.warning(request, "Invalid email or password.")
        except User.DoesNotExist:
            messages.warning(request, "Invalid email or password.")
        except Exception as e:
            messages.error(request, "An unexpected error occurred. Please try again.")
    return render(request, "login.html")

def logout(request):
    auth.logout(request)
    return redirect('/')

@login_required
def checkout(request):
    return render(request, "checkout.html")

def register(request):
    if request.method == "POST":
        firstname = request.POST.get('firstname').strip()
        lastname = request.POST.get('lastname').strip()
        username = request.POST.get('username').strip()
        password = request.POST.get('password')
        confirmpassword = request.POST.get('confirmpassword')
        email = request.POST.get('email').strip().lower()

        errors = []
        if User.objects.filter(username__iexact=username).exists():
            errors.append("This username is already taken.")
        if password != confirmpassword:
            errors.append("Passwords do not match.")
        if User.objects.filter(email__iexact=email).exists():
            errors.append("This email is already registered.")
        if errors:
            for error in errors:
                messages.error(request, error)
            return redirect('register')

        try:
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                first_name=firstname,
                last_name=lastname
            )
            messages.success(request, "Account created successfully!")
            return redirect('userLogin')
        except IntegrityError:
            messages.error(request, "This username or email is already used.")
            return redirect('register')
        except Exception as e:
            messages.error(request, f"Error creating account: {str(e)}")
            return redirect('register')
    return render(request, "register.html")

def contact(request):
    if request.method == "POST":
        message_name = request.POST['message_name']
        message_email = request.POST['message_email']
        user_message = request.POST.get('user_message', '')
        full_message = f"Sender Name: {message_name}\nSender Email: {message_email}\n\nMessage:\n{user_message}"
        send_mail(
            f'Contact Message From {message_name}',
            full_message,
            'topnozweb@gmail.com',
            ['topnozweb@gmail.com'],
            fail_silently=True
        )
        return redirect(f"{reverse('contact')}?success=1&name={message_name}")
    congratulations_message = None
    if request.GET.get('success') == '1':
        congratulations_message = f"{request.GET.get('name')}, your email has been received!"
    return render(request, "contact.html", {
        'congratulations_message': congratulations_message
    })

# ==== FIXED SMART QUANTITY VERSION ====
@login_required
def add_to_cart(request, slug):
    item = get_object_or_404(Item, slug=slug)
    size = request.POST.get('size') or None

    order_qs = Order.objects.filter(user=request.user, ordered=False)

    if order_qs.exists():
        order = order_qs.first()
        order_item = OrderItem.objects.filter(
            item=item, user=request.user, ordered=False, size=size
        ).first()

        if order_item:
            order_item.quantity += 1
            order_item.save()
            messages.success(request, f"{item.title} ({size or 'No Size'}) quantity updated")
        else:
            order_item = OrderItem.objects.create(
                item=item, user=request.user, ordered=False, size=size, quantity=1
            )
            order.items.add(order_item)
            messages.success(request, f"{item.title} ({size or 'No Size'}) added to cart")
    else:
        order = Order.objects.create(user=request.user, ordered=False, ordered_date=timezone.now())
        order_item = OrderItem.objects.create(
            item=item, user=request.user, ordered=False, size=size, quantity=1
        )
        order.items.add(order_item)
        messages.success(request, f"{item.title} ({size or 'No Size'}) added to cart")

    return redirect('ProductDetailView', slug=slug)

@login_required
def remove_from_cart(request, slug):
    item = get_object_or_404(Item, slug=slug)
    size = request.POST.get('size') or None

    order_qs = Order.objects.filter(user=request.user, ordered=False)
    if order_qs.exists():
        order = order_qs.first()
        order_item = OrderItem.objects.filter(
            item=item, user=request.user, ordered=False, size=size
        ).first()
        if order_item:
            if order_item.quantity > 1:
                order_item.quantity -= 1
                order_item.save()
                messages.success(request, f"{item.title} ({size or 'No Size'}) quantity decreased")
            else:
                order.items.remove(order_item)
                order_item.delete()
                messages.success(request, f"{item.title} ({size or 'No Size'}) removed from cart")
        else:
            messages.info(request, f"{item.title} ({size or 'No Size'}) not in your cart")
    else:
        messages.info(request, "No active order")
    return redirect('cart')
# =====================================

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
def process_order(request):
    if request.method == "POST":
        try:
            order = Order.objects.filter(user=request.user, ordered=False).first()
            if not order:
                messages.error(request, "No active order found")
                return redirect('cart')
            payment_method = request.POST.get('payment_method')
            if payment_method == 'bkash':
                bkash_number = request.POST.get('bkash_number')
                bkash_transaction = request.POST.get('bkash_transaction')
            elif payment_method == 'cod':
                bkash_number = request.POST.get('cod_bkash_number')
                bkash_transaction = request.POST.get('cod_bkash_transaction')
            else:
                bkash_number = ''
                bkash_transaction = ''
            if payment_method == 'bkash':
                if not bkash_number or not bkash_transaction:
                    messages.error(request, "Please provide bKash details")
                    return redirect('order')
            if payment_method == 'cod':
                if not bkash_number or not bkash_transaction:
                    messages.error(request, "Please provide bKash details for delivery fee payment")
                    return redirect('order')
            order_items = order.items.all()
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
            for item in order.items.all():
                item.customer_order = customer_order
                item.save()
            order.ordered = True
            order.ordered_date = timezone.now()
            order.save()

            product_details = ""
            for item in order.items.all():
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

            messages.success(request, "Order placed successfully!")
            return redirect('thanks')
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

# --------- SMART AJAX CART VIEWS BELOW ---------
@login_required
def add_quantity(request, slug):
    order = Order.objects.filter(user=request.user, ordered=False).first()
    if order:
        item = get_object_or_404(Item, slug=slug)
        order_item = OrderItem.objects.filter(
            item=item, user=request.user, ordered=False).first()
        if order_item:
            order_item.quantity += 1
            order_item.save()
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                subtotal = order.get_total()
                tax = 0
                total = round(subtotal + tax, 2)
                return JsonResponse({
                    'quantity': order_item.quantity,
                    'item_total': float(order_item.get_total_item_price()),
                    'subtotal': float(subtotal),
                    'tax': float(tax),
                    'total': float(total),
                    'cart_empty': order.items.count() == 0,
                })
    return redirect('cart')

@login_required
def remove_quantity(request, slug):
    order = Order.objects.filter(user=request.user, ordered=False).first()
    if order:
        item = get_object_or_404(Item, slug=slug)
        order_item = OrderItem.objects.filter(
            item=item, user=request.user, ordered=False).first()
        if order_item:
            if order_item.quantity > 1:
                order_item.quantity -= 1
                order_item.save()
                if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                    subtotal = order.get_total()
                    tax = 0
                    total = round(subtotal + tax, 2)
                    return JsonResponse({
                        'quantity': order_item.quantity,
                        'item_total': float(order_item.get_total_item_price()),
                        'subtotal': float(subtotal),
                        'tax': float(tax),
                        'total': float(total),
                        'cart_empty': order.items.count() == 0,
                    })
    return redirect('cart')