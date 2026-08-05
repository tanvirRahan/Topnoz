from ninja import Router
from .services import ChatService
from .schema import ChatRequestSchema

router = Router()

@router.get("/debug-groq")
def debug_groq(request):
    import os, requests
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return {"status": "error", "message": "GROQ_API_KEY is not set in os.environ"}
    
    try:
        res = requests.get("https://api.groq.com/openai/v1/models", headers={"Authorization": f"Bearer {api_key}"}, timeout=5)
        return {"status": "success", "status_code": res.status_code, "response": res.text[:200]}
    except Exception as e:
        return {"status": "error", "message": str(e), "repr": repr(e)}

@router.post("/")
def chat_endpoint(request, payload: ChatRequestSchema):
    if not payload.message or not payload.session_id:
        return [{"type": "error", "content": "Message or Session ID is missing"}]
    
    try:
        ai_answer, relevant_products = ChatService.generate_response(payload.message, payload.session_id)
        response_data = [{'type': 'text', 'content': ai_answer}]

        if relevant_products:
            for product in relevant_products:
                price = product.discount_price if product.discount_price else product.price
                response_data.append({
                    'type': 'product_card',
                    'name': product.title,
                    'price': f"{price} BDT",
                    'image_url': product.image.url if product.image else '',
                    'product_slug': product.slug
                })

        return response_data
    except Exception as e:
        return [{"type": "error", "content": str(e)}]
