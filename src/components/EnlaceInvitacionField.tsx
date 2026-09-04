'use client'
import React from 'react'
import { useField } from '@payloadcms/ui'

export default function EnlaceInvitacionField({ path }: { path: string }) {
  const { value } = useField<string>({ path })

  if (!value) return null

  return (
    <div style={{ marginTop: '8px' }}>
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 500,
          color: '#38bdf8',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
      >
        <span>🔗 Abrir invitación en nueva pestaña</span>
      </a>
    </div>
  )
}