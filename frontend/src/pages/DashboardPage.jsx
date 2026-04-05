import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { dashboardAPI } from '../services/api';
import { LoadingSpinner, ErrorBanner } from '../components/Common';
import SummaryCard from '../components/SummaryCard';
import RecentTransactions from '../components/RecentTransactions';
import { IncomeExpenseChart, CategoryBudgetChart } from '../components/Charts';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardAPI.getSummary();
      setSummary(data || {
        total_income: 0,
        total_expense: 0,
        balance: 0,
        recent_transactions: [],
        monthly_data: [],
        category_breakdown: [],
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data. Please try again.');
      setSummary({
        total_income: 0,
        total_expense: 0,
        balance: 0,
        recent_transactions: [],
        monthly_data: [],
        category_breakdown: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-5 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-32 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        {error && <ErrorBanner message={error} onRetry={fetchSummary} />}

        {/* Header with gradient text */}
        <div className="mb-8 relative z-10 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            💰 Finance Dashboard
          </h1>
          <p className="text-xl text-slate-300">Welcome back! Here's your financial overview.</p>
        </div>

        {/* Summary Cards - Staggered Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
          <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
            <SummaryCard
              title="Total Income"
              amount={summary?.total_income || 0}
              type="income"
              icon="💰"
            />
          </div>
          <div className="animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
            <SummaryCard
              title="Total Expenses"
              amount={summary?.total_expense || 0}
              type="expense"
              icon="💸"
            />
          </div>
          <div className="animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
            <SummaryCard
              title="Balance"
              amount={summary?.balance || 0}
              type="balance"
              icon="💵"
            />
          </div>
        </div>

        {/* Charts Section - Staggered Animation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 relative z-10">
          <div className="animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
            <IncomeExpenseChart data={summary?.monthly_data || []} />
          </div>
          <div className="animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
            <CategoryBudgetChart data={summary?.category_breakdown || []} />
          </div>
        </div>

        {/* Recent Transactions - Staggered Animation */}
        <div className="relative z-10 animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
          <RecentTransactions transactions={summary?.recent_transactions || []} />
        </div>
      </div>

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
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
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
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
