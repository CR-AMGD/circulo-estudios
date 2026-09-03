'use client'

import React from 'react'

export const CustomHeader: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginRight: '12px',
      }}
    >
      {/* Icono a la izquierda */}
      <img
        src="/logo.svg"
        alt="Círculo de Estudios Logo"
        style={{
          width: '28px',
          height: '28px',
          objectFit: 'contain',
          flexShrink: 0,
        }}
      />

      {/* Bloque de texto alineado a la izquierda */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'left',
          lineHeight: '1.2',
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: '13px',
            color: 'var(--theme-elevation-900)',
            whiteSpace: 'nowrap',
          }}
        >
          Círculo de Estudios
        </span>
        <span
          style={{
            fontWeight: 500,
            fontSize: '11px',
            color: '#38bdf8',
            whiteSpace: 'nowrap',
            letterSpacing: '0.01em',
          }}
        >
          Luis María Grignion de Montfort
        </span>
      </div>
    </div>
  )
}