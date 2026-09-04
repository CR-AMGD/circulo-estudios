'use client'
import React, { useState } from 'react'

export default function CustomLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (res.ok) {
        window.location.href = '/admin'
      } else {
        setError(data.message || 'Credenciales inválidas. Inténtalo de nuevo.')
      }
    } catch {
      setError('Error de conexión al iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0b0b0b', zIndex: 9999, overflowY: 'auto', padding: '20px', boxSizing: 'border-box' }}>
      
      {/* Cabecera institucional */}
      <div style={{ textAlign: 'center', marginBottom: '24px', width: '100%', maxWidth: '480px' }}>
        <img
          src="/dieu_de_roi-removebg-preview.png"
          alt="Círculo de Estudios Logo"
          style={{
            width: '240px',
            height: '240px',
            objectFit: 'contain',
            marginBottom: '8px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        />
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', lineHeight: '1.3', letterSpacing: '0.5px' }}>
          Círculo de Estudios
        </div>
        <div style={{ fontSize: '11px', fontWeight: '600', color: '#38bdf8', lineHeight: '1.3', letterSpacing: '1.2px', textTransform: 'uppercase', marginTop: '4px' }}>
          Luis María Grignion de Montfort
        </div>
      </div>

      {/* Tarjeta contenedora amplia */}
      <div style={{ maxWidth: '480px', width: '100%', padding: '40px', background: '#141414', borderRadius: '10px', border: '1px solid #222', boxShadow: '0 20px 40px rgba(0,0,0,0.7)', boxSizing: 'border-box' }}>
        <h2 style={{ marginBottom: '6px', fontSize: '18px', fontWeight: 600, color: '#fff' }}>Iniciar Sesión</h2>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '28px', lineHeight: '1.5' }}>
          Ingresa tus credenciales para acceder al panel de administración.
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '8px', color: '#ccc' }}>
              Email <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 14px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '8px', color: '#ccc' }}>
              Password <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 42px 12px 14px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#fff', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center', padding: '4px' }}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '24px', textAlign: 'right' }}>
            <a href="/admin/forgot" style={{ fontSize: '12px', color: '#38bdf8', textDecoration: 'none' }}>
              ¿Olvidaste la contraseña?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '13px', background: '#f5f5f5', color: '#111', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px', transition: 'background 0.2s' }}
          >
            {loading ? 'Iniciando sesión...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}