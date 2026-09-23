import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Ensayo } from '@/payload-types'
import { LexicalNote } from '@/components/LexicalNote' // <-- Importa tu componente

interface PreviewPageProps {
  params: Promise<{ id: string }>
}

// 1. Define los convertidores de Lexical para transformar enlaces especiales en notas léxicas
const jsxConverters = {
  link: ({ node, nodesToJSX }: any) => {
    const url = node.fields?.url || '';
    
    // Si la URL comienza con #lexical-note:, extrae el término y la definición
    if (url.startsWith('#lexical-note:')) {
      const payloadData = url.replace('#lexical-note:', '');
      const [term, definition] = payloadData.split('|');
      return <LexicalNote term={term} definition={decodeURIComponent(definition || '')} />;
    }

    // Comportamiento normal para otros enlaces
    return (
      <a href={url} target={node.fields?.newTab ? '_blank' : '_self'} rel="noopener noreferrer" className="text-amber-400 hover:underline">
        {nodesToJSX({ nodes: node.children })}
      </a>
    );
  },
};

export default async function EssayPreviewPage({ params }: PreviewPageProps) {
  const { id } = await params
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/admin/login')
  }

  const doc = await payload.findByID({
    collection: 'ensayos',
    id,
    draft: true,
    overrideAccess: false,
    user,
  }).catch(() => null)

  if (!doc) return notFound()

  const ensayo = doc as Ensayo

  const autores = Array.isArray(ensayo.autor)
    ? ensayo.autor
    : [ensayo.autor].filter(Boolean)

  const fechaPublicacionTexto = ensayo.fechaPublicacion
    ? new Date(ensayo.fechaPublicacion).toLocaleDateString('es-MX')
    : 'Sin fecha de publicación'

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-20">
      {/* (Tu banner flotante se mantiene igual...) */}
      <div className="sticky top-16 z-40 bg-neutral-900/90 backdrop-blur border-b border-neutral-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
            👁 Modo Vista Previa ({ensayo._status === 'published' ? 'Publicado' : 'Borrador'})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/collections/ensayos/${ensayo.id}`}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white transition-colors flex items-center gap-2"
          >
            <span>✏️</span> Volver a Edición
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-8 border-b border-neutral-800 pb-8">
          <p className="text-xs uppercase tracking-widest text-[#38bdf8] font-semibold mb-2">
            {typeof ensayo.categoria === 'object' && ensayo.categoria !== null
              ? (ensayo.categoria as any).nombre
              : String(ensayo.categoria || 'Sin categoría')}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            {ensayo.titulo}
          </h1>
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <span>Por:</span>
              <strong className="text-neutral-200">
                {autores.length > 0 ? (
                  autores.map((aut: any, idx: number) => {
                    const nombre = typeof aut === 'object' && aut !== null
                      ? (aut.nombre || aut.email || 'Autor')
                      : String(aut)
                    return (
                      <span key={aut.id || idx}>
                        {nombre}
                        {idx < autores.length - 1 ? ', ' : ''}
                      </span>
                    )
                  })
                ) : (
                  <span>Anónimo</span>
                )}
              </strong>
            </span>
            <span>•</span>
            <span>{fechaPublicacionTexto}</span>
          </div>
        </header>

        {ensayo.resumen && (
          <div className="text-lg text-neutral-300 italic mb-8 border-l-2 border-[#38bdf8] pl-4">
            {ensayo.resumen}
          </div>
        )}

        <div className="prose prose-invert max-w-none text-neutral-200 space-y-4">
          {/* 2. Pasa los convertidores al componente RichText */}
          {ensayo.contenido && (
            <RichText data={ensayo.contenido} converters={jsxConverters} />
          )}
        </div>
      </article>
    </div>
  )
}