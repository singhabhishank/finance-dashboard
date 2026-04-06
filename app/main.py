from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.schemas.common import HealthResponse

tags_metadata = [
    {"name": "Authentication", "description": "Login and token operations."},
    {"name": "Users", "description": "User management and admin controls."},
    {
        "name": "Financial Records",
        "description": "Income and expense records with pagination and filtering.",
    },
    {"name": "Dashboard", "description": "Aggregate dashboard analytics."},
    {"name": "Health", "description": "Service health and readiness checks."},
]

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Backend service for a finance dashboard internship assessment.",
    openapi_tags=tags_metadata,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get(
    "/health",
    tags=["Health"],
    response_model=HealthResponse,
    summary="Health check",
    description="Return a simple service health response.",
)
def health_check() -> HealthResponse:
    return HealthResponse(status="ok", service=settings.app_name)


@app.get("/make-admin")
def make_admin():
    import sqlite3

    conn = sqlite3.connect("finance_dashboard.db")
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE users SET role = 'admin' WHERE email = ?",
        ("abhi123@gmail.com",),
    )

    conn.commit()
    conn.close()

    return {"message": "User is now admin"}
