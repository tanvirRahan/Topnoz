# Topnoz
### Intelligent E-commerce & Lifestyle Platform

<p align="center">
  <img src="https://img.shields.io/badge/Django-4.2-092E20?style=flat-square&logo=django&logoColor=white"/>
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=flat-square&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white"/>
  <img src="https://img.shields.io/badge/Groq_API-FF6B35?style=flat-square"/>
  <img src="https://img.shields.io/badge/Google_OAuth-4285F4?style=flat-square&logo=google&logoColor=white"/>
  <img src="https://img.shields.io/badge/Deployed-Gunicorn-499848?style=flat-square"/>
</p>

<p align="center">
  <b>A production-ready, AI-powered fashion & lifestyle store built for Bangladesh.</b><br/>
  Smart multilingual chatbot · Google login · Cloud media · Full e-commerce flow
</p>

<br/>

---

## ✦ Features

| | Feature | Description |
|---|---|---|
| 🤖 | **TARS'BOT** | AI chatbot with Bangla, Banglish & English support — live product awareness + memory |
| 🔐 | **Google OAuth** | One-click sign in via Google (django-allauth) |
| ☁️ | **Cloud Media** | All images stored & served via Cloudinary |
| 🛒 | **E-commerce Core** | Browse → Category → Product → Cart → Checkout |
| 🔍 | **Smart Search** | Intent-aware custom search logic |
| 🌐 | **REST API** | Django REST Framework powered backend |
| 🚀 | **Production Ready** | Gunicorn + WhiteNoise + python-dotenv |
| 📱 | **Responsive UI** | Clean HTML5/CSS3/JS frontend |

---

## ✦ Tech Stack

```yaml
Backend:        Django 4.2 · Django REST Framework · django-allauth
Database:       PostgreSQL (psycopg2) · SQLite (dev)
Media Storage:  Cloudinary · django-cloudinary-storage
AI Engine:      Groq API (LLM)
Auth:           Google OAuth 2.0 (JWT · PyJWT)
Server:         Gunicorn · WhiteNoise
Config:         python-dotenv · dj-database-url
```

---

## ✦ Getting Started

```bash
# 1. Clone
git clone https://github.com/tanvirRahan/Topnoz.git
cd Topnoz

# 2. Virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Environment setup
cp .env.example .env
# → Fill in your keys (see below)

# 5. Migrate & run
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

## ✦ Environment Variables

```env
SECRET_KEY=your_django_secret_key
DEBUG=True

# Database
DATABASE_URL=your_postgres_url

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI
GROQ_API_KEY=your_groq_api_key
```

> ⚠️ Never commit `.env` — already in `.gitignore`

---

## ✦ Roadmap

- [ ] Payment gateway (SSLCommerz / Stripe)
- [ ] Semantic AI-powered search
- [ ] Admin analytics dashboard
- [ ] Order tracking & notifications

---

<p align="center">
  <img src="https://img.shields.io/badge/Built%20in%20Bangladesh-006A4E?style=for-the-badge&logo=google-maps&logoColor=white"/>
</p>