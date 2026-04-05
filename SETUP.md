# Finance Dashboard - Complete Internship Project

A full-stack finance dashboard application built with a **FastAPI backend** and **React frontend**. Production-ready code with authentication, role-based access control, and real-time financial summaries.

## 📁 Project Structure

```
financia dashboard/
├── app/                          # FastAPI Backend
│   ├── main.py                   # Entry point
│   ├── core/                     # Configuration & security
│   ├── db/                       # Database setup
│   ├── models/                   # SQLAlchemy models
│   ├── schemas/                  # Pydantic schemas
│   ├── api/                      # API routes
│   ├── services/                 # Business logic
│   └── utils/                    # Helpers & enums
├── alembic/                      # Database migrations
├── scripts/                      # Seed data
├── frontend/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/                # Pages
│   │   ├── context/              # Auth context
│   │   └── services/             # API client
│   ├── public/
│   ├── package.json
│   └── README.md
├── requirements.txt              # Python dependencies
├── .env                          # Backend environment (create from .env.example)
├── .env.example                  # Backend environment template
├── alembic.ini                   # Alembic config
├── README.md                     # This file
└── SETUP.md                      # Quick setup guide
```

## 🚀 Quick Start (5 minutes)

### Prerequisites

- Python 3.10+
- Node.js 16+
- PostgreSQL 12+
- Git

### Backend Setup

```bash
# 1. Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On macOS/Linux
# or: .venv\Scripts\activate  # On Windows

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up environment
cp .env.example .env
# Edit .env to set SECRET_KEY and DATABASE_URL

# 4. Ensure PostgreSQL is running
createdb finance_dashboard

# 5. Run migrations
alembic upgrade head

# 6. Seed demo data
python -m scripts.seed

# 7. Start backend
uvicorn app.main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`

### Frontend Setup

```bash
# 1. Navigate to frontend (in a new terminal)
cd frontend

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Ensure VITE_API_URL points to backend

# 4. Start development server
npm run dev
```

Frontend runs at: `http://127.0.0.1:3000`

## 📝 Demo Credentials

Use any of these accounts to test the application:

| Role    | Email                 | Password   |
|---------|----------------------|-----------|
| Admin   | admin@demo.com       | Admin123  |
| Analyst | analyst@demo.com     | Analyst123|
| Viewer  | viewer@demo.com      | Viewer123 |

## 🔍 Quick Test

1. Go to `http://127.0.0.1:3000`
2. Login with `admin@demo.com` / `Admin123`
3. View dashboard with financial summary
4. See category breakdown with sample data
5. Logout to test auth protection

## 📚 Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Auth**: JWT + bcrypt
- **Validation**: Pydantic v2
- **Migrations**: Alembic
- **Server**: Uvicorn

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: Lucide React

## 🔐 Features

### Backend
✅ User management (admin only)
✅ Role-based access control (admin, analyst, viewer)
✅ JWT authentication
✅ Financial record CRUD with filtering & pagination
✅ Real-time dashboard summaries
✅ PostgreSQL integration
✅ Data migrations with Alembic
✅ Comprehensive Pydantic validation

### Frontend
✅ Login/logout with JWT
✅ Protected routes
✅ Real-time dashboard with income/expense cards
✅ Category breakdown visualization
✅ Automatic token refresh on 401
✅ Error handling
✅ Responsive Tailwind design

## 📖 API Documentation

### Backend Endpoints

**Authentication**
- `POST /api/v1/auth/login` - Login to get JWT token

**Dashboard** (all authenticated users)
- `GET /api/v1/dashboard/summary` - Get financial summary

**Financial Records** (admin/analyst read-only)
- `GET /api/v1/records` - List records with pagination/filters
- `GET /api/v1/records/{id}` - Get record details
- `POST /api/v1/records` - Create record (admin only)
- `PUT /api/v1/records/{id}` - Update record (admin only)
- `DELETE /api/v1/records/{id}` - Delete record (admin only)

**Users** (admin only)
- `GET /api/v1/users` - List all users
- `POST /api/v1/users` - Create new user
- `PATCH /api/v1/users/{id}` - Update user role/status

See [backend README](./README.md) for full details.

## 🛠️ Development

### Backend Development
```bash
# Run with auto-reload
uvicorn app.main:app --reload

# Create new migration
alembic revision -m "describe your change"
alembic upgrade head

# View Swagger docs
# https://127.0.0.1:8000/docs
```

### Frontend Development
```bash
# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing the Full Stack

### 1. View Swagger Docs
- Backend: `http://127.0.0.1:8000/docs`
- Try `/auth/login` endpoint

### 2. Test Frontend Login
- Navigate to `http://127.0.0.1:3000`
- Login with admin credentials
- Verify dashboard loads with data

### 3. Test Role-Based Access
- Try logging in with different roles:
  - **Admin**: Full CRUD access to records
  - **Analyst**: Read-only records access
  - **Viewer**: Dashboard summary only

### 4. Test Backend Endpoints Directly
```bash
# Get auth token
curl -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"Admin123"}'

# Use token to access protected route
curl http://127.0.0.1:8000/api/v1/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📦 Deployment

### Build Frontend
```bash
cd frontend
npm run build
# Outputs to dist/ folder
```

### Production Checklist
- [ ] Set strong `SECRET_KEY` in backend `.env`
- [ ] Use production PostgreSQL database
- [ ] Set `VITE_API_URL` to production backend URL
- [ ] Enable CORS for frontend domain
- [ ] Use HTTPS for all production traffic
- [ ] Set `APP_ENV=production`

## 🐛 Troubleshooting

**Backend won't start**
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Run alembic migrations: `alembic upgrade head`

**Frontend can't connect to backend**
- Verify backend is running on port 8000
- Check `VITE_API_URL` in frontend `.env`
- Look for CORS errors in browser console

**Login fails**
- Verify demo users were seeded: `python -m scripts.seed`
- Check backend logs for auth errors
- Ensure JWT `SECRET_KEY` is set in `.env`

**Migrations fail**
- Drop and recreate database: `dropdb finance_dashboard && createdb finance_dashboard`
- Re-run migrations: `alembic upgrade head`

## 📋 Requirements

### Python (Backend)
- FastAPI 0.104+
- SQLAlchemy 2.0+
- Pydantic 2.0+
- Alembic 1.12+
- psycopg2-binary 2.9+
- python-jose 3.3+
- bcrypt 4.0+

### Node (Frontend)
- React 18+
- Vite 5+
- Tailwind CSS 3.3+
- Axios 1.6+
- React Router 6+

## 📄 Documentation

- [Backend README](./README.md)
- [Frontend README](./frontend/README.md)

## ✨ Code Quality

- Clean separation of concerns (routes, services, models)
- Type hints throughout (Python + JSDoc)
- Comprehensive validation (Pydantic + frontend)
- Error handling with proper HTTP status codes
- Protected routes on both frontend and backend
- Reusable components and utilities

## 🎓 Internship Submission Notes

This project demonstrates:
- **Backend Engineering**: FastAPI, SQLAlchemy, Alembic, JWT auth
- **Frontend Development**: React, Vite, routing, state management
- **Database Design**: PostgreSQL schema with relationships
- **Security**: Role-based access control, password hashing
- **API Integration**: Axios with error handling
- **Code Organization**: Clean folder structure, separation of concerns
- **Production Readiness**: Error handling, validation, migrations

## 📞 Support

For issues or questions, refer to the individual READMEs:
- Backend issues → See `README.md`
- Frontend issues → See `frontend/README.md`
- Setup issues → See this file

---

**Created**: April 2026  
**Status**: Production-Ready for Internship Submission  
**License**: MIT
