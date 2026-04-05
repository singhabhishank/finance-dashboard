import React from 'react';

export default function CategoryBreakdown({ data }) {
  const formatCurrency = (num) => {
    const numValue = Number(num) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  const maxTotal = Math.max(...data.map((d) => Number(d.total) || 0));

  const getBarColor = (index) => {
    const colors = [
      'bg-indigo-600',
      'bg-blue-600',
      'bg-cyan-600',
      'bg-teal-600',
      'bg-green-600',
      'bg-emerald-600',
      'bg-lime-600',
      'bg-yellow-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Category Breakdown</h2>

      {data.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No category data available</p>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-700 truncate">
                {item.category}
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${getBarColor(index)} transition-all`}
                    style={{
                      width: `${
                        maxTotal > 0 ? (Number(item.total) / maxTotal) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="w-24 text-right text-sm font-medium text-gray-900">
                {formatCurrency(item.total)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
