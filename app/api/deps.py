from collections.abc import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import decode_access_token
from app.db.session import SessionLocal
from app.models.user import User
from app.utils.enums import UserRole, UserStatus
from app.utils.permissions import ensure_roles

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.api_v1_prefix}/auth/login")


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        subject = payload.get("sub")
        if not subject:
            raise credentials_error
    except ValueError as exc:
        raise credentials_error from exc

    user = db.scalar(select(User).where(User.email == subject))
    if not user:
        raise credentials_error
    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.status == UserStatus.inactive:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive users cannot access this resource")
    return current_user


def require_roles(*roles: UserRole):
    def role_dependency(current_user: User = Depends(get_current_active_user)) -> User:
        ensure_roles(current_user, set(roles))
        return current_user

    return role_dependency
