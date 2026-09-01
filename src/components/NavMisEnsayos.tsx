'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@payloadcms/ui'

export const NavMisEnsayos: React.FC = () => {
  const { user } = useAuth()

  // Ocultar si no hay usuario o si es administrador
  if (!user || user.rol === 'admin') return null

  return (
    <div style={{ marginTop: '0.5rem', padding: '0 0.5rem', width: '100%' }}>
      <Link
        href="/ensayos" /* <--- Apunta a la página pública del frontend de Next.js */
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: '100%',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          backgroundColor: '#171717',
          border: '1px solid #0284c7',
          color: '#38bdf8',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          boxSizing: 'border-box',
          transition: 'all 0.2s ease-in-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#0c4a6e'
          e.currentTarget.style.borderColor = '#38bdf8'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#171717'
          e.currentTarget.style.borderColor = '#0284c7'
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9" />
          <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
        </svg>
        <span>Ir a Mis Ensayos</span>
      </Link>
    </div>
  )
}