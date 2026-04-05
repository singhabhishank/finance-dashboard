import React from 'react';
import { EmptyState } from './Common';

export default function MonthlyChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Overview</h2>
        <EmptyState message="No monthly data available" />
      </div>
    );
  }

  // Find max value for scaling - ensure values are numbers
  const maxValue = Math.max(
    ...data.map((m) => Math.max(Number(m.income) || 0, Number(m.expense) || 0)),
    1000
  );

  const getBarHeight = (value) => {
    const numValue = Number(value) || 0;
    return numValue ? `${(numValue / maxValue) * 100}%` : '0%';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Overview</h2>

      <div className="space-y-4">
        {data.map((month) => (
          <div key={month.month} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700 w-20">
                {new Date(month.month).toLocaleDateString('en-US', { year: '2-digit', month: 'short' })}
              </span>
              <div className="flex-1 flex items-end space-x-2 ml-4 h-12">
                {/* Income Bar */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-8 bg-green-400 rounded-t transition-all hover:bg-green-500" style={{ height: getBarHeight(Number(month.income) || 0) }}></div>
                  <span className="text-xs text-gray-600 mt-1">${Number(month.income || 0).toFixed(0)}</span>
                </div>

                {/* Expense Bar */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-8 bg-red-400 rounded-t transition-all hover:bg-red-500" style={{ height: getBarHeight(Number(month.expense) || 0) }}></div>
                  <span className="text-xs text-gray-600 mt-1">${Number(month.expense || 0).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-6 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-400 rounded"></div>
          <span className="text-sm text-gray-600">Income</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-400 rounded"></div>
          <span className="text-sm text-gray-600">Expense</span>
        </div>
      </div>
    </div>
  );
}
