from django.contrib import messages
from django.contrib.auth.models import User, auth
from django.core.mail import send_mail
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
from django.views.generic import ListView, DetailView
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import Item, OrderItem, Order, CustomerOrder
from django.db import IntegrityError  # নতুন ইম্পোর্ট যোগ করা হয়েছে

class HomeView(ListView):
    model = Item
    template_name = "home.html"
    paginate_by = 8

    def get_queryset(self):
        queryset = super().get_queryset().order_by('id')
        query = self.request.GET.get('q')
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(categories__icontains=query)
            ).distinct()
        return queryset

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
            messages.error(request, f"An unexpected error occurred. Please try again.")
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

        # ভ্যালিডেশন চেক
        errors = []
        
        if User.objects.filter(username__iexact=username).exists():
            errors.append("এই ইউজারনেম ইতিমধ্যে ব্যবহৃত হয়েছে")
        
        if password != confirmpassword:
            errors.append("পাসওয়ার্ড মিলছে না")
        
        if User.objects.filter(email__iexact=email).exists():
            errors.append("এই ইমেইল ইতিমধ্যে ব্যবহৃত হয়েছে")
        
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
            messages.success(request, "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!")
            return redirect('userLogin')
            
        except IntegrityError:
            messages.error(request, "এই ইউজারনেম বা ইমেইল ইতিমধ্যে ব্যবহৃত হয়েছে")
            return redirect('register')
        except Exception as e:
            messages.error(request, f"অ্যাকাউন্ট তৈরি করতে সমস্যা: {str(e)}")
            return redirect('register')
    
    return render(request, "register.html")

def contact(request):
    if request.method == "POST":
        message_name = request.POST['message_name']
        message_email = request.POST['message_email']
        user_message = request.POST.get('user_message', '')
        send_mail(
            f'Pet Shop Message From {message_name}',
            user_message,
            message_email,
            ['solomondanso58@gmail.com'],
            fail_silently=True
        )
        return render(request, "contact.html", {
            'congratulations_message': f"{message_name}, your email has been received!"
        })
    return render(request, "contact.html")

@login_required
def add_to_cart(request, slug):
    item = get_object_or_404(Item, slug=slug)
    order_item, created = OrderItem.objects.get_or_create(
        item=item, user=request.user, ordered=False)
    order_qs = Order.objects.filter(user=request.user, ordered=False)

    if order_qs.exists():
        order = order_qs[0]
        if order.items.filter(item__slug=item.slug).exists():
            order_item.quantity += 1
            order_item.save()
            messages.success(request, f"{item.title}'s quantity updated")
        else:
            order.items.add(order_item)
            messages.success(request, f"{item.title} added to cart")
    else:
        order = Order.objects.create(
            user=request.user, ordered=False, ordered_date=timezone.now())
        order.items.add(order_item)
        messages.success(request, f"{item.title} added to cart")
    return redirect('ProductDetailView', slug=slug)

@login_required
def remove_from_cart(request, slug):
    item = get_object_or_404(Item, slug=slug)
    order_qs = Order.objects.filter(user=request.user, ordered=False)

    if order_qs.exists():
        order = order_qs[0]
        if order.items.filter(item__slug=item.slug).exists():
            order_item = OrderItem.objects.get(
                item=item, user=request.user, ordered=False)
            order.items.remove(order_item)
            messages.success(request, f"{item.title} removed from cart")
        else:
            messages.info(request, f"{item.title} not in your cart")
    else:
        messages.info(request, "No active order")
    return redirect('cart')

@login_required
def cart_view(request):
    try:
        order = Order.objects.get(user=request.user, ordered=False)
        return render(request, "cart.html", {
            'cart_items': order.items.all(),
            'total': order.get_total()
        })
    except Order.DoesNotExist:
        return render(request, "cart.html", {'cart_items': [], 'total': 0})

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
                if not request.POST.get('bkash_number') or not request.POST.get('bkash_transaction'):
                    messages.error(request, "Please provide bKash details")
                    return redirect('order')
            
            customer_order = CustomerOrder.objects.create(
                user=request.user,
                name=request.POST.get('name'),
                email=request.POST.get('email'),
                phone=request.POST.get('phone'),
                address=request.POST.get('address'),
                city=request.POST.get('city'),
                payment_method=payment_method,
                bkash_number=request.POST.get('bkash_number'),
                bkash_transaction=request.POST.get('bkash_transaction'),
                order=order,
                order_total=order.get_total()
            )
            
            for item in order.items.all():
                item.customer_order = customer_order
                item.save()
            
            order.ordered = True
            order.ordered_date = timezone.now()
            order.save()
            
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
    return redirect('cart')

@login_required
def remove_quantity(request, slug):
    order = Order.objects.filter(user=request.user, ordered=False).first()
    if order:
        item = get_object_or_404(Item, slug=slug)
        order_item = OrderItem.objects.filter(
            item=item, user=request.user, ordered=False).first()
        if order_item and order_item.quantity > 1:
            order_item.quantity -= 1
            order_item.save()
    return redirect('cart')
