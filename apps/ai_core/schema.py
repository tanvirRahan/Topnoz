from ninja import Schema
from typing import Optional, List

class ChatRequestSchema(Schema):
    message: str
    session_id: str

class ChatResponseProductSchema(Schema):
    type: str
    name: str
    price: str
    image_url: str
    product_slug: str

class ChatResponseTextSchema(Schema):
    type: str
    content: str
