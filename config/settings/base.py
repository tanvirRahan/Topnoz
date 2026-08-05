import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'dev-secret-key-use-only-locally')
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")

CSRF_TRUSTED_ORIGINS = os.environ.get(
    "CSRF_TRUSTED_ORIGINS",
    "http://127.0.0.1:8000,http://localhost:8000,https://127.0.0.1:8000,https://localhost:8000"
).split(",")

INSTALLED_APPS = [
    'unfold',
    'import_export',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'django_extensions',
    'rest_framework',
    
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'corsheaders',
    'ninja_extra',
    'ninja_jwt',
    'cloudinary',
    'cloudinary_storage',
    
    # Internal Apps
    'apps.store.apps.StoreConfig',
    'apps.ai_core.apps.AiCoreConfig',
    'apps.users.apps.UsersConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600
    )
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LOGIN_URL = '/userLogin/'
LOGIN_REDIRECT_URL = '/accounts/google/success/'
LOGOUT_REDIRECT_URL = '/'

AUTHENTICATION_BACKENDS = (
    'apps.users.backends.EmailOrUsernameModelBackend',
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

SITE_ID = 1
SOCIALACCOUNT_LOGIN_ON_GET = True

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Dhaka'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Email Setup for local testing (No Gmail/SMTP required)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Fix for allauth DoesNotExist error
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': 'dummy',
            'secret': 'dummy',
            'key': ''
        }
    }
}

from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _

UNFOLD = {
    'SITE_TITLE': 'Topnoz Admin',
    'SITE_HEADER': 'Topnoz Dashboard',
    'SIDEBAR': {
        'show_search': True,
        'show_all_applications': True,
        'navigation': [
            {
                'title': _('E-Commerce Store'),
                'separator': True,
                'items': [
                    {
                        'title': _('Products & Items'),
                        'icon': 'inventory_2',
                        'link': reverse_lazy('admin:store_item_changelist'),
                    },
                ],
            },
            {
                'title': _('Order Management'),
                'separator': True,
                'items': [
                    {
                        'title': _('Customer Orders'),
                        'icon': 'shopping_cart',
                        'link': reverse_lazy('admin:store_customerorder_changelist'),
                    },
                    {
                        'title': _('Order Items'),
                        'icon': 'receipt_long',
                        'link': reverse_lazy('admin:store_orderitem_changelist'),
                    },
                ],
            },
            {
                'title': _('Marketing & Users'),
                'separator': True,
                'items': [
                    {
                        'title': _('User Database'),
                        'icon': 'group',
                        'link': reverse_lazy('admin:auth_user_changelist'),
                    },
                    {
                        'title': _('User Profiles (IP & Geo)'),
                        'icon': 'badge',
                        'link': reverse_lazy('admin:users_userprofile_changelist'),
                    },
                    {
                        'title': _('Unauthenticated Users'),
                        'icon': 'public',
                        'link': reverse_lazy('admin:users_visitorlog_changelist'),
                    },
                ],
            },
            {
                'title': _('Global Settings'),
                'separator': True,
                'items': [
                    {
                        'title': _('Site Configuration'),
                        'icon': 'settings',
                        'link': reverse_lazy('admin:store_sitesettings_changelist'),
                    },
                ],
            },
        ],
    },
}

# CORS Config for Next.js
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "https://topnoz-lac.vercel.app",
]

# Allow all origins if specified in env
if os.environ.get("CORS_ALLOW_ALL_ORIGINS") == "True":
    CORS_ALLOW_ALL_ORIGINS = True

