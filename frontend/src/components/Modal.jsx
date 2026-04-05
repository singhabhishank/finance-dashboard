import React from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, title, children, onClose, onSave, saveText = 'Save', loading = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="relative inline-block align-bottom bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all border border-white border-opacity-10 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-cyan-600 border-b border-blue-500 border-opacity-30 px-6 py-4">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button onClick={onClose} className="text-slate-200 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 max-h-96 overflow-y-auto">{children}</div>

          {/* Footer */}
          {onSave && (
            <div className="bg-slate-700 bg-opacity-50 border-t border-white border-opacity-10 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-bold text-slate-200 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg hover:bg-opacity-20 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={loading}
                className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-500 disabled:to-slate-600 transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                {loading ? '⌛ Processing...' : saveText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
