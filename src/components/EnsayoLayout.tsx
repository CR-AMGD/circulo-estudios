'use client'

import React, { useState } from 'react'

interface Props {
  children: React.ReactNode
  sidebarContent: React.ReactNode
  tieneMetadata: boolean
}

export function EnsayoLayout({ children, sidebarContent, tieneMetadata }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Si no hay metadata alguna en la base de datos, mostramos siempre centrado
  if (!tieneMetadata) {
    return (
      <div className="max-w-3xl mx-auto w-full transition-all duration-300">
        {children}
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Botón flotante para Ocultar / Mostrar Panel Lateral */}
      <div className="hidden lg:flex justify-end mb-4">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-400 hover:text-white transition-all duration-200 cursor-pointer"
          title={sidebarOpen ? 'Ocultar panel para lectura centrada' : 'Mostrar contexto y debate'}
        >
          {sidebarOpen ? (
            <>
              {/* Ícono Ojo Cerrado / Flecha Expandir */}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              <span>Centrar lectura</span>
            </>
          ) : (
            <>
              {/* Ícono Ojo Abierto / Mostrar Panel */}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="text-[#38bdf8]">Ver contexto</span>
            </>
          )}
        </button>
      </div>

      {/* Contenedor Grid con transición suave */}
      <div
        className={`grid grid-cols-1 transition-all duration-300 ease-in-out gap-10 items-start ${
          sidebarOpen ? 'lg:grid-cols-3 max-w-6xl mx-auto' : 'max-w-3xl mx-auto'
        }`}
      >
        {/* Columna Principal de Lectura */}
        <main
          className={`space-y-8 transition-all duration-300 ${
            sidebarOpen ? 'lg:col-span-2' : 'w-full'
          }`}
        >
          {children}
        </main>

        {/* Panel Lateral */}
        {sidebarOpen && (
          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-8 transition-all duration-300">
            {sidebarContent}
          </aside>
        )}
      </div>
    </div>
  )
}