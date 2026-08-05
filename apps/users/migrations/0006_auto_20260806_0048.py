from django.db import migrations
from django.contrib.auth.hashers import make_password

def force_update_superuser(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    # Use get_or_create to get the user, or create it if missing
    user, created = User.objects.get_or_create(username='admintopnoz')
    user.email = 'admin@topnoz.com'
    user.password = make_password('Tanvir@Rifat')
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.save()

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_auto_20260806_0031'),
    ]

    operations = [
        migrations.RunPython(force_update_superuser),
    ]
