

import os
from groq import Groq
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import FashionTip, ChatSession
from pet.models import Item 
from django.urls import reverse 
try:
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    print("Groq AI client configured successfully.")
except Exception as e:
    client = None
    print(f"FATAL ERROR: Could not configure Groq client. Error: {e}")

@api_view(['POST'])
def chat(request):
    user_message = request.data.get('message', '').strip()
    session_id = request.data.get('session_id')

    if not user_message or not session_id:
        return Response([{"type": "error", "content": "Message or Session ID is missing"}], status=400)
    if not client:
        return Response([{"type": "error", "content": "AI service is unavailable"}], status=503)

    chat_session, created = ChatSession.objects.get_or_create(session_id=session_id)
    history = chat_session.history[-4:]

  
    relevant_products, context_for_ai, relevance_score = get_relevant_info_from_db(user_message)
    
    final_context = context_for_ai if relevance_score >= 1 else "No relevant information found."
    
    system_prompt = f"""
    You are 'TARS'BOT', an intelligent style architect for 'Topnoz'.
    Your goal is to provide a very short, concise, and elegant text-only introductory answer.
    - Analyze the user's message in context of the conversation history.
    - Use the `DATABASE CONTEXT` to understand what products were found.
    - Your response should be a natural language text summary. **DO NOT list products or prices yourself.** The system will show product cards separately.
    - **Good Example:** If context shows a list of T-shirts, you should say something like "Yes, I found some great T-shirts for you! Check them out below."
    - **Bad Example:** "I found: 1. Amrito T-shirt (450 BDT)..." -> THIS IS WRONG.
    - If no context is found, use your general knowledge.
    ---
    DATABASE CONTEXT: {final_context}
    ---
    """

    messages_for_ai = [{"role": "system", "content": system_prompt}]
    messages_for_ai.extend(history)
    messages_for_ai.append({"role": "user", "content": user_message})
    
    try:
        chat_completion = client.chat.completions.create(messages=messages_for_ai, model="openai/gpt-oss-20b")
        ai_answer = chat_completion.choices[0].message.content

        chat_session.history.append({"role": "user", "content": user_message})
        chat_session.history.append({"role": "assistant", "content": ai_answer})
        if len(chat_session.history) > 20: chat_session.history = chat_session.history[-20:]
        chat_session.save()

        
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

    except Exception as e:
        print(f"Error in chat view: {e}")
        return Response([{"type": "text", "content": "Oops! Something went wrong. Please try again. 🛠️"}])



def get_relevant_info_from_db(message):
    message_lower = message.lower()
    relevance_score = 0
    context_for_ai = ""
    found_products = []

    summary_keywords = ['sob', 'all', 'mot', 'koita', 'koyta', 'list', 'summary', 'categories', 'collection']
    if any(keyword in message_lower for keyword in summary_keywords):
        all_categories = Item.objects.values_list('product_type', flat=True).distinct()
        context_for_ai = f"User is asking for a summary of all {len(all_categories)} categories: {', '.join(sorted(all_categories))}"
        relevance_score = 10
        return [], context_for_ai, relevance_score

    all_db_categories = list(Item.objects.values_list('product_type', flat=True).distinct())
    sorted_categories = sorted(all_db_categories, key=len, reverse=True)
    found_category = None

    for category in sorted_categories:
        variations = [category.lower(), category.lower().replace(' ', ''), category.lower().replace('-', ''), category.lower().replace('-', ' ')]
        for var in set(variations):
            if var in message_lower:
                found_category = category
                break
        if found_category: break

    if found_category:
        found_products = Item.objects.filter(product_type__iexact=found_category).distinct()[:3]
        if found_products:
            product_names = ", ".join([p.title for p in found_products])
            context_for_ai = f"Found these products in '{found_category.title()}' category: {product_names}"
            relevance_score = 5
        else:
            context_for_ai = f"No products found in the '{found_category.title()}' category."
            relevance_score = 5
        return found_products, context_for_ai, relevance_score

    words_in_message = set(word.strip() for word in message_lower.split())
    product_query = Q(title__icontains=message)
    for keyword in words_in_message:
        product_query |= Q(description__icontains=keyword)
    
    found_products = Item.objects.filter(product_query).distinct()[:3]
    if found_products:
        product_names = ", ".join([p.title for p in found_products])
        context_for_ai = f"Found products matching query: {product_names}"
        relevance_score = 1

    return found_products, context_for_ai, relevance_score