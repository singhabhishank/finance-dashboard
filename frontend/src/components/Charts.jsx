import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { EmptyState } from './Common';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

export function IncomeExpenseChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-6 border border-white border-opacity-10">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">📊 Monthly Trends</h2>
        <EmptyState message="No monthly data available" />
      </div>
    );
  }

  const chartData = data.map((item) => ({
    month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    income: Number(item.income) || 0,
    expense: Number(item.expense) || 0,
    balance: (Number(item.income) || 0) - (Number(item.expense) || 0),
  }));

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg hover:shadow-2xl p-6 border border-white border-opacity-10 transition-all duration-300 group overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-blue-500 to-cyan-500 transition-opacity duration-300 rounded-2xl"></div>
      <div className="relative z-10">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
          📊 Monthly Trends
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip 
              formatter={(value) => `$${value.toFixed(0)}`}
              contentStyle={{ backgroundColor: 'rgba(30,30,40,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white' }}
            />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CategoryBudgetChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-6 border border-white border-opacity-10">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">🥜 Category Breakdown</h2>
        <EmptyState message="No category data available" />
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.category,
    value: Number(item.total) || 0,
  }));

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg hover:shadow-2xl p-6 border border-white border-opacity-10 transition-all duration-300 group overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-purple-500 to-pink-500 transition-opacity duration-300 rounded-2xl"></div>
      <div className="relative z-10">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
          🥜 Category Breakdown
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `$${value.toFixed(0)}`}
              contentStyle={{ backgroundColor: 'rgba(30,30,40,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
