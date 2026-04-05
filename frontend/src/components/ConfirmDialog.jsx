import React from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, loading = false, isDangerous = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity" onClick={onCancel}></div>

      {/* Dialog */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="relative inline-block align-bottom bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all border border-white border-opacity-10 sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          {/* Body */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl ${
                  isDangerous
                    ? 'bg-gradient-to-br from-red-500 to-pink-500'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                }`}
              >
                {isDangerous ? (
                  <Trash2 className="h-6 w-6 text-white" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <div className="mt-2">
                  <p className="text-sm text-slate-300">{message}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-700 bg-opacity-50 border-t border-white border-opacity-10 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-bold text-slate-200 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg hover:bg-opacity-20 transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 ${
                isDangerous
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-slate-500 disabled:to-slate-600'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-500 disabled:to-slate-600'
              }`}
            >
              {loading ? '⌛ Processing...' : isDangerous ? '🗑️ Delete' : '✓ Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
