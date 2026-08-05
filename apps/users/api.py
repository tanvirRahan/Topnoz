from ninja import Router
from ninja_jwt.authentication import JWTAuth
from django.contrib.auth.models import User
from .schema import UserSchema, RegisterSchema

router = Router()

@router.get("/me", auth=JWTAuth(), response=UserSchema)
def get_me(request):
    return request.user

import uuid

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

@router.post("/register")
def register_user(request, payload: RegisterSchema):
    if User.objects.filter(email=payload.email).exists():
        return {"success": False, "message": "Email already exists"}
    
    try:
        validate_password(payload.password)
    except ValidationError as e:
        return {"success": False, "message": " ".join(e.messages)}
    
    # Generate unique username
    username = payload.username
    if not username:
        base_username = payload.email.split('@')[0]
        username = base_username
        while User.objects.filter(username=username).exists():
            username = f"{base_username}_{uuid.uuid4().hex[:6]}"
            
    if User.objects.filter(username=username).exists():
        return {"success": False, "message": "Username already exists"}
    
    user = User.objects.create_user(
        username=username,
        email=payload.email,
        password=payload.password,
        first_name=payload.first_name,
        last_name=payload.last_name
    )
    return {"success": True, "message": "User registered successfully"}

import requests
from django.utils import timezone
from .models import VisitorLog
from .schema import TrackVisitorSchema, ProductViewSchema

@router.post("/track-visitor")
def track_visitor(request, payload: TrackVisitorSchema):
    # Get IP address
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
        
    if not ip or ip == '127.0.0.1':
        # Local development fallback
        ip = request.META.get('HTTP_X_REAL_IP', ip)

    try:
        visitor, created = VisitorLog.objects.get_or_create(ip_address=ip)
        
        if not created:
            visitor.visit_count += 1
            visitor.last_visit = timezone.now()
        
        # Update device info if provided
        if payload.os:
            visitor.os = payload.os
        if payload.browser:
            visitor.browser = payload.browser
        if payload.device_info:
            visitor.device_info = payload.device_info
            
        # Update Marketing Data
        if payload.referrer_url and not visitor.referrer_url:
            visitor.referrer_url = payload.referrer_url
        if payload.screen_resolution:
            visitor.screen_resolution = payload.screen_resolution
        if payload.utm_source and not visitor.utm_source:
            visitor.utm_source = payload.utm_source
        if payload.utm_medium and not visitor.utm_medium:
            visitor.utm_medium = payload.utm_medium
        if payload.utm_campaign and not visitor.utm_campaign:
            visitor.utm_campaign = payload.utm_campaign
            
        # Fetch location if not already known and not local IP
        if not visitor.country and ip and ip != '127.0.0.1' and not ip.startswith('192.168'):
            try:
                res = requests.get(f'http://ip-api.com/json/{ip}', timeout=2)
                if res.status_code == 200:
                    data = res.json()
                    if data.get('status') == 'success':
                        visitor.country = data.get('country')
                        visitor.city = data.get('city')
                        visitor.isp = data.get('isp')
                        visitor.timezone = data.get('timezone')
                        visitor.zip_code = data.get('zip')
                        visitor.latitude = data.get('lat')
                        visitor.longitude = data.get('lon')
            except Exception:
                pass # Fail silently if location API is down
                
        visitor.save()
        return {"success": True}
    except Exception as e:
        return {"success": False, "message": str(e)}

@router.post("/track-product-view")
def track_product_view(request, payload: ProductViewSchema):
    # Track for unauthenticated visitor (via IP)
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    ip = x_forwarded_for.split(',')[0].strip() if x_forwarded_for else request.META.get('REMOTE_ADDR')
    ip = request.META.get('HTTP_X_REAL_IP', ip) if (not ip or ip == '127.0.0.1') else ip

    if ip:
        try:
            visitor = VisitorLog.objects.filter(ip_address=ip).first()
            if visitor:
                if not isinstance(visitor.viewed_products, list):
                    visitor.viewed_products = []
                # Only add if it's not the most recently viewed to avoid spam
                if not visitor.viewed_products or visitor.viewed_products[-1] != payload.slug:
                    visitor.viewed_products.append(payload.slug)
                    # Keep history to last 50 items to avoid giant JSON payload
                    visitor.viewed_products = visitor.viewed_products[-50:]
                    visitor.save(update_fields=['viewed_products'])
        except Exception:
            pass
            
    # Track for authenticated user
    if request.user.is_authenticated:
        try:
            profile = request.user.profile
            if not isinstance(profile.viewed_products, list):
                profile.viewed_products = []
            if not profile.viewed_products or profile.viewed_products[-1] != payload.slug:
                profile.viewed_products.append(payload.slug)
                profile.viewed_products = profile.viewed_products[-50:]
                profile.save(update_fields=['viewed_products'])
        except Exception:
            pass

    return {"success": True}

