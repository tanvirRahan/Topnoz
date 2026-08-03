<div align="center">
  <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/REST_API-0052CC?style=for-the-badge&logo=openapi-initiative&logoColor=white" alt="REST API" />
  <img src="https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logo=groq&logoColor=white" alt="Groq AI" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google OAuth" />
  <img src="https://img.shields.io/badge/Gunicorn-499848?style=for-the-badge&logo=gunicorn&logoColor=white" alt="Gunicorn" />
</div>

<h1 align="center">TOPNOZ</h1>

<p align="center">
  <strong>An Enterprise-Grade, AI-Powered E-Commerce & Lifestyle Platform</strong>
</p>

<p align="center">
  Topnoz is a highly scalable, production-ready e-commerce solution architected for modern retail. It seamlessly integrates a robust transactional core with state-of-the-art conversational AI, delivering an unparalleled shopping experience through intelligent product discovery, multilingual support, and dynamic media management.
</p>

---

## 🚀 Architecture & Tech Stack

Engineered for high availability and performance in real-world production environments, Topnoz utilizes a modern, robust technology stack.

### Backend Core
* **Framework:** Django 4.2 & Django REST Framework (DRF)
* **Database:** PostgreSQL (Production) / SQLite (Development)
* **Server & WSGI:** Gunicorn configured for highly concurrent production workloads
* **Static File Management:** WhiteNoise for optimized, self-contained static asset serving
* **Environment Management:** `python-dotenv` & `dj-database-url` for secure, 12-factor app configuration

### Artificial Intelligence & Data
* **AI Engine:** Groq API (High-performance LLM inference)
* **Conversational Agent:** Custom-built **"TARS'BOT"** with context-aware memory and semantic understanding
* **Multilingual NLP:** Native support for Bangla, Banglish, and English queries

### Infrastructure & Integrations
* **Media Storage:** Cloudinary (Edge-cached CDN for seamless image delivery)
* **Authentication:** Google OAuth 2.0 via `django-allauth` (JWT backed)
* **Security:** CSRF/XSS protection, rate limiting, and strict CORS policies

---

## 🧠 TARS'BOT: The AI Shopping Assistant

At the heart of Topnoz lies **TARS'BOT**, a sophisticated AI assistant designed to bridge the gap between physical retail assistance and digital convenience.

* **Live Product Awareness:** Has real-time access to the store's inventory, pricing, and product attributes.
* **Contextual Memory:** Retains conversation history to provide personalized recommendations and maintain conversational context.
* **Multilingual Capability:** Flawlessly understands and responds to diverse linguistic inputs (Bangla, Banglish, English), catering specifically to the South Asian demographic.

---

## 🛒 Core Platform Features

* **Comprehensive E-Commerce Flow:** End-to-end user journey from catalog browsing, category filtering, and product details to cart management and secure checkout.
* **Intelligent Search:** Intent-aware search algorithms that understand user queries beyond exact keyword matches.
* **Frictionless Onboarding:** One-click registration and login via Google OAuth.
* **Cloud-Native Media:** Fully decoupled media storage ensuring fast page loads and zero server bloat.
* **Responsive Frontend:** Clean, accessible, and performant HTML5/CSS3/JS UI designed for cross-device compatibility.
* **Scalable REST API:** Headless-ready backend exposing secure endpoints for potential mobile app integrations.

---

## ⚙️ Local Development Setup

To run this enterprise application locally, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/tanvirRahan/Topnoz.git
cd Topnoz
```

### 2. Environment Configuration
Create a virtual environment to isolate dependencies:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

### 3. Install Dependencies
Install the required packages, including development headers for C-extensions:
```bash
# Ubuntu/Debian users may need to install headers: sudo apt-get install zlib1g-dev libffi-dev libjpeg-dev python3-dev
pip install -r requirements.txt
```

### 4. Environment Variables
Duplicate the example environment file and inject your secure credentials:
```bash
cp .env.example .env
```
Ensure the following variables are correctly configured in your `.env` file:
* `DJANGO_SECRET_KEY`, `DEBUG`, `DATABASE_URL`
* `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
* `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
* `GROQ_API_KEY`

### 5. Database Migration & Execution
Run the migrations and initialize the development server:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

## 📈 Production Deployment

Topnoz was built with production deployment in mind. The system utilizes **Gunicorn** to handle WSGI requests and **WhiteNoise** to serve static files directly from the application layer without requiring a separate Nginx/Apache configuration for static assets.

Ensure `DEBUG=False` in your production environment and configure the `DATABASE_URL` to point to a managed PostgreSQL instance.

---

## 🔮 Roadmap

- [ ] **Payment Gateway Integration:** Direct integration with Stripe and SSLCommerz for regional processing.
- [ ] **Advanced Analytics Dashboard:** Real-time metrics for inventory, user engagement, and sales.
- [ ] **Vector Search:** Upgrading standard search to full semantic vector search using Pgvector.
- [ ] **Logistics Integration:** Automated order tracking and notification pipelines.

---

<div align="center">
  <p>Built for performance, scalability, and an intelligent user experience.</p>
</div>