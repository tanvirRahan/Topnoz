from django.urls import path
from apps.store.views import products, cart, orders, pages

urlpatterns = [
    path('', products.HomeView.as_view(), name="HomeView"),
    path('contact/', pages.contact, name="contact"),
    
    path('product/<slug>/', products.ProductDetailView.as_view(), name="ProductDetailView"),
    
    path('add-to-cart/<slug>/', cart.add_to_cart, name="add-to-cart"),
    path('remove-from-cart/<slug>/', cart.remove_from_cart, name="remove-from-cart"),
    path('cart/', cart.cart_view, name="cart"),
    path('cart/add/<slug:slug>/', cart.add_quantity, name="add-quantity"),
    path('cart/remove/<slug:slug>/', cart.remove_quantity, name="remove-quantity"),
    
    path('checkout/', orders.checkout, name="checkout"),
    path('order/', orders.order_page, name="order"),
    path('order-complete/', orders.order_complete, name="order_complete"),
    path('process_order/', orders.process_order, name="process_order"),
    path('thanks/', orders.thanks, name="thanks"),

    # --------- Category Browsing ---------
    path('categories/', products.CategoryListView.as_view(), name="CategoryListView"),
    path('categories/<str:product_type>/', products.CategoryProductListView.as_view(), name="CategoryProductListView"),

    # --------- New Arrivals ---------
    path('new-arrivals/', products.NewArrivalsView.as_view(), name='new_arrivals'),

    # --------- AI Chatbot Page ---------
    path('chatbot/', pages.chatbot_view, name='chatbot_view'), 
]