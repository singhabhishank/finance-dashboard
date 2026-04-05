import datetime as dt
from decimal import Decimal
import re

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.common import PaginatedResponse
from app.utils.enums import RecordType

CATEGORY_PATTERN = re.compile(r"^[A-Za-z][A-Za-z0-9 _-]{1,49}$")


class FinancialRecordBase(BaseModel):
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    type: RecordType
    category: str = Field(min_length=2, max_length=50)
    date: dt.date
    notes: str | None = Field(default=None, max_length=1000)

    @field_validator("category")
    @classmethod
    def validate_category(cls, value: str) -> str:
        cleaned = value.strip()
        if not CATEGORY_PATTERN.match(cleaned):
            raise ValueError(
                "category must start with a letter and contain only letters, numbers, spaces, _ or -"
            )
        return cleaned


class FinancialRecordCreate(FinancialRecordBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "amount": 1200.5,
                "type": "expense",
                "category": "Rent",
                "date": "2026-04-01",
                "notes": "Monthly apartment rent",
            }
        }
    )


class FinancialRecordUpdate(BaseModel):
    amount: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2)
    type: RecordType | None = None
    category: str | None = Field(default=None, min_length=2, max_length=50)
    date: dt.date | None = None
    notes: str | None = Field(default=None, max_length=1000)

    @field_validator("category")
    @classmethod
    def validate_category(cls, value: str | None) -> str | None:
        if value is None:
            return value
        cleaned = value.strip()
        if not CATEGORY_PATTERN.match(cleaned):
            raise ValueError(
                "category must start with a letter and contain only letters, numbers, spaces, _ or -"
            )
        return cleaned


class FinancialRecordResponse(FinancialRecordBase):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "amount": "1200.50",
                "type": "expense",
                "category": "Rent",
                "date": "2026-04-01",
                "notes": "Monthly apartment rent",
                "created_by": 1,
                "created_at": "2026-04-03T00:00:00Z",
                "updated_at": "2026-04-03T00:00:00Z",
            }
        },
    )

    id: int
    created_by: int
    created_at: dt.datetime
    updated_at: dt.datetime


class PaginatedFinancialRecordResponse(PaginatedResponse):
    items: list[FinancialRecordResponse]
