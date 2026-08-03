import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

# Load .env if it exists
load_dotenv()

# ---------------------------------------------------------------------------
# Base settings
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'dev-secret-key-use-only-locally')

# Dynamic DEBUG (True locally, False in production if set in env)
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")

# Dynamic CSRF testing for production and local
CSRF_TRUSTED_ORIGINS = os.environ.get(
    "CSRF_TRUSTED_ORIGINS",
    "http://127.0.0.1:8000,http://localhost:8000,https://127.0.0.1:8000,https://localhost:8000"
).split(",")

# ---------------------------------------------------------------------------
# Installed apps
# ---------------------------------------------------------------------------
INSTALLED_APPS = [
    # Default Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Developer extras (better runserver, console tools)
    'django_extensions',
    
    # Third-party apps for our project
    'rest_framework',                   # <-- ADDED: For creating APIs

    # allauth for login/registration
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',

    # Cloudinary (optional for media)
    'cloudinary',
    'cloudinary_storage',

    # Your project app(s)
    'pet.apps.PetConfig',
    'chat',                             # <-- ADDED: Our new chatbot app
]

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    # Needed for django-allauth sessions
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'petCommerce.urls' # আপনার প্রজেক্টের নাম petCommerce হলে এটি ঠিক আছে

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

WSGI_APPLICATION = 'petCommerce.wsgi.application' # আপনার প্রজেক্টের নাম petCommerce হলে এটি ঠিক আছে

# ---------------------------------------------------------------------------
# Database (PostgreSQL for Production, SQLite for Local)
# ---------------------------------------------------------------------------
DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600
    )
}

# ---------------------------------------------------------------------------
# Authentication / allauth
# ---------------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = []  # relaxed for local testing

LOGIN_URL = '/userLogin/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',   # Django default
    'allauth.account.auth_backends.AuthenticationBackend',  # Allauth
)

# Sites framework ID (must match your django_site table entry)
SITE_ID = 1  # Make sure admin -> Sites -> id=1 domain = 127.0.0.1:8000

# Skips the intermediate "Sign In Via..." confirmation page
# and directly redirects to the provider's login page (e.g., Google).
SOCIALACCOUNT_LOGIN_ON_GET = True


# ---------------------------------------------------------------------------
# Internationalization
# ---------------------------------------------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------------------------
# Static & Media
# ---------------------------------------------------------------------------
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / "media"

# ---------------------------------------------------------------------------
# Cloudinary Configuration (For Production Media Storage)
# ---------------------------------------------------------------------------
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.environ.get('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.environ.get('CLOUDINARY_API_KEY'),
    'API_SECRET': os.environ.get('CLOUDINARY_API_SECRET'),
}

# Use Cloudinary for media uploads only in production (when DEBUG is False)
if os.environ.get('CLOUDINARY_CLOUD_NAME') and not DEBUG:
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# ---------------------------------------------------------------------------
# Email (local dev: print emails to console instead of sending)
# ---------------------------------------------------------------------------
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'webmaster@localhost'

# ---------------------------------------------------------------------------
# Security and SSL Configuration (Enforced in Production)
# ---------------------------------------------------------------------------
SECURE_SSL_REDIRECT = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'