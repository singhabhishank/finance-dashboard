from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user, require_roles
from app.models.user import User
from app.schemas.common import ErrorResponse
from app.schemas.user import PaginatedUserResponse, UserCreate, UserResponse, UserUpdateRoleStatus
from app.services.user_service import (
    create_user,
    get_user_by_email,
    list_users_paginated,
    update_user_role_status,
)
from app.utils.enums import SortOrder, UserRole, UserSortField, UserStatus

router = APIRouter(prefix="/users", tags=["Users"])


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a user",
    description="Create a new user account. Admin only.",
    responses={
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        403: {"model": ErrorResponse, "description": "Forbidden"},
        409: {"model": ErrorResponse, "description": "Email already exists"},
    },
)
def create_new_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.admin)),
) -> UserResponse:
    if get_user_by_email(db, payload.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
    try:
        return create_user(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user",
    description="Get the currently authenticated user's information.",
    responses={
        401: {"model": ErrorResponse, "description": "Unauthorized"},
    },
)
def get_current_user_info(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """Get the currently authenticated user's information."""
    return UserResponse.model_validate(current_user)


@router.get(
    "",
    response_model=PaginatedUserResponse,
    summary="List users",
    description="List users with pagination, search, role, and status filters. Admin only.",
    responses={
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        403: {"model": ErrorResponse, "description": "Forbidden"},
    },
)
def get_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = Query(None, min_length=1, max_length=255),
    role: UserRole | None = Query(None),
    status: UserStatus | None = Query(None),
    sort_by: UserSortField = Query(UserSortField.created_at),
    sort_order: SortOrder = Query(SortOrder.desc),
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.admin)),
) -> PaginatedUserResponse:
    users, total = list_users_paginated(
        db=db,
        page=page,
        page_size=page_size,
        search=search,
        role=role,
        status=status,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return PaginatedUserResponse(
        items=[UserResponse.model_validate(user) for user in users],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.patch(
    "/{user_id}",
    response_model=UserResponse,
    summary="Update user role or status",
    description="Update a user's role and/or status. Admin only.",
    responses={
        400: {"model": ErrorResponse, "description": "Invalid request"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        403: {"model": ErrorResponse, "description": "Forbidden"},
        404: {"model": ErrorResponse, "description": "User not found"},
    },
)
def update_user(
    user_id: int,
    payload: UserUpdateRoleStatus,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_roles(UserRole.admin)),
) -> UserResponse:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Avoid accidental admin lockout when editing own account.
    if current_admin.id == user.id:
        if payload.status is not None and payload.status.value == "inactive":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Admin cannot deactivate own account")
        if payload.role is not None and payload.role != UserRole.admin:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Admin cannot change own role")

    return update_user_role_status(db, user, payload)
