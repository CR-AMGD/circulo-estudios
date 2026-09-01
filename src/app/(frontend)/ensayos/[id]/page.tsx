import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { formatearFecha } from '@/utils/formatearFecha'
import { EnsayoLayout } from '@/components/EnsayoLayout'

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

  // Redirección dinámica según categoría
  const esAnacleto = ensayo.categoria === 'anacleto-gonzalez-flores'
  const backHref = esAnacleto ? '/epopeya-cristera/anacleto-gonzalez-flores' : '/ensayos'
  const backText = esAnacleto ? '← Volver a Beato Anacleto' : '← Volver a Ensayos'

  // Normalización de relaciones
  const autores = Array.isArray(ensayo.autor) ? ensayo.autor : [ensayo.autor].filter(Boolean)
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
          <div className="inline-block px-3 py-1.5 rounded-md bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20 text-xs font-medium">
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
            className="block p-3 rounded-lg bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 hover:border-[#38bdf8]/50 transition-all group"
          >
            <p className="text-xs font-semibold text-neutral-200 group-hover:text-[#38bdf8] transition-colors line-clamp-2">
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
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-neutral-950 bg-[#38bdf8] hover:bg-[#7dd3fc] rounded-lg transition-colors"
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
                  className="block p-3 rounded-lg bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 hover:border-[#38bdf8]/50 transition-all group"
                >
                  <p className="text-xs font-medium text-neutral-200 group-hover:text-[#38bdf8] transition-colors line-clamp-2">
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
      <div className="max-w-6xl mx-auto">
        {/* Navegación Superior */}
        <div className="mb-8">
          <Link 
            href={backHref} 
            className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#38bdf8] hover:underline transition-colors"
          >
            {backText}
          </Link>
        </div>

        {/* Contenedor Interactivo con Botón para Ocultar/Mostrar */}
        <EnsayoLayout sidebarContent={sidebarContent} tieneMetadata={tieneMetadata}>
          <header className="border-b border-neutral-800 pb-6">
            {ensayo.fechaPublicacion && (
              <p className="text-xs font-mono text-neutral-500 mb-2">
                Publicado el {formatearFecha(ensayo.fechaPublicacion)}
              </p>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
              {ensayo.titulo}
            </h1>

            {/* Firma de Autor */}
            <div className="text-base text-[#38bdf8] font-medium flex flex-wrap items-center gap-1">
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
            <div className="p-4 bg-neutral-900/50 border-l-2 border-[#38bdf8] text-neutral-300 italic text-sm leading-relaxed rounded-r-lg">
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
      </div>
    </article>
  )
}