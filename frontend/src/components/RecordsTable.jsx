import React from 'react';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { EmptyState } from './Common';

export default function RecordsTable({ records, loading, error, userRole, onEdit, onDelete }) {
  const isAdmin = userRole === 'admin';

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

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <EmptyState title="No records found" description="No financial records match your filters" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Notes</th>
              {isAdmin && <th className="px-6 py-3 text-center font-semibold text-gray-700">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3 text-gray-600">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {record.category}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center space-x-1">
                    {record.type === 'income' ? (
                      <>
                        <TrendingUp size={16} className="text-green-600" />
                        <span className="text-green-600 font-semibold">Income</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown size={16} className="text-red-600" />
                        <span className="text-red-600 font-semibold">Expense</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 text-right font-semibold">
                  <span className={record.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {record.type === 'income' ? '+' : '-'} ${parseFloat(record.amount).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-600 truncate max-w-xs">{record.notes || '-'}</td>
                {isAdmin && (
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => onEdit(record)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded transition"
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
  );
}
