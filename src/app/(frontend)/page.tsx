import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

import { formatearFecha } from '@/utils/formatearFecha'

export default async function HomePage() {
  const payload = await getPayload({ config })

  // Obtenemos los últimos 6 ensayos publicados resolviendo relaciones
  const ensayos = await payload.find({
    collection: 'ensayos',
    limit: 6,
    sort: '-fechaPublicacion',
    depth: 1,
  })

  // Obtenemos los próximos eventos
  const eventos = await payload.find({
    collection: 'eventos',
    limit: 3,
    sort: 'fechaHora',
  })

  // Helper para renderizar el nombre del autor sin romper React
  const obtenerNombreAutor = (autor: any) => {
    if (!autor) return 'Autor no especificado'
    if (Array.isArray(autor)) {
      return autor
        .map((a) => (typeof a === 'object' && a !== null ? a.nombre || a.email : String(a)))
        .join(', ')
    }
    if (typeof autor === 'object' && autor !== null) {
      return autor.nombre || autor.email || 'Autor'
    }
    return String(autor)
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-100 mb-6 leading-tight">
          Archivo Documental & Ensayos
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto text-center">
          Repositorio digital del círculo de estudios{' '}
          <span className="text-[#38bdf8] font-medium whitespace-nowrap">
            Luis María Grignion de Montfort
          </span>
        </p>

        <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto text-center mt-2">
          Transcripciones, análisis filosófico, histórico y archivo fotográfico.
        </p>
      </section>

      {/* Sección de Ensayos */}
      <section id="ensayos" className="max-w-6xl mx-auto px-6 py-12 border-t border-neutral-800">
        <h2 className="text-2xl font-bold tracking-tight mb-8 text-neutral-200">
          Últimas Publicaciones & Transcripciones
        </h2>
        
        {ensayos.docs.length === 0 ? (
          <p className="text-neutral-500 italic">No hay ensayos publicados aún.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ensayos.docs.map((ensayo: any) => (
              <article key={ensayo.id} className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs text-neutral-500 mb-3">
                    <span className="text-[#38bdf8] font-medium">
                      {obtenerNombreAutor(ensayo.autor)}
                    </span>
                    <span>{formatearFecha(ensayo.fechaPublicacion)}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-100 mb-3 leading-snug">
                    {ensayo.titulo}
                  </h3>
                  <p className="text-neutral-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {ensayo.resumen || 'Sin resumen disponible.'}
                  </p>
                </div>
                <div>
                  <Link 
                    href={`/ensayos/${ensayo.id}`} 
                    className="inline-flex items-center text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Leer publicación →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Sección de Eventos */}
      <section id="eventos" className="max-w-6xl mx-auto px-6 py-12 my-12 border-t border-neutral-800">
        <h2 className="text-2xl font-bold tracking-tight mb-8 text-neutral-200">
          Próximas Sesiones & Eventos
        </h2>
        
        {eventos.docs.length === 0 ? (
          <p className="text-neutral-500 italic">No hay eventos programados por el momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventos.docs.map((evento: any) => (
              <div key={evento.id} className="p-5 rounded-lg border border-neutral-800 bg-neutral-900/20">
                <p className="text-xs font-mono text-amber-400 mb-2">
                  {new Date(evento.fechaHora).toLocaleString()}
                </p>
                <h3 className="text-lg font-bold text-neutral-100 mb-2">{evento.titulo}</h3>
                <p className="text-xs text-neutral-400 mb-4">{evento.lugar}</p>
                <p className="text-sm text-neutral-300 line-clamp-2">{evento.descripcion}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-8 text-center text-xs text-neutral-600">
        <p>© {new Date().getFullYear()} Círculo de Estudios. Luis María Grignion de Montfort. V 1.0 // 3 Septiembre 2026</p>
      </footer>
    </div>
  )
}