from enum import Enum


class UserRole(str, Enum):
    admin = "admin"
    analyst = "analyst"
    viewer = "viewer"


class UserStatus(str, Enum):
    active = "active"
    inactive = "inactive"


class RecordType(str, Enum):
    income = "income"
    expense = "expense"


class SortOrder(str, Enum):
    asc = "asc"
    desc = "desc"


class RecordSortField(str, Enum):
    date = "date"
    amount = "amount"
    category = "category"
    created_at = "created_at"


class UserSortField(str, Enum):
    id = "id"
    email = "email"
    full_name = "full_name"
    role = "role"
    status = "status"
    created_at = "created_at"
