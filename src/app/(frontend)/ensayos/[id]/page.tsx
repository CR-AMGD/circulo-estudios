import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { formatearFecha } from '@/utils/formatearFecha'
import { EnsayoLayout } from '@/components/EnsayoLayout'
import { SetNavbarActive } from '@/components/SetNavbarActive'
import { ShareButton } from '@/components/ShareButton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EnsayoDetailPage({ params }: PageProps) {
  const { id } = await params
  const payload = await getPayload({ config })

  let ensayo: any = null
  try {
    ensayo = await payload.findByID({
      collection: 'ensayos',
      id,
      depth: 2,
    })
  } catch (error) {
    notFound()
  }

  if (!ensayo) {
    notFound()
  }

  // ==========================================
  // CONSULTA DE ENSAYO ANTERIOR Y SIGUIENTE
  // ==========================================
  const fechaActual = ensayo.fechaPublicacion || new Date().toISOString()

  // Buscar el ensayo anterior (publicado antes que este)
  const prevQuery = await payload.find({
    collection: 'ensayos',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { fechaPublicacion: { less_than: fechaActual } },
        { id: { not_equals: ensayo.id } }
      ]
    },
    sort: '-fechaPublicacion',
    limit: 1,
  })

  // Buscar el ensayo siguiente (publicado después que este)
  const nextQuery = await payload.find({
    collection: 'ensayos',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { fechaPublicacion: { greater_than: fechaActual } },
        { id: { not_equals: ensayo.id } }
      ]
    },
    sort: 'fechaPublicacion',
    limit: 1,
  })

  const prevEnsayo = prevQuery.docs[0] || null
  const nextEnsayo = nextQuery.docs[0] || null

  // Normalización de relaciones
  const autores = Array.isArray(ensayo.autor) ? ensayo.autor : [ensayo.autor].filter(Boolean)
  const cat = ensayo.categoria
  const slugCategoria = typeof cat === 'object' && cat !== null ? (cat.slug || '') : String(cat || '')
  const nombreCategoria = typeof cat === 'object' && cat !== null ? (cat.nombre || '') : ''

  // Detección si el autor es Anacleto
  const esAutorAnacleto = autores.some((aut: any) => {
    const nombre = typeof aut === 'object' && aut !== null ? (aut.nombre || '') : String(aut)
    return nombre.toLowerCase().includes('anacleto')
  })

  // Evaluación global para enrutar a Epopeya Cristera / Anacleto
  const esAnacleto = 
    esAutorAnacleto ||
    slugCategoria === 'anacleto-gonzalez-flores' || 
    slugCategoria === 'la-cuestion-religiosa-en-jalisco' || 
    slugCategoria === 'ensayos-y-discursos' ||
    slugCategoria.includes('anacleto') || 
    nombreCategoria.toLowerCase().includes('anacleto') ||
    nombreCategoria.toLowerCase().includes('cuestión religiosa')

  // Enlaces y textos dinámicos según la sección
  const backHref = esAnacleto ? '/epopeya-cristera/anacleto-gonzalez-flores' : '/ensayos'
  const backText = esAnacleto ? '← Volver a Beato Anacleto' : '← Volver a Ensayos'

  // Definición de colores según sección (Ámbar para Epopeya Cristera, Azul para Ensayos generales)
  const accentColorClass = esAnacleto ? 'text-amber-500' : 'text-[#38bdf8]'
  const accentBorderClass = esAnacleto ? 'border-amber-500/40' : 'border-[#38bdf8]/40'
  const accentBgBadgeClass = esAnacleto ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/20'
  const accentButtonClass = esAnacleto ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950' : 'bg-[#38bdf8] hover:bg-[#7dd3fc] text-neutral-950'
  const hoverGroupColor = esAnacleto ? 'group-hover:text-amber-500 hover:border-amber-500/50' : 'group-hover:text-[#38bdf8] hover:border-[#38bdf8]/50'

  const conversacion = typeof ensayo.conversacion === 'object' && ensayo.conversacion !== null ? ensayo.conversacion : null
  const parentEssay = typeof ensayo.parentEssay === 'object' && ensayo.parentEssay !== null ? ensayo.parentEssay : null
  const relatedEssays = Array.isArray(ensayo.relatedEssays) ? ensayo.relatedEssays : []

  // Control para saber si hay información que valga la pena mostrar
  const tieneMetadata = Boolean(
    (conversacion && conversacion.titulo) ||
    (parentEssay && parentEssay.id) ||
    (ensayo.pdfAdjunto && typeof ensayo.pdfAdjunto === 'object' && ensayo.pdfAdjunto.url) ||
    relatedEssays.length > 0
  )

  // Marcado del Panel Lateral
  const sidebarContent = (
    <div className="p-5 bg-neutral-900/60 border border-neutral-800/80 rounded-xl space-y-5">
      <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-2">
        Contexto & Debate
      </h2>

      {/* Hilo de Conversación */}
      {conversacion && conversacion.titulo && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-neutral-500 block">Hilo conceptual:</span>
          <div className={`inline-block px-3 py-1.5 rounded-md border text-xs font-medium ${accentBgBadgeClass}`}>
            {conversacion.titulo}
          </div>
        </div>
      )}

      {/* Ensayo Padre */}
      {parentEssay && parentEssay.id && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-neutral-500 block">↳ Responde / Deriva de:</span>
          <Link
            href={`/ensayos/${parentEssay.id}`}
            className={`block p-3 rounded-lg bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 transition-all group ${hoverGroupColor}`}
          >
            <p className={`text-xs font-semibold text-neutral-200 transition-colors line-clamp-2 ${hoverGroupColor}`}>
              {parentEssay.titulo}
            </p>
          </Link>
        </div>
      )}

      {/* PDF Adjunto */}
      {ensayo.pdfAdjunto && typeof ensayo.pdfAdjunto === 'object' && ensayo.pdfAdjunto.url && (
        <div className="space-y-2 pt-2 border-t border-neutral-800/80">
          <span className="text-[11px] font-mono text-neutral-500 block">Documento de consulta:</span>
          <a 
            href={ensayo.pdfAdjunto.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-colors ${accentButtonClass}`}
          >
            📄 Descargar PDF
          </a>
        </div>
      )}

      {/* Ensayos Relacionados */}
      {relatedEssays.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-neutral-800/80">
          <span className="text-[11px] font-mono text-neutral-500 block">⇄ Dialoga con:</span>
          <div className="space-y-2">
            {relatedEssays.map((rel: any) => {
              if (typeof rel !== 'object' || rel === null) return null
              return (
                <Link
                  key={rel.id}
                  href={`/ensayos/${rel.id}`}
                  className={`block p-3 rounded-lg bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 transition-all group ${hoverGroupColor}`}
                >
                  <p className={`text-xs font-medium text-neutral-200 transition-colors line-clamp-2 ${hoverGroupColor}`}>
                    {rel.titulo}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <article className="min-h-screen bg-neutral-950 text-neutral-100 font-sans py-10 px-4 sm:px-6">
      {/* Componente de cliente que avisa al Navbar si debe parpadear en ámbar */}
      <SetNavbarActive active={esAnacleto} />

      <div className="max-w-6xl mx-auto">
        {/* Navegación Superior */}
        <div className="mb-8">
          <Link 
            href={backHref} 
            className={`inline-flex items-center text-xs font-semibold uppercase tracking-wider hover:underline transition-colors ${accentColorClass}`}
          >
            {backText}
          </Link>
        </div>

        {/* Contenedor Interactivo con Botón para Ocultar/Mostrar */}
        <EnsayoLayout sidebarContent={sidebarContent} tieneMetadata={tieneMetadata}>
          <header className="border-b border-neutral-800 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              {ensayo.fechaPublicacion && (
                <p className="text-xs font-mono text-neutral-500">
                  Publicado el {formatearFecha(ensayo.fechaPublicacion)}
                </p>
              )}
              {/* Botón de Compartir / Copiar Link */}
              <ShareButton />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
              {ensayo.titulo}
            </h1>

            {/* Firma de Autor */}
            <div className={`text-base font-medium flex flex-wrap items-center gap-1 ${accentColorClass}`}>
              <span>Por</span>
              {autores.length > 0 ? (
                autores.map((aut: any, idx: number) => {
                  const nombreAutor = typeof aut === 'object' && aut !== null 
                    ? (aut.nombre || aut.email || 'Autor') 
                    : String(aut)

                  return (
                    <span key={aut.id || idx}>
                      {nombreAutor}
                      {idx < autores.length - 1 ? ', ' : ''}
                    </span>
                  )
                })
              ) : (
                <span>Autor no especificado</span>
              )}
            </div>
          </header>

          {/* Resumen / Epígrafe */}
          {ensayo.resumen && (
            <div className={`p-4 bg-neutral-900/50 border-l-2 text-neutral-300 italic text-sm leading-relaxed rounded-r-lg ${accentBorderClass}`}>
              {ensayo.resumen}
            </div>
          )}

          {/* Cuerpo del Ensayo */}
          <div className="prose prose-invert max-w-none text-neutral-300 leading-relaxed space-y-4">
            {ensayo.contenido && (
              <RichText data={ensayo.contenido} />
            )}
          </div>
        </EnsayoLayout>

        {/* ========================================== */}
        {/* NAVEGACIÓN: ENSAYO ANTERIOR Y SIGUIENTE     */}
        {/* ========================================== */}
        <footer className="mt-16 pt-8 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {prevEnsayo ? (
            <Link
              href={`/ensayos/${prevEnsayo.id}`}
              className={`p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all group flex flex-col justify-between ${hoverGroupColor}`}
            >
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                ← Ensayo Anterior
              </span>
              <p className="text-sm font-semibold text-neutral-200 line-clamp-2 group-hover:text-white">
                {prevEnsayo.titulo}
              </p>
            </Link>
          ) : (
            <div />
          )}

          {nextEnsayo ? (
            <Link
              href={`/ensayos/${nextEnsayo.id}`}
              className={`p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all group flex flex-col justify-between text-right ${hoverGroupColor}`}
            >
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                Ensayo Siguiente →
              </span>
              <p className="text-sm font-semibold text-neutral-200 line-clamp-2 group-hover:text-white">
                {nextEnsayo.titulo}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </footer>
      </div>
    </article>
  )
}