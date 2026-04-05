from sqlalchemy import select
from sqlalchemy import func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdateRoleStatus
from app.utils.enums import SortOrder, UserRole, UserSortField, UserStatus


def get_user_by_email(db: Session, email: str) -> User | None:
    normalized_email = email.strip().lower()
    return db.scalar(select(User).where(User.email == normalized_email))


def list_users(db: Session) -> list[User]:
    return list(db.scalars(select(User).order_by(User.id.asc())).all())


def list_users_paginated(
    db: Session,
    page: int,
    page_size: int,
    search: str | None,
    role: UserRole | None,
    status: UserStatus | None,
    sort_by: UserSortField,
    sort_order: SortOrder,
) -> tuple[list[User], int]:
    query = select(User)
    count_query = select(func.count(User.id)).select_from(User)

    if search:
        term = f"%{search.strip()}%"
        condition = or_(User.email.ilike(term), User.full_name.ilike(term))
        query = query.where(condition)
        count_query = count_query.where(condition)

    if role is not None:
        query = query.where(User.role == role)
        count_query = count_query.where(User.role == role)

    if status is not None:
        query = query.where(User.status == status)
        count_query = count_query.where(User.status == status)

    sort_columns = {
        UserSortField.id: User.id,
        UserSortField.email: User.email,
        UserSortField.full_name: User.full_name,
        UserSortField.role: User.role,
        UserSortField.status: User.status,
        UserSortField.created_at: User.created_at,
    }
    sort_column = sort_columns[sort_by]
    if sort_order == SortOrder.asc:
        query = query.order_by(sort_column.asc(), User.id.asc())
    else:
        query = query.order_by(sort_column.desc(), User.id.desc())

    total = db.scalar(count_query) or 0
    offset = (page - 1) * page_size
    users = list(db.scalars(query.offset(offset).limit(page_size)).all())
    return users, total


def create_user(db: Session, payload: UserCreate) -> User:
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=get_password_hash(payload.password),
        role=payload.role,
        status=payload.status,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ValueError("Email already exists") from exc
    db.refresh(user)
    return user


def update_user_role_status(db: Session, user: User, payload: UserUpdateRoleStatus) -> User:
    if payload.role is not None:
        user.role = payload.role
    if payload.status is not None:
        user.status = payload.status
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
