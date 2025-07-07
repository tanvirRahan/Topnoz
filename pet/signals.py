from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.core.mail import send_mail

@receiver(user_logged_in)
def send_login_email(sender, user, request, **kwargs):
    # User ke email
    send_mail(
        'Login Successful',
        'Style inspiration unlocked.!',
        'topnozweb@gmail.com',
        [user.email],
        fail_silently=False,
    )
    # Admin ke email
    send_mail(
        'User Login Notification',
        f'User {user.username} ({user.email}) just logged in to the website.',
        'topnozweb@gmail.com',
        ['topnozweb@gmail.com'],
        fail_silently=False,
    )