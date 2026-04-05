from datetime import date

from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session

from app.models.financial_record import FinancialRecord
from app.schemas.financial_record import FinancialRecordCreate, FinancialRecordUpdate
from app.utils.enums import RecordSortField, RecordType, SortOrder


def create_record(db: Session, payload: FinancialRecordCreate, created_by: int) -> FinancialRecord:
    record = FinancialRecord(
        amount=payload.amount,
        type=payload.type,
        category=payload.category,
        date=payload.date,
        notes=payload.notes,
        created_by=created_by,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_record(db: Session, record_id: int) -> FinancialRecord | None:
    return db.get(FinancialRecord, record_id)


def _apply_filters(
    query: Select[tuple[FinancialRecord]],
    record_type: RecordType | None,
    category: str | None,
    search: str | None,
    start_date: date | None,
    end_date: date | None,
    created_by: int | None = None,
    include_deleted: bool = False,
) -> Select[tuple[FinancialRecord]]:
    # Exclude soft deleted records by default
    if not include_deleted:
        query = query.where(FinancialRecord.is_deleted == False)
    
    if record_type:
        query = query.where(FinancialRecord.type == record_type)
    if category:
        query = query.where(FinancialRecord.category.ilike(f"%{category.strip()}%"))
    if search:
        query = query.where(FinancialRecord.notes.ilike(f"%{search.strip()}%"))
    if start_date:
        query = query.where(FinancialRecord.date >= start_date)
    if end_date:
        query = query.where(FinancialRecord.date <= end_date)
    if created_by is not None:
        query = query.where(FinancialRecord.created_by == created_by)
    return query


def list_records(
    db: Session,
    page: int,
    page_size: int,
    record_type: RecordType | None,
    category: str | None,
    search: str | None,
    start_date: date | None,
    end_date: date | None,
    sort_by: RecordSortField,
    sort_order: SortOrder,
    created_by: int | None = None,
) -> tuple[list[FinancialRecord], int]:
    base_query = _apply_filters(
        select(FinancialRecord), record_type, category, search, start_date, end_date, created_by
    )

    count_query = _apply_filters(
        select(func.count(FinancialRecord.id)).select_from(FinancialRecord),
        record_type,
        category,
        search,
        start_date,
        end_date,
        created_by,
    )
    total = db.scalar(count_query) or 0

    sort_columns = {
        RecordSortField.date: FinancialRecord.date,
        RecordSortField.amount: FinancialRecord.amount,
        RecordSortField.category: FinancialRecord.category,
        RecordSortField.created_at: FinancialRecord.created_at,
    }
    sort_column = sort_columns[sort_by]
    if sort_order == SortOrder.asc:
        ordering = (sort_column.asc(), FinancialRecord.id.asc())
    else:
        ordering = (sort_column.desc(), FinancialRecord.id.desc())

    offset = (page - 1) * page_size
    records = list(
        db.scalars(base_query.order_by(*ordering).offset(offset).limit(page_size)).all()
    )
    return records, total


def update_record(db: Session, record: FinancialRecord, payload: FinancialRecordUpdate) -> FinancialRecord:
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(record, field, value)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def delete_record(db: Session, record: FinancialRecord) -> None:
    """Soft delete a record by marking it as deleted"""
    record.is_deleted = True
    db.add(record)
    db.commit()


def undelete_record(db: Session, record: FinancialRecord) -> FinancialRecord:
    """Restore a soft-deleted record"""
    record.is_deleted = False
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
