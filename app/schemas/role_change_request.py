from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.utils.enums import UserRole


class RoleChangeRequestCreate(BaseModel):
    requested_role: UserRole = Field(..., description="Role being requested")
    reason: Optional[str] = Field(None, description="Reason for requesting this role")


class RoleChangeRequestResponse(BaseModel):
    id: int
    user_id: int
    requested_role: UserRole
    status: str  # pending, approved, rejected
    reason: Optional[str] = None
    admin_notes: Optional[str] = None
    created_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewed_by_id: Optional[int] = None

    class Config:
        from_attributes = True


class RoleChangeRequestApprove(BaseModel):
    approved: bool = Field(..., description="Whether to approve the request")
    admin_notes: Optional[str] = Field(None, description="Notes from admin")


class PendingRoleRequestsResponse(BaseModel):
    user_id: int
    user_email: str
    user_full_name: str
    current_role: UserRole
    requested_role: UserRole
    reason: Optional[str] = None
    created_at: datetime
    request_id: int
