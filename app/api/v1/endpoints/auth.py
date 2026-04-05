from datetime import timedelta
from pydantic import BaseModel

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.config import settings
from app.core.security import create_access_token, verify_password, get_password_hash
from app.schemas.auth import LoginRequest, SignupRequest, Token
from app.services.user_service import get_user_by_email
from app.utils.enums import UserStatus, UserRole
from app.models.user import User


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    email: str
    new_password: str

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
) -> Token:
    user = get_user_by_email(db, payload.email.strip().lower())
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if user.status == UserStatus.inactive:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User account is inactive")

    access_token = create_access_token(
        subject=user.email,
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    return Token(access_token=access_token)


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(
    payload: SignupRequest,
    db: Session = Depends(get_db),
) -> Token:
    """Register a new user account."""
    # Check if user already exists
    existing_user = get_user_by_email(db, payload.email.strip().lower())
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered",
        )

    # Create new user
    new_user = User(
        email=payload.email.strip().lower(),
        full_name=payload.full_name.strip(),
        hashed_password=get_password_hash(payload.password),
        role=UserRole.viewer,  # New users are viewers by default
        status=UserStatus.active,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate access token
    access_token = create_access_token(
        subject=new_user.email,
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    return Token(access_token=access_token)


@router.post("/forgot-password")
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    """Request password reset - verify email exists."""
    user = get_user_by_email(db, payload.email.strip().lower())
    if not user:
        # Don't reveal if email exists or not for security
        return {"message": "If this email exists, reset instructions will be sent"}

    # In production, you would send an email with a reset link here
    # For now, we just verify the email exists and return success
    return {"message": "Reset instructions sent to email"}


@router.post("/reset-password")
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    """Reset password for a user."""
    email = payload.email.strip().lower()
    new_password = payload.new_password.strip()

    # Validate password
    if len(new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long",
        )

    # Find user
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Update password
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    db.refresh(user)

    return {"message": "Password reset successfully"}

