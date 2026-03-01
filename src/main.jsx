import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#E8360D', backgroundColor: '#F2EDE4', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '2px' }}>Something went wrong</h1>
          <pre style={{ marginTop: '1rem', color: '#0A0A0A', fontSize: '0.8rem' }}>{this.state.error && this.state.error.toString()}</pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '2rem', padding: '1rem 2rem', background: '#0A0A0A', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'monospace' }}>RELOAD</button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
      <App />
  </ErrorBoundary>,
)
