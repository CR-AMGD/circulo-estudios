'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Ensayo {
  id: string
  titulo: string
  resumen?: string
  contenido?: any
  fechaPublicacion?: string
  autor?: any
}

interface Props {
  ensayosPorAutor: Record<string, Ensayo[]>
}

// Función para extraer el nombre de autor sin importar si viene como string, objeto o array de la relación
function parseNombreAutor(autor: any): string {
  if (!autor) return 'Autor no especificado'
  if (typeof autor === 'string') return autor
  if (Array.isArray(autor)) {
    return autor
      .map((a) => (typeof a === 'object' && a !== null ? a.nombre || a.email || 'Autor' : String(a)))
      .join(', ')
  }
  if (typeof autor === 'object' && autor !== null) {
    return autor.nombre || autor.email || 'Autor'
  }
  return String(autor)
}

// Función auxiliar para extraer todo el texto del campo de contenido
function extraerTextoDeContenido(contenido: any): string {
  if (!contenido) return ''
  if (typeof contenido === 'string') return contenido
  try {
    return JSON.stringify(contenido)
  } catch {
    return ''
  }
}

export function ListaEnsayosAcordeon({ ensayosPorAutor }: Props) {
  const searchParams = useSearchParams()
  const autorParam = searchParams.get('autor')

  const [orden, setOrden] = useState<'desc' | 'asc'>('desc')
  const [busqueda, setBusqueda] = useState('')

  const toggleOrden = () => {
    setOrden((prev) => (prev === 'desc' ? 'asc' : 'desc'))
  }

  const query = busqueda.trim().toLowerCase()

  // Normalizar y agrupar ensayos por nombre de autor formateado
  const agrupadoNormalizado: Record<string, Ensayo[]> = {}

  Object.entries(ensayosPorAutor || {}).forEach(([key, items]) => {
    items.forEach((item) => {
      // Extraemos el nombre legible del autor desde el ítem o la clave
      const nombreNombre = parseNombreAutor(item.autor || key)
      if (!agrupadoNormalizado[nombreNombre]) {
        agrupadoNormalizado[nombreNombre] = []
      }
      agrupadoNormalizado[nombreNombre].push(item)
    })
  })

  // Filtrar y ordenar los ensayos por autor
  const autoresFiltrados = Object.entries(agrupadoNormalizado)
    .map(([autor, items]) => {
      const ensayosFiltrados = items.filter((item) => {
        if (!query) return true

        const tituloMatch = item.titulo?.toLowerCase().includes(query)
        const resumenMatch = item.resumen?.toLowerCase().includes(query)
        const autorMatch = autor.toLowerCase().includes(query)
        const contenidoTexto = extraerTextoDeContenido(item.contenido).toLowerCase()
        const contenidoMatch = contenidoTexto.includes(query)

        return tituloMatch || resumenMatch || autorMatch || contenidoMatch
      })

      // Ordenar cronológicamente
      const ensayosOrdenados = [...ensayosFiltrados].sort((a, b) => {
        const dateA = new Date(a.fechaPublicacion || 0).getTime()
        const dateB = new Date(b.fechaPublicacion || 0).getTime()
        return orden === 'desc' ? dateB - dateA : dateA - dateB
      })

      return {
        autor,
        items: ensayosOrdenados,
      }
    })
    .filter((grupo) => grupo.items.length > 0)

  return (
    <div className="space-y-6">
      {/* Barra superior de Controles: Búsqueda y Ordenamiento */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Campo de Búsqueda */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
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
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por título, contenido o autor..."
            className="w-full pl-9 pr-8 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#38bdf8] transition-colors font-sans"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-500 hover:text-neutral-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Botón de Ordenamiento */}
        <button
          onClick={toggleOrden}
          className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-mono text-neutral-300 hover:text-white transition-all duration-200 cursor-pointer whitespace-nowrap"
        >
          <span>Ordenar: {orden === 'desc' ? 'Más recientes' : 'Más antiguos'}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ease-in-out ${
              orden === 'asc' ? 'rotate-180' : 'rotate-0'
            }`}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </button>
      </div>

      {/* Lista de Acordeones */}
      {autoresFiltrados.length === 0 ? (
        <div className="p-8 text-center bg-neutral-900/40 border border-neutral-800/60 rounded-lg space-y-1">
          <p className="text-sm text-neutral-300 font-medium">
            No se encontraron ensayos que coincidan con &quot;{busqueda}&quot;
          </p>
          <p className="text-xs text-neutral-500">
            Intenta con otras palabras clave o el nombre del autor.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {autoresFiltrados.map(({ autor, items }) => {
            const esAutorSeleccionado = autorParam && autor.toLowerCase() === autorParam.toLowerCase()
            const debeEstarAbierto = query.length > 0 || esAutorSeleccionado

            return (
              <details
                key={autor}
                open={debeEstarAbierto ? true : undefined}
                className="group border border-neutral-800 rounded-lg bg-neutral-900 overflow-hidden transition-all duration-200"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer select-none hover:bg-neutral-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="text-[#38bdf8]"
                    >
                      <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                      <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                    </svg>
                    <h2 className="text-lg font-semibold text-[#38bdf8]">
                      {autor}
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 font-mono">
                      {items.length} {items.length === 1 ? 'ensayo' : 'ensayos'}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-800 group-open:bg-neutral-700 text-neutral-300 transition-transform duration-200 group-open:rotate-180">
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
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </summary>

                <div className="border-t border-neutral-800 divide-y divide-neutral-800 bg-neutral-950">
                  {items.map((item) => {
                    const fechaFormateada = new Date(
                      item.fechaPublicacion || Date.now()
                    ).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })

                    return (
                      <Link
                        key={item.id}
                        href={`/ensayos/${item.id}`}
                        className="p-4 hover:bg-neutral-900/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group/item block"
                      >
                        <div className="space-y-1">
                          <h3 className="text-base font-medium text-white group-hover/item:text-[#38bdf8] transition-colors">
                            {item.titulo}
                          </h3>
                          {item.resumen && (
                            <p className="text-xs text-neutral-400 line-clamp-2">
                              {item.resumen}
                            </p>
                          )}
                        </div>

                        <time className="text-[11px] text-neutral-500 font-mono whitespace-nowrap self-start sm:self-center">
                          {fechaFormateada}
                        </time>
                      </Link>
                    )
                  })}
                </div>
              </details>
            )
          })}
        </div>
      )}
    </div>
  )
}