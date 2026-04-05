import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Check } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

console.log('SignupPage module loaded');

export default function SignupPage() {
  console.log('SignupPage component rendering');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Password validation
  const passwordErrors = [];
  if (password.length > 0 && password.length < 8) {
    passwordErrors.push('At least 8 characters');
  }
  if (password && confirmPassword && password !== confirmPassword) {
    passwordErrors.push('Passwords do not match');
  }

  const isFormValid = 
    email && 
    password && 
    confirmPassword && 
    fullName.trim() && 
    password === confirmPassword &&
    password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Signup attempt for:', email);

    try {
      // Step 1: Signup and get token
      const response = await authAPI.signup(email, password, fullName);
      const token = response.access_token;
      
      if (!token) {
        throw new Error('No token received from signup');
      }

      console.log('Token received, storing and fetching user info...');

      // Step 2: Store token in localStorage immediately
      localStorage.setItem('token', token);

      // Step 3: Small delay to ensure token is stored
      await new Promise(resolve => setTimeout(resolve, 100));

      // Step 4: Get current user info with the token (using direct token, not from localStorage)
      let userData = null;
      try {
        userData = await authAPI.getCurrentUserWithToken(token);
        console.log('User data from /users/me:', userData);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        // Fallback to basic user data if /users/me fails
        userData = {
          email: email.toLowerCase(),
          role: 'viewer',
          full_name: fullName,
          id: null,
        };
      }

      // Step 5: Store user in localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      // Step 6: Login to context (stores token + user data)
      login(token, userData);
      
      console.log('Signup successful, redirecting to dashboard...');
      
      // Step 7: Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.detail || err.message || 'Signup failed. Please try again.');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Signup Card - Enhanced Design */}
        <div className="bg-white bg-opacity-10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white border-opacity-20 hover:border-opacity-40 transition-all duration-500">
          <div className="mb-8 text-center animate-fade-in">
            <div className="inline-block mb-4">
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                💰
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Finance Dashboard</h1>
            <p className="text-purple-200 text-lg">Join the smart money movement</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-400 rounded-xl flex items-start gap-3 animate-shake">
              <AlertCircle className="text-red-300 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-100 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="group">
              <label htmlFor="fullName" className="block text-sm font-semibold text-purple-200 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-300 border-opacity-30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:bg-opacity-5 transition-all duration-300 hover:border-opacity-50"
                />
                <div className="absolute right-4 top-3.5 text-purple-300 opacity-0 group-focus-within:opacity-100 transition-opacity">
                  👤
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-purple-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-300 border-opacity-30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:bg-opacity-5 transition-all duration-300 hover:border-opacity-50"
                />
                <div className="absolute right-4 top-3.5 text-purple-300 opacity-0 group-focus-within:opacity-100 transition-opacity">
                  📧
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-purple-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-300 border-opacity-30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:bg-opacity-5 transition-all duration-300 hover:border-opacity-50"
                />
                <div className="absolute right-4 top-3.5 text-purple-300 opacity-0 group-focus-within:opacity-100 transition-opacity">
                  🔒
                </div>
              </div>
              {password && password.length >= 8 && (
                <p className="text-green-300 text-xs mt-2 flex items-center gap-1 animate-fade-in">
                  <Check size={14} /> Strong password
                </p>
              )}
              {password && password.length < 8 && (
                <p className="text-amber-300 text-xs mt-2">⚠️ Minimum 8 characters required</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="group">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-purple-200 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-300 border-opacity-30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:bg-opacity-5 transition-all duration-300 hover:border-opacity-50"
                />
                <div className="absolute right-4 top-3.5 text-purple-300 opacity-0 group-focus-within:opacity-100 transition-opacity">
                  ✔️
                </div>
              </div>
              {confirmPassword && password === confirmPassword && (
                <p className="text-green-300 text-xs mt-2 flex items-center gap-1 animate-fade-in">
                  <Check size={14} /> Passwords match
                </p>
              )}
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-300 text-xs mt-2">❌ Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 hover:from-purple-600 hover:via-indigo-600 hover:to-cyan-600 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:scale-100"
            >
              {loading ? (
                <>
                  <div className="animate-spin">⌛</div>
                  Creating account...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-purple-300 border-opacity-20 text-center">
            <p className="text-purple-200 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-300 hover:text-purple-200 font-bold hover:underline transition-colors">
                Sign in now
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
