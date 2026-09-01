'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'

export const CustomNav: React.FC = () => {
  const { user, logOut } = useAuth()
  const router = useRouter()

  const [hoverHome, setHoverHome] = useState(false)
  const [hoverEnsayos, setHoverEnsayos] = useState(false)
  const [hoverLogout, setHoverLogout] = useState(false)

  const autorQuery = user?.nombre || user?.email || ''
  const hrefMisEnsayos = autorQuery 
    ? `/ensayos?autor=${encodeURIComponent(autorQuery)}` 
    : '/ensayos'

  const handleLogout = async () => {
    try {
      await logOut()
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      window.location.href = '/'
    }
  }

  const baseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: '6px',
    textDecoration: 'none',
    backgroundColor: 'transparent',
    transition: 'all 0.2s ease-in-out',
    boxSizing: 'border-box',
    cursor: 'pointer',
  }

  const homeStyle: React.CSSProperties = {
    ...baseStyle,
    color: hoverHome ? '#ffffff' : '#e5e5e5',
    border: hoverHome ? '1px solid #ffffff' : '1px solid #404040',
    backgroundColor: hoverHome ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
  }

  const ensayosStyle: React.CSSProperties = {
    ...baseStyle,
    color: '#38bdf8',
    border: hoverEnsayos ? '1px solid #38bdf8' : '1px solid #0284c7',
    backgroundColor: hoverEnsayos ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
    boxShadow: hoverEnsayos ? '0 0 12px rgba(56, 189, 248, 0.15)' : 'none',
  }

  const logoutStyle: React.CSSProperties = {
    ...baseStyle,
    color: hoverLogout ? '#fca5a5' : '#f87171',
    border: hoverLogout ? '1px solid #f87171' : '1px solid #7f1d1d',
    backgroundColor: hoverLogout ? 'rgba(239, 68, 68, 0.12)' : 'transparent',
    boxShadow: hoverLogout ? '0 0 12px rgba(239, 68, 68, 0.15)' : 'none',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 16px' }}>
      {/* Botones principales de navegación cotidiana */}
      <Link
        href="/"
        style={homeStyle}
        onMouseEnter={() => setHoverHome(true)}
        onMouseLeave={() => setHoverHome(false)}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Volver al Inicio</span>
      </Link>

      <Link
        href={hrefMisEnsayos}
        style={ensayosStyle}
        onMouseEnter={() => setHoverEnsayos(true)}
        onMouseLeave={() => setHoverEnsayos(false)}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span>Ir a Mis Ensayos</span>
      </Link>

      {/* Separador y Footer del Nav */}
      <div style={{ marginTop: '24px', paddingTop: '12px', borderTop: '1px solid #ed6363' }}>
        <button
          type="button"
          onClick={handleLogout}
          style={logoutStyle}
          onMouseEnter={() => setHoverLogout(true)}
          onMouseLeave={() => setHoverLogout(false)}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  )
}