import React from 'react'

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🚀 Test React App</h1>
      <p>Se vedi questo messaggio, React sta funzionando correttamente!</p>
      <p>Data: {new Date().toLocaleString()}</p>
      <div style={{ background: '#e8f5e8', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
        ✅ Frontend React attivo
      </div>
      <div style={{ background: '#f0f8ff', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
        📍 URL: http://79.72.47.188:5173
      </div>
      <button 
        onClick={() => window.location.href = '/login'}
        style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', margin: '5px' }}
      >
        Vai al Login
      </button>
      <button 
        onClick={() => window.location.href = '/register'}
        style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', margin: '5px' }}
      >
        Vai alla Registrazione
      </button>
    </div>
  )
}

export default TestApp