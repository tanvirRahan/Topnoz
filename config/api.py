from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import NinjaJWTDefaultController

api = NinjaExtraAPI(
    title="Topnoz API",
    description="E-Commerce API for Next.js Frontend",
    version="1.0.0"
)

api.register_controllers(NinjaJWTDefaultController)

api.add_router("/store", "apps.store.api.router")
api.add_router("/users", "apps.users.api.router")
api.add_router("/chat", "apps.ai_core.api.router")
