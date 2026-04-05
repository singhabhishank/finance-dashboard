from decimal import Decimal

from sqlalchemy import case, cast, func, select
from sqlalchemy.dialects.postgresql import NUMERIC
from sqlalchemy.orm import Session

from app.models.financial_record import FinancialRecord
from app.db.session import engine
from app.schemas.dashboard import CategoryBreakdownItem, DashboardSummaryResponse, MonthlySummaryItem, RecentTransactionItem
from app.utils.enums import RecordType


def _to_decimal(value: Decimal | None) -> Decimal:
    return value if value is not None else Decimal("0")


def build_dashboard_summary(db: Session) -> DashboardSummaryResponse:
    month_expression = (
        func.strftime("%Y-%m", FinancialRecord.date)
        if engine.dialect.name == "sqlite"
        else func.to_char(FinancialRecord.date, "YYYY-MM")
    )

    income_query = select(func.coalesce(func.sum(FinancialRecord.amount), 0)).where(
        FinancialRecord.type == RecordType.income
    )
    expense_query = select(func.coalesce(func.sum(FinancialRecord.amount), 0)).where(
        FinancialRecord.type == RecordType.expense
    )

    total_income = _to_decimal(db.scalar(income_query))
    total_expense = _to_decimal(db.scalar(expense_query))
    balance = total_income - total_expense

    category_rows = db.execute(
        select(FinancialRecord.category, func.sum(FinancialRecord.amount))
        .group_by(FinancialRecord.category)
        .order_by(func.sum(FinancialRecord.amount).desc())
    ).all()
    category_breakdown = [
        CategoryBreakdownItem(category=row[0], total=_to_decimal(row[1])) for row in category_rows
    ]

    monthly_rows = db.execute(
        select(
            month_expression.label("month"),
            cast(
                func.coalesce(
                    func.sum(
                        case(
                            (FinancialRecord.type == RecordType.income, FinancialRecord.amount),
                            else_=0,
                        )
                    ),
                    0,
                ),
                NUMERIC(12, 2),
            ).label("income"),
            cast(
                func.coalesce(
                    func.sum(
                        case(
                            (FinancialRecord.type == RecordType.expense, FinancialRecord.amount),
                            else_=0,
                        )
                    ),
                    0,
                ),
                NUMERIC(12, 2),
            ).label("expense"),
        )
        .group_by("month")
        .order_by("month")
    ).all()

    monthly_data = [
        MonthlySummaryItem(
            month=row.month,
            income=_to_decimal(row.income),
            expense=_to_decimal(row.expense),
            balance=_to_decimal(row.income) - _to_decimal(row.expense),
        )
        for row in monthly_rows
    ]

    # Fetch recent transactions (last 10)
    recent_records = db.query(FinancialRecord).order_by(FinancialRecord.date.desc()).limit(10).all()
    recent_transactions = [
        RecentTransactionItem(
            id=record.id,
            amount=record.amount,
            type=record.type.value,
            category=record.category,
            date=record.date.isoformat(),
            notes=record.notes,
        )
        for record in recent_records
    ]

    return DashboardSummaryResponse(
        total_income=total_income,
        total_expense=total_expense,
        balance=balance,
        category_breakdown=category_breakdown,
        monthly_data=monthly_data,
        recent_transactions=recent_transactions,
    )
