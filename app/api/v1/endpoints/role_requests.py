from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.role_change_request import RoleChangeRequest
from app.models.user import User
from app.schemas.role_change_request import (
    PendingRoleRequestsResponse,
    RoleChangeRequestApprove,
    RoleChangeRequestCreate,
    RoleChangeRequestResponse,
)
from app.utils.enums import UserRole, UserStatus

router = APIRouter(prefix="/role-requests", tags=["Role Management"])


@router.post("/request", response_model=RoleChangeRequestResponse, status_code=status.HTTP_201_CREATED)
def request_role_change(
    payload: RoleChangeRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Request a role change (promote from viewer to analyst, or analyst to admin)."""
    # Check if user is requesting the same role they already have
    if payload.requested_role == current_user.role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have this role",
        )

    # Only viewers can request analyst, only analysts can request admin
    if current_user.role == UserRole.viewer and payload.requested_role not in [UserRole.analyst]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Viewers can only request analyst role",
        )

    if current_user.role == UserRole.analyst and payload.requested_role not in [UserRole.admin]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Analysts can only request admin role",
        )

    # Check if there's already a pending request
    existing_request = db.query(RoleChangeRequest).filter(
        RoleChangeRequest.user_id == current_user.id,
        RoleChangeRequest.status == "pending",
    ).first()

    if existing_request:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a pending role change request. Please wait for admin response.",
        )

    # Create role change request
    role_request = RoleChangeRequest(
        user_id=current_user.id,
        requested_role=payload.requested_role,
        reason=payload.reason,
        status="pending",
    )
    db.add(role_request)
    db.commit()
    db.refresh(role_request)

    return role_request


@router.get("/pending", response_model=list[PendingRoleRequestsResponse])
def get_pending_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all pending role change requests (admin only)."""
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view pending requests",
        )

    pending = db.query(RoleChangeRequest).filter(
        RoleChangeRequest.status == "pending"
    ).all()

    # Format response with user details
    result = []
    for req in pending:
        user = db.query(User).filter(User.id == req.user_id).first()
        result.append(
            PendingRoleRequestsResponse(
                user_id=user.id,
                user_email=user.email,
                user_full_name=user.full_name,
                current_role=user.role,
                requested_role=req.requested_role,
                reason=req.reason,
                created_at=req.created_at,
                request_id=req.id,
            )
        )

    return result


@router.post("/approve/{request_id}", response_model=RoleChangeRequestResponse)
def approve_or_reject_request(
    request_id: int,
    payload: RoleChangeRequestApprove,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Approve or reject a role change request (admin only)."""
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can approve role requests",
        )

    # Get the request
    role_request = db.query(RoleChangeRequest).filter(
        RoleChangeRequest.id == request_id
    ).first()

    if not role_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found",
        )

    if role_request.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Request has already been {role_request.status}",
        )

    # Get the user
    user = db.query(User).filter(User.id == role_request.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Update the request
    role_request.status = "approved" if payload.approved else "rejected"
    role_request.admin_notes = payload.admin_notes
    role_request.reviewed_at = datetime.utcnow()
    role_request.reviewed_by_id = current_user.id

    # If approved, update user role
    if payload.approved:
        user.role = role_request.requested_role
        user.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(role_request)

    return role_request


@router.get("/my-requests", response_model=list[RoleChangeRequestResponse])
def get_my_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's role change requests."""
    requests = db.query(RoleChangeRequest).filter(
        RoleChangeRequest.user_id == current_user.id
    ).order_by(RoleChangeRequest.created_at.desc()).all()

    return requests
