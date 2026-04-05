import React, { useState, useEffect } from 'react';
import { recordsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ErrorBanner, LoadingSpinner } from '../components/Common';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = ['Salary', 'Bonus', 'Investment', 'Office Supplies', 'Travel', 'Meals', 'Utilities', 'Other'];
const TYPES = ['income', 'expense'];

export default function RecordsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, record: null, loading: false });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
  });
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const isAdmin = user?.role === 'admin';
  const isAnalyst = user?.role === 'analyst';
  const canManage = isAdmin;
  const canView = isAdmin || isAnalyst;

  useEffect(() => {
    if (!canView) return;
    fetchRecords();
  }, [filters, page, canView]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        skip: (page - 1) * pageSize,
        limit: pageSize,
        type: filters.type || undefined,
        category: filters.category || undefined,
        start_date: filters.startDate || undefined,
        end_date: filters.endDate || undefined,
      };
      const data = await recordsAPI.list(params);
      const recordsList = Array.isArray(data) ? data : data.records || data.data || [];
      setRecords(recordsList);
    } catch (err) {
      setError('Failed to load records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        amount: record.amount,
        type: record.type,
        category: record.category,
        date: record.date.split('T')[0],
        notes: record.notes || '',
      });
    } else {
      setEditingRecord(null);
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleSaveRecord = async () => {
    try {
      if (!formData.amount || !formData.category) {
        toast.error('Please fill in all required fields');
        return;
      }

      const recordData = {
        amount: Number(formData.amount),
        type: formData.type,
        category: formData.category,
        date: formData.date,
        notes: formData.notes,
      };

      if (editingRecord) {
        await recordsAPI.update(editingRecord.id, recordData);
        toast.success('Record updated successfully');
      } else {
        await recordsAPI.create(recordData);
        toast.success('Record created successfully');
      }

      handleCloseForm();
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save record');
    }
  };

  const handleDeleteRecord = (record) => {
    setDeleteDialog({ isOpen: true, record, loading: false });
  };

  const confirmDelete = async () => {
    try {
      setDeleteDialog((prev) => ({ ...prev, loading: true }));
      await recordsAPI.delete(deleteDialog.record.id);
      toast.success('Record deleted successfully');
      setDeleteDialog({ isOpen: false, record: null, loading: false });
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete record');
      setDeleteDialog({ isOpen: false, record: null, loading: false });
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium">You don't have access to view records.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-5 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-32 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        {error && <ErrorBanner message={error} onRetry={fetchRecords} />}

        {/* Header with gradient text */}
        <div className="mb-8 relative z-10 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                📋 Records
              </h1>
              <p className="text-xl text-slate-300">Manage your financial records with ease</p>
            </div>
            {canManage && (
              <button
                onClick={() => handleOpenForm()}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus size={20} />
                <span>New Record</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-6 mb-6 border border-white border-opacity-10 relative z-10 animate-slide-in-up">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Filter size={20} className="text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Filters</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-4 py-2 bg-white bg-opacity-10 border border-slate-500 border-opacity-30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              >
                <option value="" className="bg-slate-800">All Types</option>
                {TYPES.map((t) => (
                  <option key={t} value={t} className="bg-slate-800">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 bg-white bg-opacity-10 border border-slate-500 border-opacity-30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              >
                <option value="" className="bg-slate-800">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-800">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-4 py-2 bg-white bg-opacity-10 border border-slate-500 border-opacity-30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-4 py-2 bg-white bg-opacity-10 border border-slate-500 border-opacity-30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Records Table */}
        {loading ? (
          <LoadingSpinner />
        ) : records.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-12 text-center border border-white border-opacity-10 relative z-10">
            <p className="text-slate-400 text-lg">📭 No records found</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg overflow-hidden border border-white border-opacity-10 relative z-10 animate-slide-in-up">
            <div className="absolute inset-0 opacity-0 hover:opacity-5 bg-gradient-to-br from-blue-500 to-cyan-500 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
            
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-sm">
                <thead className="bg-slate-700 bg-opacity-50 border-b border-white border-opacity-10 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left font-bold text-blue-300">📅 Date</th>
                    <th className="px-6 py-3 text-left font-bold text-blue-300">📂 Category</th>
                    <th className="px-6 py-3 text-left font-bold text-blue-300">📊 Type</th>
                    <th className="px-6 py-3 text-right font-bold text-blue-300">💰 Amount</th>
                    <th className="px-6 py-3 text-left font-bold text-blue-300">📝 Notes</th>
                    {canManage && <th className="px-6 py-3 text-center font-bold text-blue-300">⚙️ Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white divide-opacity-10">
                  {records.map((record, idx) => (
                    <tr 
                      key={record.id} 
                      className="hover:bg-white hover:bg-opacity-5 transition-all duration-200 group/row transform hover:scale-[1.01]"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <td className="px-6 py-3 text-slate-300 group-hover/row:text-white transition-colors">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-xs font-semibold group-hover/row:shadow-lg group-hover/row:shadow-purple-500/50 transition-all">
                          {record.category}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            record.type === 'income'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                              : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          }`}
                        >
                          {record.type === 'income' ? '+ Income' : '- Expense'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-bold">
                        <span className={record.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                          {record.type === 'income' ? '+' : '-'} ${Number(record.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-400 group-hover/row:text-slate-300 truncate max-w-xs transition-colors">{record.notes || '-'}</td>
                      {canManage && (
                        <td className="px-6 py-3 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleOpenForm(record)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(record)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && records.length > 0 && (
          <div className="mt-6 flex items-center justify-center space-x-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 text-gray-700 hover:bg-gray-100 disabled:text-gray-400 rounded transition"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-gray-600">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={records.length < pageSize}
              className="p-2 text-gray-700 hover:bg-gray-100 disabled:text-gray-400 rounded transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={showForm} title={editingRecord ? 'Edit Record' : 'New Record'} onClose={handleCloseForm} onSave={handleSaveRecord}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
            <input
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              placeholder="Optional notes..."
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Record?"
        message={`Are you sure you want to delete this record for $${Number(deleteDialog.record?.amount || 0).toFixed(2)}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, record: null, loading: false })}
        loading={deleteDialog.loading}
        isDangerous={true}
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
      `}</style>
    </div>
  );
}
