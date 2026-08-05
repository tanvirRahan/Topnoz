<div align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django" />
  <img src="https://img.shields.io/badge/Django_Ninja-059669?style=for-the-badge&logo=fastapi&logoColor=white" alt="Django Ninja" />
  <img src="https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logo=groq&logoColor=white" alt="Groq AI" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google OAuth" />
</div>

<h1 align="center">TOPNOZ</h1>

<p align="center">
  <strong>An Enterprise-Grade, AI-Powered Headless E-Commerce Platform</strong>
</p>

<p align="center">
  Topnoz is a highly scalable, production-ready headless e-commerce solution architected for modern retail. It seamlessly integrates a blazing-fast <strong>Next.js App Router</strong> frontend with a high-performance <strong>Django Ninja (API-first)</strong> backend. Enhanced with state-of-the-art conversational AI, Topnoz delivers an unparalleled shopping experience through intelligent product discovery, real-time analytics, and dynamic media management.
</p>

<hr />

## 🚀 Key Features

* **Headless Architecture:** Complete separation of concerns. A modern, SEO-optimized **Next.js 16+** frontend consumes lightning-fast RESTful APIs powered by **Django Ninja**.
* **AI-Powered Shopping Assistant:** Integrated **Groq LLM / AI Core** that acts as a virtual conversational assistant. It understands user intent, answers product queries, and recommends items in real-time.
* **Frictionless Authentication:** Secure authentication leveraging **JWT (JSON Web Tokens)** alongside **Google OAuth2** for one-tap logins.
* **Advanced Analytics & Tracking:** Built-in visitor tracking system that records IP, Device OS, Browser, UTM tags, and geographical location to drive marketing decisions.
* **Robust Media Management:** Integrated with **Cloudinary** for dynamic, optimized product image delivery and CDN caching.
* **Modern E-Commerce Core:** Fully functional cart, variable products (size/color), dynamic pricing, discounts, and order management.

---

## 🛠️ The Technology Stack

### Frontend (Client-Side)
* **Framework:** Next.js 16+ (App Router)
* **Language:** TypeScript & React 19
* **Styling:** Vanilla CSS (Modern CSS variables, flex/grid layouts)
* **State & Data Fetching:** React Server Components (RSC) + Native Fetch API with caching/revalidation

### Backend (Server-Side)
* **Core Framework:** Django 5+
* **API Layer:** Django Ninja (FastAPI-like, Pydantic schema validation, async support)
* **Database:** SQLite (Dev) / PostgreSQL (Prod)
* **Authentication:** Django Allauth + Ninja JWT

### AI & Integrations
* **LLM Engine:** Groq API for ultra-fast, low-latency AI responses
* **Media Storage:** Cloudinary CDN

---

## 🏗️ System Architecture & Flow

The system is designed with a strict **API-only backend** approach:

1. **The Client Request:** A user interacts with the Next.js frontend (e.g., browsing new arrivals).
2. **Next.js Data Fetching:** The Next.js server makes a high-speed HTTP GET request to `http://api.topnoz.com/api/store/products?sort=new`.
3. **Django Ninja Routing:** The request hits `config/urls.py` in Django, routes to `config/api.py`, and is delegated to the specific module (`apps/store/api.py`).
4. **Data Serialization:** Django queries the database, serializes the complex relational data using **Pydantic Schemas**, and returns a clean JSON response.
5. **UI Rendering:** Next.js receives the JSON, renders the UI on the server (SSR), and streams the HTML to the user instantly.

---

## 💻 Local Development Setup

To get Topnoz running on your local machine, you will need to start both the Django backend and the Next.js frontend servers.

### 1. Backend Setup (Django)

```bash
# Clone the repository
git clone https://github.com/your-username/topnoz.git
cd topnoz

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install backend dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your Database, Cloudinary, and Groq API credentials

# Run database migrations
python manage.py migrate

# Start the Django Ninja API server
python manage.py runserver
```
*(The API will be available at `http://localhost:8000/api/`)*

### 2. Frontend Setup (Next.js)

```bash
# Open a new terminal tab
cd topnoz/frontend

# Install frontend dependencies
npm install

# Start the Next.js development server
npm run dev
```
*(The Frontend will be available at `http://localhost:3000/`)*

---

## 🔒 Security & Best Practices
* **Zero Django Templates:** We've stripped out all legacy Django HTML templates. The backend acts strictly as a data provider, drastically reducing the attack surface.
* **Strict CORS & CSRF:** Configured to only accept requests from trusted frontend origins.
* **Pydantic Validation:** All incoming payloads to the Django Ninja API are strictly validated and sanitized.

<p align="center">
  <i>Engineered for Performance. Designed for Scale.</i>
</p>