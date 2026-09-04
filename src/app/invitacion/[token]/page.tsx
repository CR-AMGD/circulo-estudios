'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function PaginaInvitacionGeneral() {
  const router = useRouter()
  const params = useParams()
  const token = params?.token as string

  const [valida, setValida] = useState(false)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombreAutor, setNombreAutor] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return

    fetch(`/api/invitaciones/validar?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valido) {
          setValida(true)
        } else {
          setError(data.mensaje || 'El enlace no es válido o las inscripciones están cerradas.')
        }
      })
      .catch(() => setError('Error de conexión al validar el enlace.'))
      .finally(() => setLoading(false))
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/invitaciones/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password, nombreAutor }),
      })

      const data = await res.json()
      if (res.ok) {
        router.push('/admin/login?registrado=true')
      } else {
        setError(data.error || 'No se pudo completar el registro.')
      }
    } catch {
      setError('Error al procesar el formulario.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0b0b', color: '#888' }}>
        <p style={{ fontSize: '14px', fontWeight: 500 }}>Verificando enlace de invitación...</p>
      </div>
    )
  }

  if (!valida) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0b0b', padding: '20px' }}>
        <div style={{ maxWidth: '420px', width: '100%', padding: '32px', textAlign: 'center', background: '#141414', borderRadius: '8px', border: '1px solid #222' }}>
          <h2 style={{ color: '#ef4444', fontSize: '18px', marginBottom: '12px', fontWeight: 600 }}>Inscripciones Cerradas</h2>
          <p style={{ color: '#888', fontSize: '13px', lineHeight: '1.5' }}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0b0b0b', padding: '20px', color: '#fff' }}>
      
      {/* Cabecera idéntica al AdminHeaderTitle */}
      <div style={{ textAlign: 'center', marginBottom: '24px', width: '100%', maxWidth: '420px' }}>
        <img
          src="/dieu_de_roi-removebg-preview.png"
          alt="Círculo de Estudios Logo"
          style={{
            width: '120px',
            height: '120px',
            objectFit: 'contain',
            marginBottom: '4px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        />
        <div style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff', lineHeight: '1.3', letterSpacing: '0.5px' }}>
          Círculo de Estudios
        </div>
        <div style={{ fontSize: '11px', fontWeight: '600', color: '#38bdf8', lineHeight: '1.3', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>
          Luis María Grignion de Montfort
        </div>
      </div>

      {/* Tarjeta de Registro */}
      <div style={{ maxWidth: '420px', width: '100%', padding: '32px', background: '#141414', borderRadius: '8px', border: '1px solid #222', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <h2 style={{ marginBottom: '6px', fontSize: '16px', fontWeight: 600, color: '#fff' }}>Registro de Colaborador</h2>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '24px', lineHeight: '1.4' }}>
          Completa tus datos para unirte a la plataforma y comenzar a redactar o investigar.
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px 14px', borderRadius: '6px', marginBottom: '18px', fontSize: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px', color: '#ccc' }}>
              Correo Electrónico <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', fontSize: '13px', outline: 'none', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px', color: '#ccc' }}>
              Firma o Nombre de Autor <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Ej. Juan Pérez"
              value={nombreAutor}
              onChange={(e) => setNombreAutor(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', fontSize: '13px', outline: 'none', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '6px', color: '#ccc' }}>
              Contraseña <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', fontSize: '13px', outline: 'none', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '11px', background: '#f5f5f5', color: '#111', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'background 0.2s' }}
          >
            {loading ? 'Registrando...' : 'Completar Registro'}
          </button>
        </form>
      </div>
    </div>
  )
}