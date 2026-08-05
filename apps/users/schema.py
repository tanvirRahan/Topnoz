from ninja import Schema

class UserSchema(Schema):
    id: int
    username: str
    email: str
    first_name: str
    last_name: str

from typing import Optional

class RegisterSchema(Schema):
    email: str
    password: str
    username: Optional[str] = ""
    first_name: str = ""
    last_name: str = ""

class TrackVisitorSchema(Schema):
    os: Optional[str] = None
    browser: Optional[str] = None
    device_info: Optional[str] = None
    referrer_url: Optional[str] = None
    screen_resolution: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None

class ProductViewSchema(Schema):
    slug: str
