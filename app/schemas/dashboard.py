from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class CategoryBreakdownItem(BaseModel):
    category: str
    total: Decimal


class MonthlySummaryItem(BaseModel):
    month: str
    income: Decimal
    expense: Decimal
    balance: Decimal


class RecentTransactionItem(BaseModel):
    id: int
    amount: Decimal
    type: str
    category: str
    date: str
    notes: str | None = None


class DashboardSummaryResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "total_income": "5000.00",
                "total_expense": "1650.00",
                "balance": "3350.00",
                "category_breakdown": [
                    {"category": "Salary", "total": "5000.00"},
                    {"category": "Rent", "total": "1200.00"},
                ],
                "monthly_data": [
                    {
                        "month": "2026-01",
                        "income": "5000.00",
                        "expense": "1500.00",
                        "balance": "3500.00",
                    }
                ],
                "recent_transactions": [
                    {
                        "id": 1,
                        "amount": "5000.00",
                        "type": "income",
                        "category": "Salary",
                        "date": "2026-01-05",
                        "notes": "January salary",
                    }
                ],
            }
        }
    )

    total_income: Decimal
    total_expense: Decimal
    balance: Decimal
    category_breakdown: list[CategoryBreakdownItem]
    monthly_data: list[MonthlySummaryItem]
    recent_transactions: list[RecentTransactionItem]
