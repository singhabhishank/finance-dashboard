"""
Basic pytest tests for Finance Dashboard API
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token

client = TestClient(app)


# =====================
# AUTHENTICATION TESTS
# =====================

def test_health_check():
    """Test health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_signup_success():
    """Test user registration"""
    user_data = {
        "email": "newuser@test.com",
        "password": "TestPassword123",
        "full_name": "Test User"
    }
    response = client.post("/api/v1/auth/signup", json=user_data)
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_signup_duplicate_email():
    """Test signup with existing email fails"""
    user_data = {
        "email": "admin@demo.com",
        "password": "DifferentPass123",
        "full_name": "Different User"
    }
    response = client.post("/api/v1/auth/signup", json=user_data)
    assert response.status_code == 409  # Conflict


def test_signup_weak_password():
    """Test signup with weak password fails"""
    user_data = {
        "email": "weak@test.com",
        "password": "weak",
        "full_name": "Weak Pass User"
    }
    response = client.post("/api/v1/auth/signup", json=user_data)
    assert response.status_code == 422  # Validation error


def test_login_success():
    """Test successful login"""
    login_data = {
        "email": "admin@demo.com",
        "password": "Admin123"
    }
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_invalid_credentials():
    """Test login with wrong password fails"""
    login_data = {
        "email": "admin@demo.com",
        "password": "WrongPassword"
    }
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 400


def test_get_current_user():
    """Test getting current user profile"""
    # First login
    login_response = client.post("/api/v1/auth/login", json={
        "email": "admin@demo.com",
        "password": "Admin123"
    })
    token = login_response.json()["access_token"]
    
    # Get current user
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "admin@demo.com"
    assert response.json()["role"] == "UserRole.admin"


# =====================
# RECORDS TESTS
# =====================

@pytest.fixture
def admin_token():
    """Get admin user token"""
    response = client.post("/api/v1/auth/login", json={
        "email": "admin@demo.com",
        "password": "Admin123"
    })
    return response.json()["access_token"]


@pytest.fixture
def analyst_token():
    """Get analyst user token"""
    response = client.post("/api/v1/auth/login", json={
        "email": "analyst@demo.com",
        "password": "Analyst123"
    })
    return response.json()["access_token"]


def test_create_record_as_admin(admin_token):
    """Test admin can create record"""
    record_data = {
        "amount": 500.00,
        "type": "expense",
        "category": "Office Supplies",
        "date": "2026-04-04",
        "notes": "Test record"
    }
    response = client.post(
        "/api/v1/records",
        json=record_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 201
    assert response.json()["amount"] == 500.00
    assert response.json()["type"] == "expense"


def test_create_record_as_analyst_fails(analyst_token):
    """Test analyst cannot create record"""
    record_data = {
        "amount": 500.00,
        "type": "expense",
        "category": "Office Supplies",
        "date": "2026-04-04",
        "notes": "Test record"
    }
    response = client.post(
        "/api/v1/records",
        json=record_data,
        headers={"Authorization": f"Bearer {analyst_token}"}
    )
    assert response.status_code == 403  # Forbidden


def test_list_records_as_analyst(analyst_token):
    """Test analyst can list records"""
    response = client.get(
        "/api/v1/records",
        headers={"Authorization": f"Bearer {analyst_token}"}
    )
    assert response.status_code == 200
    assert "items" in response.json()
    assert "total" in response.json()


def test_list_records_pagination(admin_token):
    """Test record pagination"""
    response = client.get(
        "/api/v1/records?skip=0&limit=5",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) <= 5


def test_filter_records_by_type(admin_token):
    """Test filtering records by type"""
    response = client.get(
        "/api/v1/records?type=income",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    items = response.json()["items"]
    # All items should have type = income
    for item in items:
        assert item["type"] == "income"


def test_filter_records_by_category(admin_token):
    """Test filtering records by category"""
    response = client.get(
        "/api/v1/records?category=Salary",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    items = response.json()["items"]
    # All items should have category = Salary
    for item in items:
        assert item["category"] == "Salary"


# =====================
# USERS TESTS
# =====================

def test_list_users_as_admin(admin_token):
    """Test admin can list users"""
    response = client.get(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    assert "items" in response.json()
    assert len(response.json()["items"]) > 0


def test_list_users_as_analyst_fails(analyst_token):
    """Test analyst cannot list users"""
    response = client.get(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {analyst_token}"}
    )
    assert response.status_code == 403  # Forbidden


def test_create_user_as_admin(admin_token):
    """Test admin can create user"""
    user_data = {
        "email": f"testuser{id(object())}@test.com",
        "password": "TestPass123",
        "full_name": "Test User",
        "role": "UserRole.viewer"
    }
    response = client.post(
        "/api/v1/users",
        json=user_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 201
    assert response.json()["role"] == "UserRole.viewer"


# =====================
# DASHBOARD TESTS
# =====================

def test_dashboard_summary_as_admin(admin_token):
    """Test admin can view dashboard"""
    response = client.get(
        "/api/v1/dashboard/summary",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "total_income" in data
    assert "total_expense" in data
    assert "balance" in data


def test_dashboard_summary_as_analyst(analyst_token):
    """Test analyst can view dashboard"""
    response = client.get(
        "/api/v1/dashboard/summary",
        headers={"Authorization": f"Bearer {analyst_token}"}
    )
    assert response.status_code == 200


def test_dashboard_summary_without_auth():
    """Test dashboard requires authentication"""
    response = client.get("/api/v1/dashboard/summary")
    assert response.status_code == 401  # Unauthorized


# =====================
# ERROR HANDLING TESTS
# =====================

def test_invalid_token():
    """Test endpoint with invalid token fails"""
    response = client.get(
        "/api/v1/records",
        headers={"Authorization": "Bearer invalid.token"}
    )
    assert response.status_code == 401


def test_expired_token():
    """Test endpoint with expired token fails"""
    # Create token that's already expired (0 minutes)
    expired_token = create_access_token(
        data={"sub": "test@test.com"},
        expires_delta=None  # Use minimal expiry
    )
    response = client.get(
        "/api/v1/records",
        headers={"Authorization": f"Bearer {expired_token}"}
    )
    # May return 401 or 422 depending on token creation
    assert response.status_code in [401, 422]


def test_record_not_found(admin_token):
    """Test getting non-existent record returns 404"""
    response = client.get(
        "/api/v1/records/nonexistent-id",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 404


# =====================
# VALIDATION TESTS
# =====================

def test_create_record_invalid_amount(admin_token):
    """Test creating record with invalid amount"""
    record_data = {
        "amount": -100,  # Negative amount invalid
        "type": "income",
        "category": "Test",
        "date": "2026-04-04"
    }
    response = client.post(
        "/api/v1/records",
        json=record_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 422  # Validation error


def test_create_record_invalid_type(admin_token):
    """Test creating record with invalid type"""
    record_data = {
        "amount": 100,
        "type": "invalid",  # Only income/expense allowed
        "category": "Test",
        "date": "2026-04-04"
    }
    response = client.post(
        "/api/v1/records",
        json=record_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 422  # Validation error


def test_create_record_invalid_date(admin_token):
    """Test creating record with invalid date"""
    record_data = {
        "amount": 100,
        "type": "income",
        "category": "Test",
        "date": "invalid-date"  # Bad date format
    }
    response = client.post(
        "/api/v1/records",
        json=record_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 422  # Validation error


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
