import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import RoleRequestModal from '../components/RoleRequestModal';
import { useAuth } from '../context/AuthContext';
import { roleRequestsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function RoleRequestsPage() {
  const { user, refreshUser } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  const isAdmin = user?.role === 'admin';
  const canRequestRole = user?.role !== 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchPendingRequests();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await roleRequestsAPI.getPendingRequests();
      setPendingRequests(result);
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to load pending requests';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    setApprovingId(requestId);
    try {
      await roleRequestsAPI.approveRequest(requestId, true);
      toast.success('Request approved!');
      fetchPendingRequests();
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to approve request';
      toast.error(message);
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (requestId) => {
    setRejectingId(requestId);
    try {
      await roleRequestsAPI.approveRequest(requestId, false);
      toast.success('Request rejected!');
      fetchPendingRequests();
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to reject request';
      toast.error(message);
    } finally {
      setRejectingId(null);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-50';
      case 'analyst':
        return 'text-orange-600 bg-orange-50';
      case 'viewer':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'analyst':
        return 'bg-yellow-100 text-yellow-700';
      case 'viewer':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex-1 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              🎯 Role Management
            </h1>
            <p className="text-gray-600">
              {isAdmin
                ? 'Review and approve role change requests from your team'
                : 'Manage your role and request access to higher privilege levels'}
            </p>
          </div>

          {isAdmin ? (
            // ADMIN VIEW: Pending Requests
            <div className="bg-white rounded-lg shadow-lg">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <AlertCircle size={24} />
                  Pending Role Change Requests
                </h2>
              </div>

              {/* Content */}
              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                  </div>
                ) : pendingRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                    <p className="text-gray-600 text-lg font-medium">No pending requests</p>
                    <p className="text-gray-500 text-sm">All role change requests have been processed</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div
                        key={request.request_id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          {/* User Info */}
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                              User
                            </p>
                            <p className="font-bold text-gray-900">{request.user_full_name}</p>
                            <p className="text-sm text-gray-600">{request.user_email}</p>
                          </div>

                          {/* Role Transition */}
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                              Role Change
                            </p>
                            <p className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${getRoleBadgeClass(request.current_role)}`}>
                                {request.current_role.toUpperCase()}
                              </span>
                              <span className="text-gray-400">→</span>
                              <span className={`px-2 py-1 rounded text-xs font-bold ${getRoleBadgeClass(request.requested_role)}`}>
                                {request.requested_role.toUpperCase()}
                              </span>
                            </p>
                          </div>

                          {/* Request Date */}
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                              Requested
                            </p>
                            <p className="text-sm text-gray-700">
                              {new Date(request.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Reason */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-purple-500">
                          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
                            Reason
                          </p>
                          <p className="text-gray-700 text-sm">{request.reason}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-end">
                          <button
                            onClick={() => handleReject(request.request_id)}
                            disabled={rejectingId === request.request_id}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-medium disabled:opacity-50"
                          >
                            {rejectingId === request.request_id ? (
                              <>
                                <span className="animate-spin">⏳</span>
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <XCircle size={16} />
                                Reject
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleApprove(request.request_id)}
                            disabled={approvingId === request.request_id}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition font-bold disabled:opacity-50"
                          >
                            {approvingId === request.request_id ? (
                              <>
                                <span className="animate-spin">⏳</span>
                                Approving...
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} />
                                Approve
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // USER VIEW: Request Role Change
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Role Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
                  <h2 className="text-xl font-bold">Your Current Role</h2>
                </div>
                <div className="p-6">
                  <div className="text-center py-8">
                    <div className={`inline-block px-6 py-3 rounded-lg ${getRoleBadgeClass(user?.role)}`}>
                      <p className="text-2xl font-bold uppercase">{user?.role}</p>
                    </div>
                    <p className="text-gray-600 mt-4">
                      {user?.role === 'viewer' && 'You can request to become an Analyst to view financial records'}
                      {user?.role === 'analyst' && 'You can request to become an Admin for full management access'}
                    </p>
                  </div>

                  {/* Current Permissions */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Your Permissions:</p>
                    <ul className="space-y-2 text-sm">
                      {user?.role === 'viewer' && (
                        <>
                          <li className="flex items-center gap-2">
                            <span className="text-green-600">✅</span>
                            <span>View dashboard</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-red-600">❌</span>
                            <span>Access financial records</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-red-600">❌</span>
                            <span>Create/edit records</span>
                          </li>
                        </>
                      )}
                      {user?.role === 'analyst' && (
                        <>
                          <li className="flex items-center gap-2">
                            <span className="text-green-600">✅</span>
                            <span>View dashboard</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-green-600">✅</span>
                            <span>Read financial records</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-red-600">❌</span>
                            <span>Create/edit/delete records</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Request Role Card */}
              {canRequestRole && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 text-white">
                    <h2 className="text-xl font-bold">Request Role Change</h2>
                  </div>
                  <div className="p-6">
                    <div className="text-center py-8">
                      <Clock size={48} className="mx-auto text-purple-600 mb-4" />
                      <p className="text-gray-700 font-medium mb-2">Ready for more access?</p>
                      <p className="text-gray-600 text-sm mb-6">
                        {user?.role === 'viewer'
                          ? 'Request to become an Analyst and gain access to financial records and analytics'
                          : 'Request to become an Admin and get full management access'}
                      </p>
                      <button
                        onClick={() => setShowRequestModal(true)}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700 transition"
                      >
                        Request {user?.role === 'viewer' ? 'Analyst' : 'Admin'} Role
                      </button>
                    </div>

                    {/* Next Level Permissions */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm font-semibold text-purple-700 mb-3">
                        You'll gain access to:
                      </p>
                      <ul className="space-y-2 text-sm">
                        {user?.role === 'viewer' && (
                          <>
                            <li className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span>Read all financial records</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span>View financial summaries</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span>Access analytics dashboard</span>
                            </li>
                          </>
                        )}
                        {user?.role === 'analyst' && (
                          <>
                            <li className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span>Create financial records</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span>Edit all records</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span>Delete records</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span>Manage users</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Role Request Modal */}
      <RoleRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        currentRole={user?.role}
        onSuccess={refreshUser}
      />
    </>
  );
}
