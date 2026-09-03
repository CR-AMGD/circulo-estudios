import React from 'react'

export const AdminHeaderTitle: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      width: '100%',
      margin: '0 auto',
      paddingBottom: '4px'
    }}>
      {/* Icono del corazón a 280px */}
      <img
        src="/dieu_de_roi-removebg-preview.png"
        alt="Círculo de Estudios Logo"
        style={{
          width: '280px',
          height: '280px',
          objectFit: 'contain',
          marginBottom: '4px', // Reducido para acercar el texto de manera sutil
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      />

      {/* Textos institucionales organizados */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }}>
        <div style={{
          fontSize: '17px',
          fontWeight: '700',
          color: '#ffffff',
          lineHeight: '1.3',
          letterSpacing: '0.5px'
        }}>
          Círculo de Estudios
        </div>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#38bdf8',
          lineHeight: '1.3',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginTop: '2px'
        }}>
          Luis María Grignion de Montfort
        </div>
      </div>
    </div>
  )
}