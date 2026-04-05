# Finance Dashboard - Full Stack Application

A professional finance dashboard application built with FastAPI (backend) and React (frontend). Features role-based access control, financial record management, and real-time analytics.

**Status**: Production-ready | **Built**: April 2026

---

## Quick Navigation

- **Want to run the app?** → [Quick Start](#-quick-start)
- **Looking for endpoints?** → [API Endpoint Summary](#-api-endpoint-summary)
- **Having issues?** → [Troubleshooting](#troubleshooting)

---

## Project Overview

**Finance Dashboard** is a full-stack application for managing financial records with role-based access control. Track income/expenses, view analytics, and manage team members through an intuitive web interface.

### Key Features

- **Authentication & Security** — JWT tokens, bcrypt hashing, role-based access control
- **Financial Management** — Full CRUD for records, filtering by type/category/date, pagination
- **Analytics Dashboard** — Income vs expense charts, category breakdown, monthly trends, recent transactions
- **User Management** — Create users, assign roles, toggle status (admin only)
- **Professional UI** — Responsive design, real-time charts, toast notifications, form validation

### Three User Roles

| Role | Capabilities | Access |
|------|--------------|--------|
| **Admin** | Users, Records, Dashboard | Full system |
| **Analyst** | Records, Dashboard (read-only) | View & analyze |
| **Viewer** | Dashboard only | Summary only |

---

## Tech Stack

### Backend
- **FastAPI 0.104.1** — Async web framework + Swagger docs
- **SQLAlchemy 2.0.48** — ORM for database operations
- **Pydantic v2.12.5** — Data validation and serialization
- **Python-José 3.5.0** — JWT token generation/verification
- **Bcrypt 4.0.1** — Secure password hashing
- **Alembic 1.12.1** — Database schema migrations
- **SQLite** (dev) / **PostgreSQL** (production)

### Frontend
- **React 18** — Component-based UI framework
- **Vite 5.4.21** — Lightning-fast build tool and dev server
- **Tailwind CSS 3.3.6** — Utility-first styling
- **Recharts 2.x** — Professional business charts
- **React Router v6** — Client-side routing
- **Axios 1.6.5** — HTTP client with interceptors
- **React-Hot-Toast 2.x** — Non-intrusive notifications

---

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+

### 30-Second Setup

```bash
# 1. Backend setup
cd /Users/macbookpro/Desktop/financia\ dashboard
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python -m scripts.seed

# 2. Start backend (leave running)
uvicorn app.main:app --reload  # → http://localhost:8000

# 3. In NEW TERMINAL - Frontend setup
cd frontend
npm install
npm run dev  # → http://localhost:3000
```

### Admin Account
- **Email**: singhabhishank8318@gmail.com
- **Password**: Abhiking084@

---

## Project Structure

```
financia dashboard/
├── app/                      # Backend (FastAPI)
│   ├── api/
│   │   ├── deps.py          # Authentication dependencies
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py              # Login, signup
│   │       │   ├── dashboard.py         # Analytics
│   │       │   ├── financial_records.py # CRUD ops
│   │       │   └── users.py             # User mgmt
│   │       └── router.py                # Route aggregator
│   ├── core/
│   │   ├── config.py                    # Settings & env
│   │   └── security.py                  # Auth logic
│   ├── db/
│   │   ├── base.py                      # SQLAlchemy init
│   │   └── session.py                   # DB sessions
│   ├── models/
│   │   ├── user.py
│   │   └── financial_record.py
│   ├── schemas/                         # Pydantic models
│   ├── services/                        # Business logic
│   ├── utils/
│   │   ├── enums.py                     # Roles, types
│   │   └── permissions.py               # RBAC decorator
│   └── main.py                          # App entry
│
├── frontend/                 # React (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Modal.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── Charts.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── RecordsPage.jsx
│   │   │   ├── UsersPage.jsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useToast.js
│   │   ├── services/
│   │   │   └── api.js        # Axios setup
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── alembic/                  # DB migrations
├── scripts/
│   └── seed.py              # Demo data
├── .env                     # Environment vars
├── requirements.txt
├── README.md               # This file
└── finance_dashboard.db    # SQLite

---

## API Endpoint Summary

### Authentication
- `POST /api/v1/auth/signup` — Register new user
- `POST /api/v1/auth/login` — Login & get access token
- `GET /api/v1/auth/me` — Get current user profile

### Users (Admin Only)
- `GET /api/v1/users` — List all users
- `POST /api/v1/users` — Create new user
- `PATCH /api/v1/users/{id}` — Update user role/status

### Financial Records (Admin/Analyst)
- `GET /api/v1/records` — List records (with filters & pagination)
- `POST /api/v1/records` — Create record (admin only)
- `PUT /api/v1/records/{id}` — Update record (admin only)
- `DELETE /api/v1/records/{id}` — Delete record (admin only)

### Dashboard (All Users)
- `GET /api/v1/dashboard/summary` — Get financial analytics

---

## Complete Setup Guide

### Step 1: Backend Setup

```bash
# Navigate to project
cd /Users/macbookpro/Desktop/financia\ dashboard

# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings (if needed)

# Initialize database
alembic upgrade head

# Seed demo data
python -m scripts.seed
```

### Step 2: Start Backend

```bash
# Make sure virtual environment is active
source .venv/bin/activate

# Run server
uvicorn app.main:app --reload
```

Backend URLs:
- API: http://localhost:8000
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Step 3: Frontend Setup (New Terminal)

```bash
cd /Users/macbookpro/Desktop/financia\ dashboard/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend URL:
- App: http://localhost:3000

### Step 4: Login with Demo Account

#### Admin Account

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `singhabhishank8318@gmail.com` | `Abhiking084@` |

After login, you can request different roles (viewer, analyst, admin) and the admin will approve them.

#### Create Real Users (Admin Only)
After logging in as admin, you can create new users with custom emails:

1. Click **Users** in the sidebar (admin only)
2. Click **Create User** button
3. Enter email, password, full name, and select role
4. Click **Create** — user can then login with those credentials
5. To manage existing users: **Update role**, **activate/deactivate status**

#### Forgot Password
If you forget your password:
1. Click the lock icon on the login page
2. Enter your email address
3. Set a new password (min 8 characters)
4. Login with your new password

---

## Role-Based Permissions

### Admin Access
- View dashboard analytics
- Create, read, update, delete financial records
- Create new users and assign roles
- Activate/deactivate user accounts
- Manage all users' roles and status

### Analyst Access
- View dashboard analytics
- Read-only access to financial records (cannot create/edit/delete)
- Filter and search records by type, category, date
- Cannot manage users

### Viewer Access
- View dashboard analytics (summary only)
- Cannot access financial records
- Cannot manage users

---

## Testing

### Test Endpoints with Swagger

1. Open http://localhost:8000/docs
2. Click **Authorize** button
3. Login with demo credentials
4. Test endpoints directly

### Run Python Tests

```bash
source .venv/bin/activate
pytest -v                # Run all tests
pytest --cov=app        # Run with coverage
```

---

## Real User Management System

### Why Demo Accounts?
This project includes **pre-seeded demo accounts** for easy evaluation and testing. They represent realistic role-based access scenarios:

- **admin@test.com** — Full system administrator (can manage all users and records)
- **analyst@test.com** — Financial analyst (can view records but not modify)
- **viewer@test.com** — Dashboard viewer (read-only access to summary)

### How It Works: End-to-End

#### 1. **Current User State After Login**
When you login, the system retrieves:
```json
{
  "id": 1,
  "email": "admin@test.com",
  "full_name": "Test Admin",
  "role": "admin",      // ← Determines what you can see/do
  "status": "active",   // ← Must be active to access pages
  "created_at": "2026-04-05T12:00:00"
}
```

#### 2. **Backend Enforcement** (Secure)
All API endpoints check the user's role:
- **Records endpoint** → Checks if `admin` or `analyst` before allowing access
- **Users endpoint** → Checks if `admin` before allowing access
- **Dashboard** → Available to all authenticated users

Example: Only admin can create records
```python
async def create_record(...):
    current_user = await get_current_user()
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized")
    # Create record...
```

#### 3. **Frontend Enforcement** (UX)
Navigation and pages adjust based on role:
```
Before Login:
  /login, /signup only

Logged in as Viewer:
  /dashboard ✅

Logged in as Analyst:
  /dashboard ✅, /records ✅

Logged in as Admin:
  /dashboard ✅, /records ✅, /users ✅
```

Route protection happens in **RoleProtectedRoute** component:
```jsx
<Route path="/users" element={
  <RoleProtectedRoute allowedRoles={['admin']}>
    <UsersPage />
  </RoleProtectedRoute>
} />
```

#### 4. **Creating Real Users** (Admin Control)
Admins can create users with different roles through the **Users** page:

**Flow:**
1. Admin logs in
2. Clicks **Users** in sidebar
3. Clicks **Create User** button
4. Enters email, password, full name, role
5. Clicks **Create**
6. New user can immediately login with those credentials

**Database:**
```sql
INSERT INTO users (email, full_name, hashed_password, role, status)
VALUES ('newuser@company.com', 'New User', '<bcrypt-hash>', 'analyst', 'active')
```

#### 5. **User Management Operations**
Admins can:
- ✏️ **Update role** — Change analyst to admin, etc.
- 🔒 **Toggle status** — Activate/deactivate users
- 🗑️ **Soft delete** — Mark users as inactive (preserved in database)

### Demo vs Real Users

| Aspect | Demo Users | Real Users |
|--------|-----------|-----------|
| **Pre-seeded** | ✅ Yes (for evaluation) | ❌ Created via UI |
| **Email** | @test.com | Any email |
| **Password** | Simple (admin123) | Set by admin |
| **Roles** | All three included | Admin chooses |
| **Persistence** | In database | In database |
| **Production Use** | Should be removed | Keep separate accounts |

### Best Practices

✅ **Do:**
- Use demo accounts for testing/development
- Create real user accounts for team members
- Keep inactive users instead of deleting (soft delete enabled)
- Audit user creation logs in production

❌ **Don't:**
- Use demo credentials in production
- Give viewer role unnecessary records access
- Leave inactive users without review
- Hardcode credentials anywhere

---

## �🔧 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
lsof -i :8000          # Find process
kill -9 <PID>          # Kill it
# Or use different port:
uvicorn app.main:app --port 8001
```

**CORS errors from frontend:**
```
Access to XMLHttpRequest blocked by CORS
```
**Solution:**
- Verify backend is running on port 8000
- Check `app/core/config.py` has your frontend port (3000, 3001, 3002)
- Restart backend after config changes

**Database error:**
```bash
rm finance_dashboard.db
alembic upgrade head
python -m scripts.seed
```

**ModuleNotFoundError:**
```bash
source .venv/bin/activate
pip install -r requirements.txt
```

### Role-Based Access Issues

**"Users" page won't show up (logged in as admin):**
- Verify login was successful (check token in localStorage)
- Check browser console for 403 Forbidden errors
- Verify user role is exactly `"admin"` (not `"UserRole.admin"`)
- Try logging out and back in

**"Records" page not accessible (logged in as analyst/admin):**
- Ensure you're logged in with admin or analyst account
- Check that user status is `active` (not `inactive`)
- Clear browser cookies and re-login

**Can create records but can't delete them:**
- Deletion requires `admin` role
- Analyst accounts have read-only access
- Ask an admin to delete the record

### Frontend Issues

**Port 3000 already in use:**
```bash
cd frontend
npm run dev -- --port 3001
```

**Blank white page:**
- Clear browser cache (Ctrl+Shift+Delete)
- Check console for errors (F12)
- Verify backend is running

**API calls failing:**
- Check backend is on http://localhost:8000
- Clear localStorage: press F12 → Application → LocalStorage → Clear All

---

## ✅ Internship Assessment Status

**Completed Requirements:**
- ✅ User management with three roles
- ✅ Financial records CRUD
- ✅ Filtering & pagination
- ✅ Dashboard analytics
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Data validation & error handling
- ✅ Professional frontend UI
- ✅ API documentation

---

**Last Updated**: April 2026 | **Status**: ✅ Production Ready
