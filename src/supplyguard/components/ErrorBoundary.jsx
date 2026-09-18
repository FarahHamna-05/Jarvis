import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[SupplyGuard ErrorBoundary] Caught error:', error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      try {
        const url = new URL(window.location);
        url.searchParams.set('tab', 'dashboard');
        window.history.pushState({}, '', url);
        window.location.reload();
      } catch (e) {
        window.location.reload();
      }
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 text-[#E51A24] flex items-center justify-center mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">View Recovered Safely</h3>
          <p className="text-sm text-slate-500 max-w-md mb-6">
            A temporary component rendering anomaly was intercepted. All telemetry and operational data remain safe.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-[#E51A24] text-white text-xs font-semibold rounded-xl hover:bg-[#c9141d] shadow-sm transition"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition"
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
