"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.config import settings
from app.database import async_session_maker, close_db
from app.routes.auth import router as auth_router
from app.routes.recipes import router as recipes_router

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan events for startup and shutdown."""
    # Startup
    logger.info("Starting DishDash API...")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Debug mode: {settings.debug}")
    yield
    # Shutdown
    logger.info("Shutting down DishDash API...")
    await close_db()


# Create FastAPI application
app = FastAPI(
    title="DishDash API",
    description="Recipe and Meal Planning API for managing recipes, meal plans, and shopping lists.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get(
    "/health",
    tags=["Health"],
    summary="Health check",
    description="Check if the API and database are healthy.",
)
async def health_check() -> dict:
    """
    Health check endpoint.

    Returns the health status of the API and database connection.
    """
    health_status = {
        "status": "healthy",
        "environment": settings.environment,
        "database": "unknown",
    }

    # Check database connection
    try:
        async with async_session_maker() as session:
            await session.execute(text("SELECT 1"))
            health_status["database"] = "connected"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        health_status["status"] = "unhealthy"
        health_status["database"] = "disconnected"
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content=health_status,
        )

    return health_status


# Root endpoint
@app.get(
    "/",
    tags=["Root"],
    summary="API Root",
    description="Welcome endpoint for the DishDash API.",
)
async def root() -> dict:
    """Root endpoint with API information."""
    return {
        "name": "DishDash API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


# Include routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(recipes_router, prefix="/api/v1")


# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unhandled errors."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )
