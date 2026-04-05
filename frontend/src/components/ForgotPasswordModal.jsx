import React, { useState } from 'react';
import { X, Lock, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: email, 2: new password, 3: success
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/v1/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.toLowerCase() }),
        }
      );

      if (response.ok) {
        setStep(2); // Move to password reset step
      } else {
        const data = await response.json();
        toast.error(data.detail || 'Email not found');
      }
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/v1/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.toLowerCase(),
            new_password: newPassword,
          }),
        }
      );

      if (response.ok) {
        toast.success('Password reset successfully!');
        setStep(3); // Show success
        setTimeout(() => {
          onClose();
          setStep(1);
          setEmail('');
          setNewPassword('');
          setConfirmPassword('');
        }, 2000);
      } else {
        const data = await response.json();
        toast.error(data.detail || 'Failed to reset password');
      }
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock size={24} />
            Reset Password
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {step === 1 ? (
            // Step 1: Verify Email
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">
                Enter your email address to reset your password.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={loading}
                    required
                  />
                  <Mail className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Next'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
          ) : step === 2 ? (
            // Step 2: Set New Password
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">
                Enter your new password for <strong>{email}</strong>
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition font-medium disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            // Step 3: Success
            <div className="text-center space-y-4">
              <CheckCircle size={64} className="mx-auto text-green-500" />
              <h3 className="font-bold text-lg text-gray-800">Password Reset!</h3>
              <p className="text-gray-600 text-sm">
                Your password has been successfully reset. You can now login with your new password.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 3 && (
          <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-lg border-t border-gray-100">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition font-medium"
                disabled={loading}
              >
                Back
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition font-medium"
              disabled={loading}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
