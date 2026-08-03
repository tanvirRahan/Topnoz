import os
from groq import Groq
from django.db.models import Q
from apps.store.models import Item
from .models import ChatSession

try:
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
except Exception as e:
    client = None

class ChatService:
    @staticmethod
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

    @staticmethod
    def generate_response(user_message, session_id):
        if not client:
            raise ValueError("AI service is unavailable")

        chat_session, created = ChatSession.objects.get_or_create(session_id=session_id)
        history = chat_session.history[-4:]

        relevant_products, context_for_ai, relevance_score = ChatService.get_relevant_info_from_db(user_message)
        
        final_context = context_for_ai if relevance_score >= 1 else "No relevant information found."
        
        # Make the prompt dynamic by fetching available categories
        all_categories = list(Item.objects.values_list('product_type', flat=True).distinct())
        categories_str = ", ".join([cat.title() for cat in all_categories]) if all_categories else "Various Clothing"

        system_prompt = f"""
        You are 'TARS'BOT', an intelligent, elegant, and polite style architect for the premium clothing brand 'Topnoz'.
        Current available categories in our store: {categories_str}
        
        Your Goal: Provide a very short, friendly, and helpful text-only response.
        
        Rules:
        1. Base your answer heavily on the provided `DATABASE CONTEXT`.
        2. DO NOT list product names or prices yourself. The system will display the product cards separately below your message.
        3. Good Example: "I found some amazing T-shirts for you! Have a look below."
        4. Bad Example: "I found: 1. Black Shirt (500 BDT)..." -> NEVER write lists like this.
        5. If the user asks for something we don't have (Context says "No relevant information"), politely inform them and suggest checking our available categories.
        6. Speak naturally and elegantly. Match the user's language (English or polite Banglish).
        
        ---
        DATABASE CONTEXT: {final_context}
        ---
        """

        messages_for_ai = [{"role": "system", "content": system_prompt}]
        messages_for_ai.extend(history)
        messages_for_ai.append({"role": "user", "content": user_message})
        
        chat_completion = client.chat.completions.create(messages=messages_for_ai, model="llama-3.1-8b-instant")
        ai_answer = chat_completion.choices[0].message.content

        chat_session.history.append({"role": "user", "content": user_message})
        chat_session.history.append({"role": "assistant", "content": ai_answer})
        if len(chat_session.history) > 20: chat_session.history = chat_session.history[-20:]
        chat_session.save()

        return ai_answer, relevant_products
