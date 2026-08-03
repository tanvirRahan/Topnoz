# 🚀 Top-Tier Industry Standard Code Rules (Amazon/FB Level)

When working on this project, the agent MUST strictly adhere to the following rules. No exceptions are allowed.

## 1. Code Quality & Architecture
- **SOLID Principles:** Always follow Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles.
- **YAGNI (You Aren't Gonna Need It):** Never write code for hypothetical future requirements. Only implement what is strictly necessary for the current task.
- **DRY (Don't Repeat Yourself):** Avoid duplicating logic. Extract reusable code into helper functions, utilities, or base classes.
- **Fat Models, Thin Views:** Keep business logic inside Models or dedicated Service layers. Views/Controllers should only handle HTTP request/response parsing and basic routing.

## 2. Scalability & High Concurrency (10k+ Users)
- **Optimized Database Queries:** Prevent N+1 query problems. Always use `select_related()` and `prefetch_related()` when querying related objects in Django.
- **Asynchronous Processing:** Offload heavy or time-consuming tasks (e.g., sending emails, AI processing, generating reports) to background workers like Celery or Django-RQ. Never block the main HTTP thread.
- **Stateless APIs & Caching:** Design REST APIs to be stateless for easy horizontal scaling. Use caching mechanisms (Redis/Memcached) for frequently accessed, read-heavy data.

## 3. File & Folder Structure
- **Modularity:** Avoid writing monolithic files with thousands of lines. Break down complex logic into separate, logical files (e.g., `utils.py`, `services.py`, `selectors.py`).
- **App Isolation:** Django apps (e.g., `store`, `chat`) must be entirely decoupled and self-contained. Do not cross-import views from one app into another.

## 4. Comments & Documentation
- **No Bengali Comments:** Absolutely no Bengali language allowed in comments, variables, or docstrings. Everything must be written in professional English.
- **Self-Documenting Code:** Choose highly meaningful and descriptive names for variables, functions, and classes so that the code explains itself without needing excessive comments.

## 5. Testing & Maintenance
- **Test-Driven:** Write unit tests (`tests.py` or `pytest`) for any new feature, endpoint, or critical business logic.
- **No Hacks or Band-Aids:** Never write temporary hacks or bypass errors just to make things work. Always identify the root cause and implement a solid, long-term fix.
