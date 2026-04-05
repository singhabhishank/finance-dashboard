import React from 'react';
import { Edit2 } from 'lucide-react';
import { EmptyState } from './Common';

export default function UsersTable({ users, loading, onEdit }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <EmptyState title="No users found" description="User management data will appear here" />
      </div>
    );
  }

  const getRoleBadgeColor = (role) => {
    if (role === 'admin') return 'bg-red-100 text-red-700';
    if (role === 'analyst') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusBadgeColor = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Full Name</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Role</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3 text-gray-700 font-medium">{user.email}</td>
                <td className="px-6 py-3 text-gray-600">{user.full_name || '-'}</td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                    {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Viewer'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(user.status)}`}>
                    {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded transition inline-block"
                    title="Edit user"
                  >
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
