'use client'

import React from 'react'

export const CustomHeader: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'right',
        marginRight: '12px',
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
          color: '#38bdf8', // Azul resplandeciente (Sky blue) que resalta sobre fondo oscuro
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
        }}
      >
        Luis María Grignion de Montfort
      </span>
    </div>
  )
}