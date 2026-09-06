'use client';

import React, { useState, useEffect } from 'react';

export const AdminHeaderTitle: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkResponsive = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkResponsive();
    window.addEventListener('resize', checkResponsive);

    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  const logoSize = isMobile ? '120px' : '280px';
  const logoMarginBottom = isMobile ? '8px' : '4px';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      width: '100%',
      margin: '0 auto',
      paddingBottom: '4px',
      paddingTop: isMobile ? '16px' : '4px',
    }}>
      <img
        src="/dieu_de_roi-removebg-preview.png"
        alt="Círculo de Estudios Logo"
        style={{
          width: logoSize,
          height: logoSize,
          objectFit: 'contain',
          marginBottom: logoMarginBottom,
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          transition: 'all 0.3s ease-in-out',
        }}
      />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '400px',
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
  );
};