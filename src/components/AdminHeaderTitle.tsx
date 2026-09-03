import React from 'react'

export const AdminHeaderTitle: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      {/* Icono a la izquierda */}
      <img
        src="/logo.svg"
        alt="Círculo de Estudios Logo"
        className="w-8 h-8 object-contain shrink-0"
      />

      {/* Textos alineados a la izquierda */}
      <div className="flex flex-col text-left justify-center">
        <span className="text-sm font-bold text-white leading-tight">
          Círculo de Estudios
        </span>
        <span className="text-[11px] font-medium text-[#38bdf8] leading-tight mt-0.5">
          Luis María Grignion de Montfort
        </span>
      </div>
    </div>
  )
}