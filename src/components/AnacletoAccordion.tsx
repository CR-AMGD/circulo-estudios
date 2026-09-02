'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface CategoriaObj {
  id: string
  nombre?: string
  slug?: string
}

interface Ensayo {
  id: string
  titulo: string
  autor?: string
  resumen?: string
  contenido?: any
  categoria?: string | CategoriaObj | (string | CategoriaObj)[]
  fechaPublicacion?: string
}

interface AnacletoAccordionProps {
  ensayos: Ensayo[]
}

const SECCIONES = [
  { key: 'ensayos-y-discursos', title: 'Ensayos y discursos' },
  { key: 'la-cuestion-religiosa-en-jalisco', title: 'La cuestión religiosa en Jalisco' },
  { key: 'el-plebiscito-de-los-martires', title: 'El plebiscito de los mártires' },
  { key: 'tu-seras-rey', title: 'Tú serás Rey' },
]

function extraerTextoDeContenido(contenido: any): string {
  if (!contenido) return ''
  if (typeof contenido === 'string') return contenido
  try {
    return JSON.stringify(contenido)
  } catch {
    return ''
  }
}

export const AnacletoAccordion: React.FC<AnacletoAccordionProps> = ({ ensayos }) => {
  // Cambiado de 'desc' a 'asc' para que empiece por defecto en "Más antiguos"
  const [orden, setOrden] = useState<'desc' | 'asc'>('asc')
  const [busqueda, setBusqueda] = useState('')

  const toggleOrden = () => {
    setOrden((prev) => (prev === 'desc' ? 'asc' : 'desc'))
  }

  const query = busqueda.trim().toLowerCase()

  const seccionesProcesadas = SECCIONES.map((seccion) => {
    const itemsSeccion = ensayos.filter((e) => {
      if (!e.categoria) return false

      const coincideSeccion = (cat: any) => {
        if (!cat) return false
        if (typeof cat === 'object') {
          return cat.slug === seccion.key || cat.id === seccion.key || cat.nombre?.toLowerCase() === seccion.title.toLowerCase()
        }
        return String(cat) === seccion.key
      }

      if (Array.isArray(e.categoria)) {
        return e.categoria.some(coincideSeccion)
      }

      return coincideSeccion(e.categoria)
    })

    const itemsFiltrados = itemsSeccion.filter((item) => {
      if (!query) return true

      const tituloMatch = item.titulo?.toLowerCase().includes(query)
      const resumenMatch = item.resumen?.toLowerCase().includes(query)
      const contenidoTexto = extraerTextoDeContenido(item.contenido).toLowerCase()
      const contenidoMatch = contenidoTexto.includes(query)

      return tituloMatch || resumenMatch || contenidoMatch
    })

    const itemsOrdenados = [...itemsFiltrados].sort((a, b) => {
      const dateA = new Date(a.fechaPublicacion || 0).getTime()
      const dateB = new Date(b.fechaPublicacion || 0).getTime()
      return orden === 'desc' ? dateB - dateA : dateA - dateB
    })

    return {
      ...seccion,
      items: itemsOrdenados,
      totalOriginal: itemsSeccion.length,
    }
  })

  const hayResultados = seccionesProcesadas.some((sec) => sec.items.length > 0)

  return (
    <div className="space-y-6">
      {/* Barra de Controles */}
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
            placeholder="Buscar por título o contenido..."
            className="w-full pl-9 pr-8 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors font-sans"
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

        {/* Botón de Ordenamiento (Inicia en "Más antiguos ↑") */}
        <button
          onClick={toggleOrden}
          className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-mono text-neutral-300 hover:text-white transition-all duration-200 cursor-pointer whitespace-nowrap self-end sm:self-auto"
        >
          <span>Ordenar: {orden === 'asc' ? 'Más antiguos' : 'Más recientes'}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fbbf24"
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

      {/* Mensaje de no resultados al buscar */}
      {query && !hayResultados ? (
        <div className="p-8 text-center bg-neutral-900/40 border border-neutral-800/60 rounded-lg space-y-1">
          <p className="text-sm text-neutral-300 font-medium">
            No se encontraron escritos que coincidan con &quot;{busqueda}&quot;
          </p>
          <p className="text-xs text-neutral-500">
            Intenta con otros términos de búsqueda.
          </p>
        </div>
      ) : (
        /* Lista de Acordeones */
        <div className="space-y-4">
          {seccionesProcesadas.map((seccion) => {
            const debeEstarAbierto = query.length > 0

            if (query.length > 0 && seccion.items.length === 0) return null

            return (
              <details
                key={seccion.key}
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
                      className="text-amber-400"
                    >
                      <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                      <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                    </svg>

                    <h2 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {seccion.title}
                    </h2>

                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                      {seccion.items.length} {seccion.items.length === 1 ? 'escrito' : 'escritos'}
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
                  {seccion.items.length === 0 ? (
                    <p className="p-4 text-xs text-neutral-500 italic">
                      Aún no hay textos añadidos a esta categoría.
                    </p>
                  ) : (
                    seccion.items.map((ensayo) => {
                      const fechaFormateada = ensayo.fechaPublicacion
                        ? new Date(ensayo.fechaPublicacion).toLocaleDateString('es-MX', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : null

                      return (
                        <Link
                          key={ensayo.id}
                          href={`/ensayos/${ensayo.id}`}
                          className="p-4 hover:bg-neutral-900/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group/item block"
                        >
                          <div className="space-y-1">
                            <h3 className="text-base font-medium text-white group-hover/item:text-amber-400 transition-colors">
                              {ensayo.titulo}
                            </h3>
                            {ensayo.resumen && (
                              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                                {ensayo.resumen}
                              </p>
                            )}
                          </div>

                          {fechaFormateada && (
                            <time className="text-[11px] text-neutral-500 font-mono whitespace-nowrap self-start sm:self-center">
                              {fechaFormateada}
                            </time>
                          )}
                        </Link>
                      )
                    })
                  )}
                </div>
              </details>
            )
          })}
        </div>
      )}
    </div>
  )
}