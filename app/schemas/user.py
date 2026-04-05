from datetime import datetime
import re

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.schemas.common import PaginatedResponse
from app.utils.enums import UserRole, UserStatus

PASSWORD_PATTERN = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$")


class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=255)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: EmailStr) -> EmailStr:
        return str(value).strip().lower()

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise ValueError("full_name must contain at least 2 characters")
        return cleaned


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)
    role: UserRole = UserRole.viewer
    status: UserStatus = UserStatus.active

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "new.user@example.com",
                "full_name": "New User",
                "password": "StrongPass1!",
                "role": "viewer",
                "status": "active",
            }
        }
    )

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not PASSWORD_PATTERN.match(value):
            raise ValueError("password must include uppercase, lowercase, number, and symbol")
        return value


class UserUpdateRoleStatus(BaseModel):
    role: UserRole | None = None
    status: UserStatus | None = None


class UserResponse(UserBase):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "email": "admin@demo.com",
                "full_name": "Demo Admin",
                "role": "admin",
                "status": "active",
                "created_at": "2026-04-03T00:00:00Z",
                "updated_at": "2026-04-03T00:00:00Z",
            }
        },
    )

    id: int
    role: UserRole
    status: UserStatus
    created_at: datetime
    updated_at: datetime


class PaginatedUserResponse(PaginatedResponse):
    items: list[UserResponse]
