import React from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    console.error('ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
            </div>
            <p className="text-gray-600 mb-4">An error occurred while rendering this page.</p>
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded font-mono break-words mb-4">
              {this.state.error?.toString()}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
