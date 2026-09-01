// src/app/(frontend)/ensayos/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { ListaEnsayosAcordeon } from '@/components/ListaEnsayosAcordeon'
import Link from 'next/link'

export default async function EnsayosPage() {
  const payload = await getPayload({ config })

  // Trae solo los ensayos de colaboradores (excluye Epopeya Cristera / Anacleto)
  const { docs: ensayos } = await payload.find({
    collection: 'ensayos',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { categoria: { not_equals: 'anacleto-gonzalez-flores' } },
      ],
    },
    sort: '-fechaPublicacion',
    limit: 100,
  })

  // Agrupar ensayos por autor extrayendo un string clave unificado
  const ensayosPorAutor = ensayos.reduce((acc, ensayo) => {
    let autorNombre = 'Anónimo'
    const rawAutor = ensayo.autor as any

    if (Array.isArray(rawAutor) && rawAutor.length > 0) {
      const primerAutor = rawAutor[0]
      if (typeof primerAutor === 'object' && primerAutor !== null) {
        autorNombre = primerAutor.nombre || primerAutor.email || String(primerAutor.id)
      } else if (typeof primerAutor === 'string') {
        autorNombre = primerAutor
      }
    } else if (typeof rawAutor === 'object' && rawAutor !== null) {
      autorNombre = rawAutor.nombre || rawAutor.email || String(rawAutor.id)
    } else if (typeof rawAutor === 'string' && rawAutor) {
      autorNombre = rawAutor
    }

    if (!acc[autorNombre]) acc[autorNombre] = []

    // Normalizar resumen de null a undefined para compatibilidad con la prop del componente
    const ensayoNormalizado = {
      ...ensayo,
      resumen: ensayo.resumen ?? undefined,
    }

    acc[autorNombre].push(ensayoNormalizado as any)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-[#38bdf8] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver al Inicio</span>
          </Link>
        </div>

        <header className="border-b border-neutral-800 pb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Repositorio de Ensayos
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Índice de ensayos y análisis organizados por autor y cronología.
          </p>
        </header>

        <ListaEnsayosAcordeon ensayosPorAutor={ensayosPorAutor} />
      </div>
    </div>
  )
}