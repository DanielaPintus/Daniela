import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';

const Platform = lazy(() => import('./App.jsx'));

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #f5f0e7 0%, #eef4ed 48%, #f7faf8 100%)',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          padding: '28px 24px',
          borderRadius: '28px',
          background: 'rgba(255,255,255,0.86)',
          border: '1px solid rgba(17,24,39,0.08)',
          boxShadow: '0 28px 64px rgba(17,24,39,0.10)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 16px',
            borderRadius: '50%',
            border: '3px solid rgba(24,58,46,0.12)',
            borderTopColor: '#183a2e',
            boxShadow: '0 0 0 6px rgba(24,58,46,0.06)',
          }}
        />
        <div style={{ fontSize: '20px', fontWeight: 700, color: '#183a2e', marginBottom: '8px' }}>D2 One</div>
        <div style={{ fontSize: '13px', color: '#55636f', lineHeight: 1.5 }}>
          Je premium coachplatform wordt voorbereid.
        </div>
      </div>
    </div>
  );
}

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('[D2 ONE] Runtime error boundary:', error);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #f5f0e7 0%, #eef4ed 48%, #f7faf8 100%)',
          padding: '24px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            padding: '28px 24px',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(17,24,39,0.08)',
            boxShadow: '0 22px 50px rgba(17,24,39,0.12)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#183a2e', marginBottom: '8px' }}>
            D2 ONE
          </div>
          <div style={{ fontSize: '14px', color: '#55636f', lineHeight: 1.6, marginBottom: '16px' }}>
            Er ging iets mis bij het laden van de app. Vernieuw de pagina om opnieuw te starten.
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              border: 'none',
              borderRadius: '12px',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 700,
              background: '#183a2e',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Opnieuw laden
          </button>
        </div>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Platform />
      </Suspense>
    </AppErrorBoundary>
  </React.StrictMode>
);
