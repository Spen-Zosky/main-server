import React from 'react'

function SimpleLanding() {
  return (
    <div style={{ 
      padding: '40px 20px', 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          color: '#1e293b', 
          fontSize: '2.5rem', 
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🚀 Main Server Platform
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.2rem', margin: '0' }}>
          Sistema Enterprise Completo - AI-HRMS | NOSE | Web-Hunter
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ color: '#1976d2', marginTop: '0' }}>🤖 AI-HRMS</h3>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>
            Sistema intelligente per la gestione delle risorse umane con AI integrata.
          </p>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ color: '#388e3c', marginTop: '0' }}>🔍 NOSE</h3>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>
            Assistente per ricerca scientifica, umanistica e industriale.
          </p>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ color: '#f57c00', marginTop: '0' }}>🕷️ Web-Hunter</h3>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>
            Framework per acquisizione dati e machine learning.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{ 
            padding: '12px 24px', 
            background: '#1976d2', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '1rem',
            cursor: 'pointer', 
            margin: '10px',
            boxShadow: '0 4px 6px rgba(25,118,210,0.3)'
          }}
        >
          🔐 Accedi
        </button>
        <button 
          onClick={() => window.location.href = '/register'}
          style={{ 
            padding: '12px 24px', 
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '1rem',
            cursor: 'pointer', 
            margin: '10px',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}
        >
          📝 Registrati
        </button>
        <button 
          onClick={() => window.location.href = '/service-manager'}
          style={{ 
            padding: '12px 24px', 
            background: '#388e3c', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '1rem',
            cursor: 'pointer', 
            margin: '10px',
            boxShadow: '0 4px 6px rgba(56,142,60,0.3)'
          }}
        >
          ⚙️ Service Manager
        </button>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#1e293b', marginTop: '0' }}>📊 System Status</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ color: '#059669' }}>✅ Frontend: Online</div>
          <div style={{ color: '#059669' }}>✅ Backend: Online</div>
          <div style={{ color: '#059669' }}>✅ Database: Connected</div>
          <div style={{ color: '#059669' }}>✅ JWT Auth: Active</div>
        </div>
      </div>

      <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
        <p>© 2025 enzospenuso.com - Main Server Platform v1.0.0</p>
        <p>🌐 Accesso Pubblico: http://79.72.47.188:5173</p>
      </div>
    </div>
  )
}

export default SimpleLanding