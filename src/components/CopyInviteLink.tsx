'use client'
import React, { useState } from 'react'
import { useFormFields } from '@payloadcms/ui'

export default function CopyInviteLink() {
  const [copied, setCopied] = useState(false)
  
  // Obtenemos el campo 'token' del formulario actual en tiempo real
  const tokenField = useFormFields(([fields]) => fields.token)
  const token = tokenField?.value || 'acceso-general-colaboradores'

  // Construimos la URL base de forma dinámica o con fallback seguro
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const inviteUrl = `${baseUrl}/invitacion/${token}`

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div style={{ marginBottom: '1.5rem', padding: '16px', background: 'var(--theme-elevation-50)', border: '1px solid var(--theme-elevation-150)', borderRadius: '8px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--theme-elevation-800)' }}>
        Enlace de Invitación para Compartir (WhatsApp / Grupo)
      </label>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          readOnly
          value={inviteUrl}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: 'var(--theme-elevation-0)',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: '6px',
            fontSize: '13px',
            color: 'var(--theme-text)',
            outline: 'none'
          }}
        />
        
        <button
          type="button"
          onClick={handleCopy}
          style={{
            background: copied ? '#10b981' : 'var(--theme-elevation-800)',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            transition: 'background 0.2s ease'
          }}
        >
          {copied ? '¡Copiado!' : 'Copiar Enlace'}
        </button>
      </div>
      <span style={{ display: 'block', fontSize: '11px', color: 'var(--theme-elevation-500)', marginTop: '6px' }}>
        Comparte este enlace en el grupo. Cualquier colaborador podrá registrarse mientras el interruptor esté activo.
      </span>
    </div>
  )
}