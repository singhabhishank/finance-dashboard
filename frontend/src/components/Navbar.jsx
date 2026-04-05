import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';

console.log('Navbar module loaded');

export default function Navbar() {
  console.log('Navbar component rendering');
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  console.log('Navbar:', { isAuthenticated, user, userRole: user?.role });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    console.log('Navbar: user not authenticated, hiding navbar');
    return null;
  }

  if (!user) {
    console.log('Navbar: no user data, showing empty navbar');
    return (
      <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 font-bold text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">💰 Finance</div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  const userRole = user.role || 'viewer';
  const userEmail = user.email || user.full_name || 'User';
  const isAdmin = userRole === 'admin';
  const isAnalyst = userRole === 'analyst';

  const navItems = [
    { label: '📊 Dashboard', path: '/dashboard' },
    { label: '📋 Records', path: '/records', show: isAdmin || isAnalyst },
    { label: '👥 Users', path: '/users', show: isAdmin },
    { label: '🎯 Role Management', path: '/role-requests' },
  ];

  const isActive = (path) => location.pathname === path;

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'analyst':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      default:
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
    }
  };

  const getRoleLabel = () => {
    if (!userRole) return 'Viewer';
    return userRole.charAt(0).toUpperCase() + userRole.slice(1);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl border-b border-white border-opacity-10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with gradient */}
          <div className="flex-shrink-0 font-bold text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:from-purple-400 hover:to-pink-400 transition-all duration-300">
            💰 Finance
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(
              (item) =>
                item.show !== false && (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                        : 'text-slate-200 hover:bg-white hover:bg-opacity-10 transform hover:scale-105'
                    }`}
                  >
                    {item.label}
                  </button>
                )
            )}
          </div>

          {/* User Info & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
              <span className="text-sm text-slate-200">{userEmail}</span>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${getRoleBadgeColor()} shadow-lg`}>
                {getRoleLabel()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-slate-200 hover:text-white focus:outline-none transition-colors duration-200"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-b from-slate-800 via-purple-900 to-slate-900 px-4 py-3 space-y-2 border-t border-white border-opacity-10 animate-slide-down">
          {navItems.map(
            (item) =>
              item.show !== false && (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      : 'text-slate-200 hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  {item.label}
                </button>
              )
          )}
          <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20">
            <span className="text-xs text-slate-300 font-semibold">{userEmail}</span>
            <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getRoleBadgeColor()}`}>
              {getRoleLabel()}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
}
