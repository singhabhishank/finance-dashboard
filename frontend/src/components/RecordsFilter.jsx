import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

export default function RecordsFilter({ onFilter, userRole }) {
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleReset = () => {
    setFilters({ type: '', category: '', startDate: '', endDate: '' });
    onFilter({ type: '', category: '', startDate: '', endDate: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter size={20} className="text-blue-600" />
        <h3 className="font-semibold text-gray-800">Filter Records</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            name="category"
            placeholder="e.g., Salary, Groceries"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
