import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { roleRequestsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function RoleRequestModal({ isOpen, onClose, currentRole, onSuccess }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const getNextRole = () => {
    if (currentRole === 'viewer') return 'analyst';
    if (currentRole === 'analyst') return 'admin';
    return null;
  };

  const nextRole = getNextRole();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    setLoading(true);
    try {
      await roleRequestsAPI.requestRoleChange(nextRole, reason);
      setHasSubmitted(true);
      toast.success('Role request submitted successfully!');
      setTimeout(() => {
        onClose();
        setHasSubmitted(false);
        setReason('');
        onSuccess?.();
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to submit role request';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentRoleLabel = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
  const nextRoleLabel = nextRole ? (nextRole.charAt(0).toUpperCase() + nextRole.slice(1)) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold text-white">
            {hasSubmitted ? '✅ Request Submitted' : '📋 Request Role Change'}
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
          {hasSubmitted ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle size={64} className="text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-800">Request Submitted!</h3>
                <p className="text-gray-600">
                  Your request to become an <strong>{nextRoleLabel}</strong> has been submitted to the admin dashboard.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  An administrator will review your request and you'll be notified of their decision.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Role Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Current Role: <strong className="text-blue-700">{currentRoleLabel}</strong>
                </p>
              </div>

              {/* Role Change Arrow */}
              <div className="flex items-center justify-between text-center">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">{currentRoleLabel}</p>
                </div>
                <div className="px-3">
                  <p className="text-2xl text-purple-600">→</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-700">{nextRoleLabel}</p>
                </div>
              </div>

              {/* Role Permissions */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {nextRoleLabel} Permissions:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {nextRole === 'analyst' && (
                    <>
                      <li>✅ View all financial records</li>
                      <li>✅ Access financial summaries</li>
                      <li>❌ Cannot create or modify records</li>
                    </>
                  )}
                  {nextRole === 'admin' && (
                    <>
                      <li>✅ Create new financial records</li>
                      <li>✅ Edit all financial records</li>
                      <li>✅ Delete financial records</li>
                      <li>✅ Manage users</li>
                      <li>✅ Approve role requests</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Reason Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you need this role? *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={`Explain why you need ${nextRoleLabel} access...`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows="4"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide a clear reason for your role request
                </p>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-3">
                <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  An admin will review your request. Be honest about your needs to increase approval chances.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!hasSubmitted && (
          <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-lg border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
