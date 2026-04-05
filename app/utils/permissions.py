from fastapi import HTTPException, status

from app.models.user import User
from app.utils.enums import UserRole


def ensure_roles(user: User, allowed_roles: set[UserRole]) -> None:
    if user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource",
        )
