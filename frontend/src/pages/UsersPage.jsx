import React, { useEffect, useState } from 'react';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ErrorBanner, LoadingSpinner } from '../components/Common';
import toast from 'react-hot-toast';
import { Shield, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';

const ROLES = ['admin', 'analyst', 'viewer'];
const STATUSES = ['active', 'inactive'];

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: '', status: '' });
  const [toggleDialog, setToggleDialog] = useState({ isOpen: false, user: null, loading: false });

  const isAdmin = currentUser?.role === 'admin';

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      window.location.href = '/dashboard';
      return;
    }
    fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await usersAPI.list();
      const usersList = Array.isArray(data) ? data : data.data || data.users || [];
      setUsers(usersList);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (userData) => {
    setEditingUser(userData);
    setFormData({
      role: userData.role,
      status: userData.status,
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleSaveUser = async () => {
    try {
      if (!editingUser) return;

      await usersAPI.update(editingUser.id, {
        role: formData.role,
        status: formData.status,
      });

      toast.success('User updated successfully');
      handleCloseForm();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update user');
    }
  };

  const handleToggleStatus = (userData) => {
    const newStatus = userData.status === 'active' ? 'inactive' : 'active';
    setToggleDialog({
      isOpen: true,
      user: { ...userData, newStatus },
      loading: false,
    });
  };

  const confirmToggle = async () => {
    try {
      setToggleDialog((prev) => ({ ...prev, loading: true }));
      const { user: u } = toggleDialog;
      await usersAPI.update(u.id, { status: u.newStatus });
      toast.success(`User ${u.newStatus === 'active' ? 'activated' : 'deactivated'}`);
      setToggleDialog({ isOpen: false, user: null, loading: false });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update status');
      setToggleDialog({ isOpen: false, user: null, loading: false });
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'analyst':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'viewer':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default:
        return 'bg-gradient-to-r from-slate-500 to-slate-600';
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      'admin': 'Admin',
      'analyst': 'Analyst',
      'viewer': 'Viewer',
    };
    return labels[role] || role;
  };

  const getStatusBadgeColor = (status) => {
    return status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-slate-500 to-slate-600';
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
          <div className="bg-gradient-to-r from-red-500 bg-opacity-20 to-pink-500 bg-opacity-20 border border-red-400 border-opacity-50 rounded-xl p-6 text-center backdrop-blur-sm animate-shake">
            <p className="text-red-200 font-bold">🔒 You don't have access to this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 right-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        {error && <ErrorBanner message={error} onRetry={fetchUsers} />}

        {/* Header */}
        <div className="mb-8 relative z-10 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            👥 User Management
          </h1>
          <p className="text-xl text-slate-300">Manage user roles and access levels</p>
        </div>

        {/* Users Table */}
        {loading ? (
          <LoadingSpinner />
        ) : users.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-12 text-center border border-white border-opacity-10 relative z-10">
            <p className="text-slate-400 text-lg">📭 No users found</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg overflow-hidden border border-white border-opacity-10 relative z-10 animate-slide-in-up">
            <div className="absolute inset-0 opacity-0 hover:opacity-5 bg-gradient-to-br from-blue-500 to-purple-500 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
            
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-sm">
                <thead className="bg-slate-700 bg-opacity-50 border-b border-white border-opacity-10 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left font-bold text-blue-300">📧 Email</th>
                    <th className="px-6 py-3 text-left font-bold text-blue-300">👤 Full Name</th>
                    <th className="px-6 py-3 text-left font-bold text-blue-300">🔐 Role</th>
                    <th className="px-6 py-3 text-left font-bold text-blue-300">⚡ Status</th>
                    <th className="px-6 py-3 text-left font-bold text-blue-300">📅 Joined</th>
                    <th className="px-6 py-3 text-center font-bold text-blue-300">⚙️ Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white divide-opacity-10">
                  {users.map((userData, idx) => (
                    <tr 
                      key={userData.id} 
                      className="hover:bg-white hover:bg-opacity-5 transition-all duration-200 group/row transform hover:scale-[1.01]"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <td className="px-6 py-3 text-slate-200 group-hover/row:text-white font-medium transition-colors">{userData.email}</td>
                      <td className="px-6 py-3 text-slate-300 group-hover/row:text-slate-200 transition-colors">{userData.full_name}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold text-white ${getRoleBadgeColor(userData.role)}`}>
                          {getRoleLabel(userData.role)}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold text-white ${getStatusBadgeColor(userData.status)}`}>
                          {userData.status?.charAt(0)?.toUpperCase() + userData.status?.slice(1) || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-400 group-hover/row:text-slate-300 text-sm transition-colors">
                        {new Date(userData.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEditUser(userData)}
                            className="p-2 text-blue-400 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 transform hover:scale-110"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(userData)}
                            className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
                              userData.status === 'active'
                                ? 'text-green-400 hover:bg-white hover:bg-opacity-10'
                                : 'text-red-400 hover:bg-white hover:bg-opacity-10'
                            }`}
                            title={userData.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {userData.status === 'active' ? (
                              <ToggleRight size={18} />
                            ) : (
                              <ToggleLeft size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <Modal
          isOpen={showForm}
          title={`Edit User: ${editingUser.email}`}
          onClose={handleCloseForm}
          onSave={handleSaveUser}
          saveText="Update User"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">📧 Email</label>
              <input
                type="email"
                value={editingUser.email}
                disabled
                className="w-full px-4 py-2 bg-white bg-opacity-5 border border-white border-opacity-20 rounded-lg text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">👤 Full Name</label>
              <input
                type="text"
                value={editingUser.full_name}
                disabled
                className="w-full px-4 py-2 bg-white bg-opacity-5 border border-white border-opacity-20 rounded-lg text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">🔐 Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                className="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-slate-800">
                    {getRoleLabel(r)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">⚡ Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-slate-800">
                    {s?.charAt(0)?.toUpperCase() + s?.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* Status Toggle Confirmation */}
      <ConfirmDialog
        isOpen={toggleDialog.isOpen}
        title={toggleDialog.user?.status === 'active' ? 'Deactivate User?' : 'Activate User?'}
        message={`Are you sure you want to ${
          toggleDialog.user?.status === 'active' ? 'deactivate' : 'activate'
        } ${toggleDialog.user?.email}?`}
        onConfirm={confirmToggle}
        onCancel={() => setToggleDialog({ isOpen: false, user: null, loading: false })}
        loading={toggleDialog.loading}
        isDangerous={toggleDialog.user?.status === 'active'}
      />

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
