from __future__ import annotations

import datetime as dt
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.utils.enums import RecordType

if TYPE_CHECKING:
    from app.models.user import User


class FinancialRecord(Base):
    __tablename__ = "financial_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    type: Mapped[RecordType] = mapped_column(Enum(RecordType, name="record_type"), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    date: Mapped[dt.date] = mapped_column(Date, nullable=False, index=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(default=False, index=True, nullable=False)
    created_by: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    created_at: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    creator: Mapped["User"] = relationship("User", back_populates="records", lazy="joined")
