# settings.py

import os
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# PyMySQL → MySQLdb হিসেবে
# ─────────────────────────────────────────────────────────────────────────────
import pymysql
pymysql.install_as_MySQLdb()

# ─────────────────────────────────────────────────────────────────────────────
# BASE SETUP
# ─────────────────────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-2!(x(n4gdq7l=&ib+)(khyxt^mpl_q)=88k-l0b*_&=8jp2wic'

DEBUG = True

ALLOWED_HOSTS = [
    'topnoz.com',
    'www.topnoz.com',
    'topnoz.up.railway.app',
    'localhost',
]

CSRF_TRUSTED_ORIGINS = [
    'https://topnoz.com',
    'https://www.topnoz.com',
    'https://topnoz.up.railway.app',
]

# ─────────────────────────────────────────────────────────────────────────────
# APPLICATIONS + MIDDLEWARE
# ─────────────────────────────────────────────────────────────────────────────

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'pet.apps.PetConfig',
    'imagekitio',  # ImageKit support
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'petCommerce.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [ BASE_DIR / 'templates' ],
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

WSGI_APPLICATION = 'petCommerce.wsgi.application'

# ─────────────────────────────────────────────────────────────────────────────
# DATABASE CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

DATABASES = {
    'default': {
        'ENGINE':   'django.db.backends.mysql',
        'NAME':     'railway',
        'USER':     'root',
        'PASSWORD': 'YVqokVfyhCXHegZFQvHQhodSCuTzOdKP',
        'HOST':     'mysql.railway.internal',
        'PORT':     '3306',
    }
}

# ─────────────────────────────────────────────────────────────────────────────
# AUTH VALIDATION
# ─────────────────────────────────────────────────────────────────────────────

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ─────────────────────────────────────────────────────────────────────────────
# INTERNATIONALIZATION
# ─────────────────────────────────────────────────────────────────────────────

LANGUAGE_CODE = 'en-us'
TIME_ZONE     = 'UTC'
USE_I18N      = True
USE_L10N      = True
USE_TZ        = True

# ─────────────────────────────────────────────────────────────────────────────
# STATIC FILES (CSS, JS, FONTS)
# ─────────────────────────────────────────────────────────────────────────────

STATIC_URL = '/static/'
STATICFILES_DIRS = [ BASE_DIR / 'static' ]
STATIC_ROOT = BASE_DIR / 'staticfiles'

STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

# ─────────────────────────────────────────────────────────────────────────────
# MEDIA FILES → ImageKit storage
# ─────────────────────────────────────────────────────────────────────────────

DEFAULT_FILE_STORAGE = 'imagekitio.storage.MediaStorage'

IMAGEKIT_PUBLIC_KEY = 'public_MmjnFNwIA8d4vKasWqzv/KKG8ys='
IMAGEKIT_PRIVATE_KEY = 'private_zuvJq3PNEqxtbXNrmzrMnMX1Gn8='
IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/rifat'

# ─────────────────────────────────────────────────────────────────────────────
# EMAIL (optional)
# ─────────────────────────────────────────────────────────────────────────────

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST    = 'smtp.gmail.com'
EMAIL_PORT    = 587
EMAIL_HOST_USER     = ''
EMAIL_HOST_PASSWORD = ''
EMAIL_USE_TLS       = True

# ─────────────────────────────────────────────────────────────────────────────
# DEFAULT PK FIELD TYPE
# ─────────────────────────────────────────────────────────────────────────────

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
