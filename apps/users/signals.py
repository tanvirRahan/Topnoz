from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from .models import UserProfile
import requests
from user_agents import parse

@receiver(user_logged_in)
def capture_login_data(sender, request, user, **kwargs):
    try:
        # Ensure profile exists
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        # 1. Get IP Address
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        
        profile.last_ip_address = ip
        
        # 2. Get Device Info, OS, Browser
        user_agent_str = request.META.get('HTTP_USER_AGENT', '')
        profile.device_info = user_agent_str[:255]
        
        if user_agent_str:
            user_agent = parse(user_agent_str)
            profile.os = f"{user_agent.os.family} {user_agent.os.version_string}".strip()
            profile.browser = f"{user_agent.browser.family} {user_agent.browser.version_string}".strip()
        
        # 3. GeoLocation Tracking (Simple API)
        if ip and ip not in ('127.0.0.1', 'localhost'):
            try:
                res = requests.get(f'http://ip-api.com/json/{ip}', timeout=3).json()
                if res.get('status') == 'success':
                    profile.city = res.get('city', '')
                    profile.country = res.get('country', '')
                    profile.isp = res.get('isp', '')
                    profile.timezone = res.get('timezone', '')
                    profile.latitude = res.get('lat')
                    profile.longitude = res.get('lon')
                    profile.zip_code = res.get('zip', '')
            except Exception:
                pass # Ignore API failures so login isn't blocked
                
        profile.save()
    except Exception:
        pass # Never block login

