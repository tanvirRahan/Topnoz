import os
import json
import re
from groq import Groq
from django.db.models import Q
from apps.store.models import Item
from .models import ChatSession

_api_key = os.environ.get("GROQ_API_KEY")
if _api_key:
    _api_key = _api_key.strip()

try:
    client = Groq(api_key=_api_key)
except Exception as e:
    client = None

class ChatService:
    @staticmethod
    def generate_response(user_message, session_id):
        if not client:
            raise ValueError("AI service is unavailable")

        chat_session, created = ChatSession.objects.get_or_create(session_id=session_id)
        history = chat_session.history[-16:] # Increased context for better memory

        all_categories = list(Item.objects.values_list('product_type', flat=True).distinct())
        categories_str = ", ".join([cat.title() for cat in all_categories]) if all_categories else "Various Clothing"

        system_prompt = f"""
        You are 'TARS', an intelligent, elegant, and highly helpful style architect for the premium clothing brand 'Topnoz'.
        Current available categories in our store: {categories_str}
        
        CRITICAL RULES:
        1. LANGUAGE: You MUST respond in professional, polite, and fluent English at all times.
        2. GREETINGS: If the user simply says 'hi', 'hello', 'hlw' or a similar greeting, just greet them back warmly and ask how you can assist them today. Do NOT apologize or bring up past searches.
        3. PRODUCT SEARCH: If the user asks to see products or find clothes, you MUST use the 'search_products' tool. NEVER output raw JSON strings or tool syntaxes in your text response.
        4. ORDER STATUS: You MUST ask the user for BOTH their 'Order ID' AND their 'Email Address' before checking an order. Do NOT call the 'get_order_status' tool until you have received both from the user.
        5. TEXT FORMAT: Keep your responses concise and conversational. Do NOT output any system notes, parenthetical comments (e.g., "(Note: products will be displayed)"), or internal thoughts.
        6. PRODUCT DISPLAY: When you use the search_products tool, simply say something like "Here are some options I found for you:". Do not list the product details manually.
        """

        messages_for_ai = [{"role": "system", "content": system_prompt}]
        messages_for_ai.extend(history)
        messages_for_ai.append({"role": "user", "content": user_message})
        
        from .tools import tools, execute_tool
        
        relevant_products = []

        try:
            chat_completion = client.chat.completions.create(
                messages=messages_for_ai, 
                model="llama-3.1-8b-instant",
                tools=tools,
                tool_choice="auto",
                temperature=0.2
            )
            
            response_message = chat_completion.choices[0].message
            
            if response_message.tool_calls:
                assistant_message = {
                    "role": "assistant",
                    "content": response_message.content,
                    "tool_calls": [
                        {
                            "id": tc.id,
                            "type": tc.type,
                            "function": {
                                "name": tc.function.name,
                                "arguments": tc.function.arguments,
                            }
                        } for tc in response_message.tool_calls
                    ]
                }
                messages_for_ai.append(assistant_message)
                
                # Execute tools
                for tool_call in response_message.tool_calls:
                    function_name = tool_call.function.name
                    function_args = json.loads(tool_call.function.arguments)
                    
                    tool_response = execute_tool(function_name, function_args)
                    
                    if function_name == "search_products":
                        try:
                            res_data = json.loads(tool_response)
                            if res_data.get('status') == 'success' and 'results' in res_data:
                                slugs = [p['product_slug'] for p in res_data['results']]
                                relevant_products = list(Item.objects.filter(slug__in=slugs))
                        except:
                            pass

                    messages_for_ai.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "name": function_name,
                        "content": tool_response
                    })
                    
                # Call AI again to formulate final response based on tool output
                second_completion = client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=messages_for_ai,
                    temperature=0.2
                )
                ai_answer = second_completion.choices[0].message.content
                
            elif response_message.content and ("function=" in response_message.content or '"query"' in response_message.content or '"limit"' in response_message.content):
                # Fallback for when Llama-3 leaks the tool call as raw text instead of standard tool_calls format
                content = response_message.content
                match_func = re.search(r'function=(\w+)>({.*?})', content)
                match_json = re.search(r'(\{[\s\r\n]*"limit"[\s\r\n]*:.*?\}|\{[\s\r\n]*"query"[\s\r\n]*:.*?\})', content)
                
                if match_func:
                    function_name = match_func.group(1)
                    function_args_str = match_func.group(2)
                elif match_json:
                    function_name = "search_products"
                    function_args_str = match_json.group(1)
                    # Clean leaked JSON from the visible text
                    content = content.replace(function_args_str, "").strip()
                    response_message.content = content
                else:
                    function_name = None
                    function_args_str = ""

                if function_name:
                    try:
                        function_args = json.loads(function_args_str)
                    except:
                        function_args = {}
                        
                    tool_response = execute_tool(function_name, function_args)
                    
                    if function_name == "search_products":
                        try:
                            res_data = json.loads(tool_response)
                            if res_data.get('status') == 'success' and 'results' in res_data:
                                slugs = [p['product_slug'] for p in res_data['results']]
                                relevant_products = list(Item.objects.filter(slug__in=slugs))
                        except:
                            pass
                            
                    messages_for_ai.append({"role": "assistant", "content": response_message.content})
                    messages_for_ai.append({"role": "user", "content": f"System Tool Response: {tool_response}\n\nNow answer the user based on this information."})
                    
                    second_completion = client.chat.completions.create(
                        model="llama-3.1-8b-instant",
                        messages=messages_for_ai,
                        temperature=0.2
                    )
                    ai_answer = second_completion.choices[0].message.content
                    
                    # Remove any leftover JSON from final answer just in case
                    ai_answer = re.sub(r'(\{[\s\r\n]*"limit"[\s\r\n]*:.*?\}|\{[\s\r\n]*"query"[\s\r\n]*:.*?\})', '', ai_answer).strip()
                else:
                    ai_answer = response_message.content
            else:
                ai_answer = response_message.content
        except Exception as e:
            print(f"Groq API Error: {e}")
            ai_answer = f"Sorry, I am having trouble connecting to my brain right now. Error: {str(e)}"

        # Filter out tool calls from saving in DB history to avoid breaking future API contexts
        db_history_ai_answer = ai_answer
        chat_session.history.append({"role": "user", "content": user_message})
        chat_session.history.append({"role": "assistant", "content": db_history_ai_answer})
        if len(chat_session.history) > 20: chat_session.history = chat_session.history[-20:]
        chat_session.save()

        return ai_answer, relevant_products
