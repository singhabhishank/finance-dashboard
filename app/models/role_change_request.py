from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.utils.enums import UserRole

if TYPE_CHECKING:
    from app.models.user import User


class RoleChangeRequest(Base):
    __tablename__ = "role_change_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    requested_role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role"), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")  # pending, approved, rejected
    reason: Mapped[str] = mapped_column(String(500), nullable=True)
    admin_notes: Mapped[str] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    reviewed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    reviewed_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    reviewed_by: Mapped["User"] = relationship("User", foreign_keys=[reviewed_by_id])
