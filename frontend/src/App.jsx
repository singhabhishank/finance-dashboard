import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import RecordsPage from './pages/RecordsPage';
import UsersPage from './pages/UsersPage';
import RoleRequestsPage from './pages/RoleRequestsPage';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/records"
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'analyst']}>
                    <RecordsPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <UsersPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/role-requests"
              element={
                <ProtectedRoute>
                  <RoleRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
