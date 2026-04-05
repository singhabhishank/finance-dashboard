# Finance Dashboard Frontend

A modern, professional React frontend for the Finance Dashboard internship project.

## Features

### 🔐 Authentication
- Email/password login with JWT token management
- Role-based access control (Admin, Analyst, Viewer)
- Persistent token storage with auto-logout on 401 errors

### 📊 Dashboard
- **Summary Cards**: Total income, expense, and current balance
- **Monthly Chart**: Visual comparison of income vs expense by month
- **Category Breakdown**: Expense distribution visualized
- **Recent Transactions**: Quick view of latest financial records

### 📋 Records Management (Admin & Analyst)
- **List Records**: Paginated table with all transactions
- **Filter Records**: By type (income/expense), category, and date range
- **Admin Only**:
  - Create new financial records
  - Edit existing records
  - Delete records
- **Analyst**: View-only access

### 👥 User Management (Admin Only)
- View all registered users
- Update user roles (Admin, Analyst, Viewer)
- Update user status (Active, Inactive)

### 🎨 UI/UX
- Clean, professional Tailwind CSS design
- Responsive layout (mobile, tablet, desktop)
- Loading states on all data-loading operations
- Error messages with user-friendly messages
- Empty states when no data available
- Top navigation bar with user info and role badge
- Mobile-friendly hamburger menu

## Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create `.env` file in `frontend/` directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

### 3. Start Development Server
```bash
npm run dev
```

Server will run on `http://127.0.0.1:3000`

## Demo Credentials

### Admin
- **Email**: admin@demo.com
- **Password**: Admin123
- **Access**: Dashboard, Records, Users

### Analyst
- **Email**: analyst@demo.com
- **Password**: Analyst123
- **Access**: Dashboard, Records

### Viewer
- **Email**: viewer@demo.com
- **Password**: Viewer123
- **Access**: Dashboard only

## Available Scripts

### Development
```bash
npm run dev          # Start dev server with hot reload
```

### Production Build
```bash
npm run build        # Build optimized production bundle
npm run preview      # Preview production build locally
```

## Project Structure

```
frontend/src/
├── components/
│   ├── Navbar.jsx                 # Top navigation with user info
│   ├── ProtectedRoute.jsx          # Auth guard component
│   ├── RoleProtectedRoute.jsx      # Role-based access guard
│   ├── Common.jsx                  # Reusable UI (Loading, Error, Empty)
│   ├── SummaryCard.jsx             # Dashboard summary card
│   ├── CategoryBreakdown.jsx       # Category breakdown chart
│   ├── MonthlyChart.jsx            # Monthly income vs expense
│   ├── RecentTransactions.jsx      # Recent transactions table
│   ├── RecordsFilter.jsx           # Filtering form
│   ├── RecordsTable.jsx            # Records list
│   ├── RecordForm.jsx              # Create/edit modal
│   ├── UsersTable.jsx              # Users list
│   └── UserForm.jsx                # Edit user modal
├── pages/
│   ├── LoginPage.jsx               # Login form
│   ├── DashboardPage.jsx           # Main dashboard
│   ├── RecordsPage.jsx             # Records management
│   ├── UsersPage.jsx               # User management (admin only)
│   └── NotFoundPage.jsx            # 404 page
├── context/
│   └── AuthContext.jsx             # Global auth state
├── services/
│   └── api.js                      # Axios HTTP client
├── App.jsx                          # Router configuration
├── main.jsx                         # Entry point
└── index.css                        # Tailwind + global styles
```

## Tech Stack

- **React 18**: UI framework
- **Vite 5**: Build tool with HMR
- **Tailwind CSS 3**: Utility-first CSS
- **Axios 1.6**: HTTP client
- **React Router v6**: SPA routing
- **Lucide React**: Icon library

## Key Features Explained

### Role-Based Navigation
- Admin users see: Dashboard, Records, Users
- Analyst users see: Dashboard, Records
- Viewer users see: Dashboard only

### Dashboard
- Real-time financial summary
- Monthly income vs expense comparison
- Category-wise expense breakdown
- Recent transaction history (last 10)

### Records Management
- Filter by type, category, date range
- Pagination support
- Admin can CRUD records
- Analyst can view only

### User Management
- Admin-only access
- Update user roles and status
- View all system users

## Authentication & Security

- JWT tokens stored in localStorage
- Automatic token injection via Axios interceptors
- Auto-logout on 401 responses
- Protected routes prevent unauthorized access
- Role-based navigation and access control

## Error Handling

- User-friendly error messages
- Form validation with inline feedback
- Empty states for no data
- Loading states during operations
- Confirmation dialogs for destructive actions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Tips for Internship Submission

1. **Start with Login**: admin@demo.com / Admin123
2. **Explore Dashboard**: View financial summary and charts
3. **Test Records Page**: Filter and view transactions
4. **Check Users Page**: View role-based access
5. **Test Responsiveness**: Works on mobile/tablet/desktop
6. **Professional Polish**: Clean UI suitable for business

## Troubleshooting

### Port 3000 Connection Refused
- Ensure backend runs on port 8000
- Check VITE_API_URL in .env

### 401 Unauthorized
- Verify user credentials
- Check backend is running
- Clear browser cache

### Components Not Rendering
- Clear node_modules: `rm -rf node_modules && npm install`
- Check browser console for errors

---

Built with ❤️ for a professional Finance Dashboard internship project.

│   │   ├── ProtectedRoute.jsx
│   │   ├── SummaryCard.jsx
│   │   └── CategoryBreakdown.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   └── DashboardPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://127.0.0.1:8000
```

### 3. Ensure Backend is Running

Make sure the FastAPI backend is running on `http://127.0.0.1:8000`:

```bash
# In the backend directory
uvicorn app.main:app --reload
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://127.0.0.1:3000`.

## Demo Credentials

Use any of these to log in:

- **Admin**: admin@demo.com / Admin123
- **Analyst**: analyst@demo.com / Analyst123
- **Viewer**: viewer@demo.com / Viewer123

## API Integration

The app communicates with the backend via Axios with automatic:
- JWT token injection in request headers
- 401 redirect to login on auth failure
- Clean error handling

### Available Endpoints

- `POST /auth/login` - Login
- `GET /dashboard/summary` - Dashboard summary
- `GET /records` - List financial records
- `GET /users` - List users (admin only)

See [backend API docs](../README.md) for full endpoint reference.

## Build for Production

```bash
npm run build
npm run preview
```

## Architecture

- **AuthContext**: Global auth state (token, login/logout)
- **ProtectedRoute**: Route guard component
- **API Service**: Axios instance with interceptors
- **Pages**: LoginPage & DashboardPage
- **Components**: Reusable UI components (SummaryCard, CategoryBreakdown)

## Notes

- Tokens are stored in localStorage for persistence
- The app redirects to login on 401 response
- Dashboard refreshes on mount to fetch latest data
- Category breakdown is displayed as a horizontal bar chart
- All currency values formatted as USD

## Development

The Vite dev server proxies `/api` requests to the backend via the `vite.config.js` configuration.

```javascript
proxy: {
  '/api': {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
  },
}
```

This allows seamless API calls without CORS issues during development.
