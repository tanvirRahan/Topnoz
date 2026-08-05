import json
from django.db.models import Q
from apps.store.models.orders import CustomerOrder
from apps.store.models.items import Item

def get_order_status(order_id, email):
    try:
        order = CustomerOrder.objects.get(id=order_id, email__iexact=email)
        return json.dumps({
            "status": "success",
            "order_id": order.id,
            "order_status": order.status,
            "name": order.name,
            "total": str(order.order_total),
            "date": order.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })
    except CustomerOrder.DoesNotExist:
        return json.dumps({
            "status": "error",
            "message": "Order not found with the provided Order ID and Email."
        })
    except Exception as e:
        return json.dumps({
            "status": "error",
            "message": str(e)
        })

def search_products(query, limit=5):
    try:
        words = query.replace(',', ' ').split()
        q_objects = Q()
        
        # If no valid words, fallback to match everything just to return something
        if not words:
            items = Item.objects.all().order_by('-created_at')[:limit]
        else:
            for word in words:
                # ignore very small stop words
                if len(word) > 2 or word.lower() in ['t', 'jeans']:
                    q_objects |= Q(title__icontains=word) | Q(description__icontains=word) | Q(product_type__icontains=word)
            
            if not q_objects:
                q_objects = Q(title__icontains=query)
                
            items = Item.objects.filter(q_objects).distinct().order_by('-created_at')[:limit]
        
        results = []
        for item in items:
            img_url = item.image.url if item.image else ""
            results.append({
                "name": item.title,
                "price": f"৳{item.price}",
                "image_url": img_url,
                "product_slug": item.slug,
                "description": item.description[:100] + "..." if len(item.description) > 100 else item.description
            })
        
        if not results:
            return json.dumps({"status": "success", "results": [], "message": f"No products found for '{query}'."})
        
        return json.dumps({
            "status": "success",
            "results": results
        })
    except Exception as e:
        return json.dumps({
            "status": "error",
            "message": str(e)
        })

# Define the schema for Groq
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_order_status",
            "description": "Check the status of a customer's order. Call this whenever a user asks about their order tracking or status.",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "string",
                        "description": "The unique order ID or order number (e.g., 15)",
                    },
                    "email": {
                        "type": "string",
                        "description": "The email address the customer used to place the order",
                    },
                },
                "required": ["order_id", "email"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "search_products",
            "description": "Search the database for clothing products or items based on user's request. Call this whenever a user asks to see, find, or buy specific products.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query (e.g., 'black shirt', 'denim jeans', 'summer t-shirt').",
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Maximum number of results to return (default 5, max 10)",
                    },
                },
                "required": ["query"],
            },
        },
    }
]

def execute_tool(tool_name, arguments):
    if tool_name == "get_order_status":
        order_id = arguments.get("order_id")
        email = arguments.get("email")
        return get_order_status(order_id, email)
    elif tool_name == "search_products":
        query = arguments.get("query")
        limit = arguments.get("limit", 5)
        return search_products(query, limit)
    return json.dumps({"error": f"Unknown tool: {tool_name}"})
