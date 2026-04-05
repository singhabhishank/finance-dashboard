import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function SummaryCard({ title, value, amount, type, icon }) {
  // Support both value and amount props for flexibility
  const displayValue = value !== undefined ? value : amount;
  
  const formatCurrency = (num) => {
    const numValue = Number(num) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  const getGradient = () => {
    switch (type) {
      case 'income':
        return 'from-green-500 via-emerald-500 to-teal-600';
      case 'expense':
        return 'from-red-500 via-pink-500 to-rose-600';
      case 'balance':
        return 'from-blue-500 via-purple-500 to-indigo-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getIcon = () => {
    // Use emoji icon if provided
    if (icon) {
      return <span className="text-4xl">{icon}</span>;
    }
    
    switch (type) {
      case 'income':
        return <TrendingUp size={28} />;
      case 'expense':
        return <TrendingDown size={28} />;
      case 'balance':
        return <DollarSign size={28} />;
      default:
        return <DollarSign size={28} />;
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getGradient()} rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-white border-opacity-20 transition-all duration-300 transform hover:scale-105 group overflow-hidden relative`}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white text-sm font-semibold opacity-90 uppercase tracking-wide">{title}</p>
          <div className="text-white opacity-80 group-hover:opacity-100 transition-opacity">
            {getIcon()}
          </div>
        </div>
        <p className="text-4xl font-bold text-white mb-2">{formatCurrency(displayValue)}</p>
        <div className="h-1 w-12 bg-white bg-opacity-40 rounded-full group-hover:w-full transition-all duration-300"></div>
      </div>
    </div>
  );
}
