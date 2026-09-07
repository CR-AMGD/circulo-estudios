import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { AnacletoAccordion } from '@/components/AnacletoAccordion'

export default async function AnacletoPage() {
  const payload = await getPayload({ config })

  // 1. Buscamos la categoría correspondiente al slug general de esta sección
  const categoriasMatch = await payload.find({
    collection: 'categorias',
    where: {
      slug: {
        equals: 'anacleto-gonzalez-flores', // O el slug raíz que agrupe al autor/sección
      },
    },
    limit: 1,
  })

  const categoriaId = categoriasMatch.docs[0]?.id

  // 2. Buscamos los ensayos asociados a ese ID (o traemos todos si prefieres filtrarlos en el componente por subcategorías/slugs hijos)
  const { docs: ensayos } = await payload.find({
    collection: 'ensayos',
    depth: 1, // Vital para que traiga los datos de la categoría y subcategorías poblados
    where: categoriaId
      ? {
          categoria: {
            equals: categoriaId,
          },
        }
      : {}, // Si por algo no encuentra la categoría, trae un respaldo o vacío
    limit: 100,
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="border-b border-neutral-800 pb-8 mb-8">
        {/* Encabezado con Flecha al Inicio */}
        <div className="flex items-center gap-2 mb-1">
          <Link
            href="/"
            className="text-amber-400 hover:text-amber-300 transition-colors flex items-center justify-center -ml-1 p-1 rounded-md hover:bg-neutral-800/60 group"
            title="Volver al Inicio"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:-translate-x-0.5"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>

          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold font-mono">
            Epopeya Cristera
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white mt-2">
          Beato Anacleto González Flores
        </h1>
        <p className="text-neutral-400 mt-2 text-sm leading-relaxed">
          Recopilación de escritos, ensayos y discursos del &ldquo;Maestro Cleto&rdquo;.
        </p>
      </header>

      {/* Acordeón de Secciones */}
      <AnacletoAccordion ensayos={ensayos as any} />
    </div>
  )
}