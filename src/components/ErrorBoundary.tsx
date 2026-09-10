import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShoppingBag } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          id="error-boundary-fallback"
          className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4"
        >
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-[#EB3B5A]">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Oops! Kuch Der Ke Liye Rukna Pada
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Koi choti si takniki dikkat aayi hai, par aapka cart aur data bilkul safe hai. Niche click karke wapas shuru karein:
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                id="btn-error-reload"
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#EB3B5A] to-[#FF6B81] hover:brightness-105 text-white font-black text-sm shadow-md transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Karein</span>
              </button>
              <button
                type="button"
                id="btn-error-home"
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Home Par Jayein</span>
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs font-semibold text-gray-400">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Amazon Affiliate Curated Store</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
