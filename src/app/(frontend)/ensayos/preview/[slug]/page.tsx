import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Ensayo } from '@/payload-types'
import { formatearFecha } from '@/utils/formatearFecha'

interface PreviewPageProps {
  params: Promise<{ slug: string }>
}

export default async function EssayPreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/admin/login')
  }

  // Cargar el documento por slug permitiendo borradores (draft: true)
  let ensayo: any = null
  try {
    const query = await payload.find({
      collection: 'ensayos',
      where: {
        slug: {
          equals: slug,
        },
      },
      draft: true,
      overrideAccess: false,
      user,
      depth: 2,
      limit: 1,
    })
    ensayo = query.docs[0] || null
  } catch (error) {
    notFound()
  }

  if (!ensayo) return notFound()

  // Normalizar autor para renderizado seguro en React
  const autores = Array.isArray(ensayo.autor)
    ? ensayo.autor
    : [ensayo.autor].filter(Boolean)

  const fechaPublicacionTexto = ensayo.fechaPublicacion
    ? formatearFecha(ensayo.fechaPublicacion)
    : 'Sin fecha de publicación'

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-20">
      {/* BANNER FLOTANTE DE VISTA PREVIA Y ACCIONES */}
      <div className="sticky top-16 z-40 bg-neutral-900/90 backdrop-blur border-b border-neutral-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
            👁 Modo Vista Previa ({ensayo._status === 'published' ? 'Publicado' : 'Borrador'})
          </span>
          <p className="text-xs text-neutral-400 hidden sm:block">
            Revisa la composición final antes de hacerlo público.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Botón único de Volver a Edición (usa el ID para el admin de Payload) */}
          <Link
            href={`/admin/collections/ensayos/${ensayo.id}`}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white transition-colors flex items-center gap-2"
          >
            <span>✏️</span> Volver a Edición
          </Link>
        </div>
      </div>

      {/* RENDERIZADO DE LA VISTA DEL ENSAYO */}
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
          {/* Renderizado completo con convertidores para encabezados y listas */}
          {ensayo.contenido && (
            <RichText 
              data={ensayo.contenido} 
              converters={(args: any) => {
                const defaultConverters = args?.defaultConverters || {}
                return {
                  ...defaultConverters,
                  heading: ({ node, nodesToJSX }: any) => {
                    const tag = node.tag || 'h2'
                    const content = node.children ? nodesToJSX({ nodes: node.children }) : ''
                    
                    switch (tag) {
                      case 'h1':
                        return <h1 className="text-3xl sm:text-4xl font-bold text-white mt-10 mb-4 leading-tight">{content}</h1>
                      case 'h2':
                        return <h2 className="text-2xl sm:text-3xl font-bold text-white mt-8 mb-4 leading-snug">{content}</h2>
                      case 'h3':
                        return <h3 className="text-xl sm:text-2xl font-semibold text-neutral-200 mt-6 mb-3">{content}</h3>
                      case 'h4':
                        return <h4 className="text-lg font-semibold text-neutral-300 mt-4 mb-2">{content}</h4>
                      default:
                        return <h2 className="text-2xl font-bold text-white mt-8 mb-4">{content}</h2>
                    }
                  },
                  list: ({ node, nodesToJSX }: any) => {
                    const tag = node.tag || 'ul'
                    const content = node.children ? nodesToJSX({ nodes: node.children }) : ''
                    
                    if (tag === 'ol') {
                      return <ol className="list-decimal pl-6 my-4 space-y-2">{content}</ol>
                    }
                    return <ul className="list-disc pl-6 my-4 space-y-2">{content}</ul>
                  },
                  listitem: ({ node, nodesToJSX }: any) => {
                    const content = node.children ? nodesToJSX({ nodes: node.children }) : ''
                    return <li className="leading-relaxed">{content}</li>
                  }
                }
              }}
            />
          )}
        </div>
      </article>
    </div>
  )
}