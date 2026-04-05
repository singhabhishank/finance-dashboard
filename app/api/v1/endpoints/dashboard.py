from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_roles
from app.models.user import User
from app.schemas.common import ErrorResponse
from app.schemas.dashboard import DashboardSummaryResponse
from app.services.dashboard_service import build_dashboard_summary
from app.utils.enums import UserRole

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
    summary="Get dashboard summary",
    description="Return aggregate income, expense, balance, category breakdown, and monthly summary.",
    responses={
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        403: {"model": ErrorResponse, "description": "Forbidden"},
    },
)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.admin, UserRole.analyst, UserRole.viewer)),
) -> DashboardSummaryResponse:
    return build_dashboard_summary(db)
