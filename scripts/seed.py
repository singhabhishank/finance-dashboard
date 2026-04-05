from datetime import date
from decimal import Decimal

from sqlalchemy import func, select

from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models.financial_record import FinancialRecord
from app.models.user import User
from app.utils.enums import RecordType, UserRole, UserStatus

DEMO_USERS = [
    {
        "email": "admin@demo.com",
        "full_name": "Demo Admin",
        "password": "Admin123",
        "role": UserRole.admin,
    },
    {
        "email": "analyst@demo.com",
        "full_name": "Demo Analyst",
        "password": "Analyst123",
        "role": UserRole.analyst,
    },
    {
        "email": "viewer@demo.com",
        "full_name": "Demo Viewer",
        "password": "Viewer123",
        "role": UserRole.viewer,
    },
]

SAMPLE_RECORDS = [
    {
        "amount": Decimal("5000.00"),
        "type": RecordType.income,
        "category": "Salary",
        "date": date(2026, 1, 5),
        "notes": "January salary",
    },
    {
        "amount": Decimal("1200.00"),
        "type": RecordType.expense,
        "category": "Rent",
        "date": date(2026, 1, 6),
        "notes": "Monthly rent",
    },
    {
        "amount": Decimal("300.00"),
        "type": RecordType.expense,
        "category": "Groceries",
        "date": date(2026, 1, 10),
        "notes": "Supermarket",
    },
    {
        "amount": Decimal("5200.00"),
        "type": RecordType.income,
        "category": "Salary",
        "date": date(2026, 2, 5),
        "notes": "February salary",
    },
    {
        "amount": Decimal("450.00"),
        "type": RecordType.expense,
        "category": "Utilities",
        "date": date(2026, 2, 12),
        "notes": "Electricity and internet",
    },
]


def seed_users() -> None:
    with SessionLocal() as db:
        for user_data in DEMO_USERS:
            existing = db.scalar(select(User).where(User.email == user_data["email"]))
            if existing:
                continue
            db.add(
                User(
                    email=user_data["email"],
                    full_name=user_data["full_name"],
                    hashed_password=get_password_hash(user_data["password"]),
                    role=user_data["role"],
                    status=UserStatus.active,
                )
            )
        db.commit()


def seed_records() -> None:
    with SessionLocal() as db:
        admin = db.scalar(select(User).where(User.email == "admin@demo.com"))
        if not admin:
            raise RuntimeError("Admin user not found. Run seed_users first.")

        existing_count = db.scalar(select(func.count(FinancialRecord.id)).select_from(FinancialRecord)) or 0
        if existing_count:
            return

        for row in SAMPLE_RECORDS:
            db.add(
                FinancialRecord(
                    amount=row["amount"],
                    type=row["type"],
                    category=row["category"],
                    date=row["date"],
                    notes=row["notes"],
                    created_by=admin.id,
                )
            )
        db.commit()


def main() -> None:
    seed_users()
    seed_records()
    print("Seed completed.")


if __name__ == "__main__":
    main()
