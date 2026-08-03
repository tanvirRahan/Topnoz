from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.urls import reverse 
from .services import ChatService

@api_view(['POST'])
def chat(request):
    user_message = request.data.get('message', '').strip()
    session_id = request.data.get('session_id')

    if not user_message or not session_id:
        return Response([{"type": "error", "content": "Message or Session ID is missing"}], status=400)
    
    try:
        ai_answer, relevant_products = ChatService.generate_response(user_message, session_id)
        
        response_data = [{'type': 'text', 'content': ai_answer}]

        if relevant_products:
            for product in relevant_products:
                price = product.discount_price if product.discount_price else product.price
                response_data.append({
                    'type': 'product_card',
                    'name': product.title,
                    'price': f"{price} BDT",
                    'image_url': product.image.url if product.image else '',
                    'product_link': reverse('ProductDetailView', kwargs={'slug': product.slug})
                })

        return Response(response_data)

    except ValueError as ve:
        return Response([{"type": "error", "content": str(ve)}], status=503)
    except Exception as e:
        print(f"Error in chat view: {e}")
        return Response([{"type": "text", "content": "Oops! Something went wrong. Please try again. 🛠️"}])