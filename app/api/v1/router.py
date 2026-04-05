from fastapi import APIRouter

from app.api.v1.endpoints import auth, dashboard, financial_records, role_requests, users

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(financial_records.router)
api_router.include_router(dashboard.router)
api_router.include_router(role_requests.router)
