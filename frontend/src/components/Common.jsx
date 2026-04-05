import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative w-16 h-16">
        {/* Outer spinning circle */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-opacity-20 animate-spin"></div>
        {/* Inner pulsing circle */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-400 border-r-purple-400 animate-spin" style={{ animationDirection: 'reverse' }}></div>
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>
    </div>
  );
}

export function EmptyState({ message, title = 'No data found', description = 'Try adjusting your filters or check back later.' }) {
  // Support both message prop and title/description props for flexibility
  const displayTitle = message || title;
  const displayDescription = description;
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-6xl mb-4 animate-float">📭</div>
      <h3 className="text-xl font-bold bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent">{displayTitle}</h3>
      {displayDescription && <p className="text-slate-400 mt-2">{displayDescription}</p>}
    </div>
  );
}

export function ErrorBanner({ message = 'An error occurred. Please try again.', onRetry }) {
  return (
    <div className="bg-gradient-to-r from-red-500 bg-opacity-20 to-pink-500 bg-opacity-20 border border-red-400 border-opacity-50 rounded-xl p-4 flex items-center justify-between mb-4 backdrop-blur-sm animate-shake">
      <div className="flex items-center space-x-3">
        <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
        <p className="text-red-200">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-4 px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-all duration-300 transform hover:scale-105 flex-shrink-0"
        >
          Retry
        </button>
      )}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export function SuccessBanner({ message = 'Operation completed successfully!' }) {
  return (
    <div className="bg-gradient-to-r from-green-500 bg-opacity-20 to-emerald-500 bg-opacity-20 border border-green-400 border-opacity-50 rounded-xl p-4 flex items-center space-x-3 mb-4 backdrop-blur-sm animate-fade-in">
      <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
      <p className="text-green-200">{message}</p>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
