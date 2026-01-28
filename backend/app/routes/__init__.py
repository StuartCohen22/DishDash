"""API route modules."""

from app.routes.auth import router as auth_router
from app.routes.recipes import router as recipes_router

__all__ = [
    "auth_router",
    "recipes_router",
]
