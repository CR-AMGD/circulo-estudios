import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { Navbar } from '@/components/Navbar'
import './styles.css'

export const metadata = {
  description: 'Repositorio digital del círculo de estudios. Transcripciones, análisis filosófico, histórico y convocatorias abiertas.',
  title: 'Círculo de Estudios Luis María Grignion de Montfort',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const payload = await getPayload({ config })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  // Detectar la ruta actual a través de los headers para forzar la sección activa si es un ensayo de Anacleto
  const referer = headersList.get('x-invoke-path') || headersList.get('referer') || ''
  
  let forceActiveSection: 'epopeya-cristera' | 'ensayos' | null = null

  // Si estamos en una ruta de ensayo, consultamos en la base de datos si el ID pertenece a Anacleto
  if (referer.includes('/ensayos/')) {
    const segments = referer.split('/')
    const ensayoId = segments[segments.indexOf('ensayos') + 1]

    if (ensayoId) {
      try {
        const ensayo = await payload.findByID({
          collection: 'ensayos',
          id: ensayoId,
          depth: 1,
        })

        const cat = ensayo?.categoria
        const slugCategoria = typeof cat === 'object' && cat !== null ? (cat.slug || '') : String(cat || '')
        const nombreCategoria = typeof cat === 'object' && cat !== null ? (cat.nombre || '') : ''

        const esAnacleto = 
          slugCategoria === 'anacleto-gonzalez-flores' || 
          slugCategoria === 'la-cuestion-religiosa-en-jalisco' || 
          slugCategoria.includes('anacleto') || 
          nombreCategoria.toLowerCase().includes('anacleto') ||
          nombreCategoria.toLowerCase().includes('cuestión religiosa')

        if (esAnacleto) {
          forceActiveSection = 'epopeya-cristera'
        }
      } catch (e) {
        // Si falla la búsqueda del id por cualquier motivo, continúa de forma segura
      }
    }
  }

  return (
    <html lang="es">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen flex flex-col">
        {/* Pasamos la directiva para forzar el menú iluminado en ámbar si corresponde */}
        <Navbar user={user} forceActiveSection={forceActiveSection} />

        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}