from django.urls import path
from .views import (
    HomeView,
    ProductDetailView,
    checkout,
    contact,
    add_to_cart,
    remove_from_cart,
    register,
    userLogin,
    logout,
    cart_view,
    order_page,
    order_complete,
    thanks,
    process_order,
    add_quantity,       # ✚ Increase quantity
    remove_quantity,    # ✖ Decrease quantity
)

urlpatterns = [
    path('', HomeView.as_view(), name="HomeView"),
    path('contact/', contact, name="contact"),
    path('userLogin/', userLogin, name="userLogin"),
    path('logout/', logout, name="logout"),
    path('register/', register, name="register"),
    path('product/<slug>/', ProductDetailView.as_view(), name="ProductDetailView"),
    path('add-to-cart/<slug>/', add_to_cart, name="add-to-cart"),
    path('remove-from-cart/<slug>/', remove_from_cart, name="remove-from-cart"),
    path('cart/', cart_view, name="cart"),
    path('cart/add/<slug:slug>/', add_quantity, name="add-quantity"),         # ➕ Increase quantity
    path('cart/remove/<slug:slug>/', remove_quantity, name="remove-quantity"), # ➖ Decrease quantity
    path('checkout/', checkout, name="checkout"),
    path('order/', order_page, name="order"),
    path('order-complete/', order_complete, name="order_complete"),
    path('process_order/', process_order, name="process_order"),
    path('thanks/', thanks, name="thanks"),
]