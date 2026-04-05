from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_roles
from app.models.user import User
from app.schemas.common import ErrorResponse
from app.schemas.financial_record import (
    PaginatedFinancialRecordResponse,
    FinancialRecordCreate,
    FinancialRecordResponse,
    FinancialRecordUpdate,
)
from app.services.financial_record_service import (
    create_record,
    delete_record,
    get_record,
    list_records,
    update_record,
    undelete_record,
)
from app.utils.enums import RecordSortField, RecordType, SortOrder, UserRole

router = APIRouter(prefix="/records", tags=["Financial Records"])


@router.post(
    "",
    response_model=FinancialRecordResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a financial record",
    description="Create a financial income or expense record. Admin only.",
    responses={
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        403: {"model": ErrorResponse, "description": "Forbidden"},
    },
)
def create_financial_record(
    payload: FinancialRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.admin)),
) -> FinancialRecordResponse:
    return create_record(db, payload, current_user.id)


@router.get(
    "",
    response_model=PaginatedFinancialRecordResponse,
    summary="List financial records",
    description="List financial records with pagination, type, category, date, and sort filters.",
    responses={
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        403: {"model": ErrorResponse, "description": "Forbidden"},
    },
)
def get_financial_records(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    record_type: RecordType | None = Query(None, alias="type"),
    category: str | None = Query(None),
    search: str | None = Query(None, description="Search in notes field"),
    start_date: date | None = Query(None),
    end_date: date | None = Query(None),
    sort_by: RecordSortField = Query(RecordSortField.date),
    sort_order: SortOrder = Query(SortOrder.desc),
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.admin, UserRole.analyst)),
) -> PaginatedFinancialRecordResponse:
    if start_date and end_date and start_date > end_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="start_date must be before end_date")

    records, total = list_records(
        db=db,
        page=page,
        page_size=page_size,
        record_type=record_type,
        category=category,
        search=search,
        start_date=start_date,
        end_date=end_date,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return PaginatedFinancialRecordResponse(
        items=[FinancialRecordResponse.model_validate(record) for record in records],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/{record_id}",
    response_model=FinancialRecordResponse,
    summary="Get a financial record",
    description="Retrieve a single financial record by ID. Admin and analyst access.",
    responses={
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        403: {"model": ErrorResponse, "description": "Forbidden"},
        404: {"model": ErrorResponse, "description": "Record not found"},
    },
)
def get_financial_record(
    record_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.admin, UserRole.analyst)),
) -> FinancialRecordResponse:
    record = get_record(db, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    return record


@router.put(
    "/{record_id}",
    response_model=FinancialRecordResponse,
    summary="Update a financial record",
    description="Update a financial record. Admin only.",
    responses={
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        403: {"model": ErrorResponse, "description": "Forbidden"},
        404: {"model": ErrorResponse, "description": "Record not found"},
    },
)
def update_financial_record(
    record_id: int,
    payload: FinancialRecordUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.admin)),
) -> FinancialRecordResponse:
    record = get_record(db, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    return update_record(db, record, payload)


@router.delete(
    "/{record_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a financial record",
    description="Delete a financial record. Admin only.",
    responses={
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        403: {"model": ErrorResponse, "description": "Forbidden"},
        404: {"model": ErrorResponse, "description": "Record not found"},
    },
)
def delete_financial_record(
    record_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.admin)),
) -> None:
    record = get_record(db, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    delete_record(db, record)


@router.post(
    "/{record_id}/undelete",
    response_model=FinancialRecordResponse,
    summary="Restore a deleted financial record",
    description="Restore a soft-deleted financial record. Admin only.",
    responses={
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        403: {"model": ErrorResponse, "description": "Forbidden"},
        404: {"model": ErrorResponse, "description": "Record not found"},
    },
)
def undelete_financial_record(
    record_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.admin)),
) -> FinancialRecordResponse:
    record = get_record(db, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    return undelete_record(db, record)
