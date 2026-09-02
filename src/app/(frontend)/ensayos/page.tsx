import { getPayload } from 'payload'
import config from '@payload-config'
import { ListaEnsayosAcordeon } from '@/components/ListaEnsayosAcordeon'
import Link from 'next/link'

export default async function EnsayosPage() {
  const payload = await getPayload({ config })

  // 1. Traemos los ensayos publicados con depth: 2 para que los autores vengan poblados
  const { docs: ensayosRaw } = await payload.find({
    collection: 'ensayos',
    depth: 2,
    where: {
      _status: { equals: 'published' },
    },
    sort: '-fechaPublicacion',
    limit: 100,
  })

  // 2. Filtramos el ensayo de Anacleto comprobando si alguno de sus autores en el arreglo es Anacleto
  const ensayos = ensayosRaw.filter((ensayo: any) => {
    const autores = ensayo.autor
    if (!Array.isArray(autores)) return true

    // Si alguno de los autores en la lista es Anacleto, lo excluimos del repositorio general
    const esDeAnacleto = autores.some((a: any) => {
      const nombre = typeof a === 'object' && a !== null ? (a.nombre || '') : String(a)
      const slug = typeof a === 'object' && a !== null ? (a.slug || '') : ''
      return (
        nombre.toLowerCase().includes('anacleto gonzález flores') ||
        slug === 'anacleto-gonzalez-flores'
      )
    })

    return !esDeAnacleto
  })

  // 3. Agrupamos los ensayos restantes respetando la estructura hasMany: true de autores
  const ensayosPorAutor = ensayos.reduce((acc, ensayo) => {
    const rawAutores = ensayo.autor
    let nombresAutores: string[] = []

    if (Array.isArray(rawAutores)) {
      nombresAutores = rawAutores.map((a: any) => {
        if (typeof a === 'object' && a !== null) {
          return a.nombre || a.email || String(a.id || 'Autor')
        }
        return String(a)
      })
    } else if (typeof rawAutores === 'object' && rawAutores !== null) {
      nombresAutores = [(rawAutores as any).nombre || (rawAutores as any).email || 'Autor']
    } else if (typeof rawAutores === 'string' && rawAutores) {
      nombresAutores = [rawAutores]
    }

    // Si tiene múltiples autores, los unimos por comas para la clave del acordeón
    const claveAutor = nombresAutores.length > 0 ? nombresAutores.join(', ') : 'Anónimo'

    if (!acc[claveAutor]) acc[claveAutor] = []

    const ensayoNormalizado = {
      ...ensayo,
      resumen: ensayo.resumen ?? undefined,
    }

    acc[claveAutor].push(ensayoNormalizado as any)
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