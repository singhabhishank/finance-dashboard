import React from 'react';
import { EmptyState } from './Common';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function RecentTransactions({ transactions = [] }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg border border-white border-opacity-10 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 border-b border-blue-500 border-opacity-30">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">📋 Recent Transactions</h2>
        </div>
        <div className="p-6">
          <EmptyState message="No recent transactions" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg border border-white border-opacity-10 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-3 bg-gradient-to-br from-blue-500 to-cyan-500 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
      
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 border-b border-blue-500 border-opacity-30 relative z-10">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">📋 Recent Transactions</h2>
      </div>

      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-sm">
          <thead className="bg-slate-700 bg-opacity-50 border-b border-white border-opacity-10 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left font-bold text-blue-300">📅 Date</th>
              <th className="px-6 py-3 text-left font-bold text-blue-300">📂 Category</th>
              <th className="px-6 py-3 text-left font-bold text-blue-300">📊 Type</th>
              <th className="px-6 py-3 text-right font-bold text-blue-300">💰 Amount</th>
              <th className="px-6 py-3 text-left font-bold text-blue-300">📝 Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white divide-opacity-10">
            {transactions.map((tx, idx) => (
              <tr 
                key={tx.id} 
                className="hover:bg-white hover:bg-opacity-5 transition-all duration-200 group/row transform hover:scale-[1.02]"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <td className="px-6 py-3 text-slate-300 group-hover/row:text-white transition-colors">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-xs font-semibold group-hover/row:shadow-lg group-hover/row:shadow-purple-500/50 transition-all">
                    {tx.category}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center space-x-2">
                    {tx.type === 'income' ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <TrendingUp size={16} className="text-green-400" />
                        <span className="text-green-400 font-bold">Income</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                        <TrendingDown size={16} className="text-red-400" />
                        <span className="text-red-400 font-bold">Expense</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 text-right font-bold">
                  <span className={tx.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                    {tx.type === 'income' ? '+' : '-'} ${Number(tx.amount || 0).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-3 text-slate-400 group-hover/row:text-slate-300 truncate transition-colors">
                  {tx.notes || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
