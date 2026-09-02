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

  // Obtenemos la ruta actual desde el header x-invoke-path o x-url que proporciona Next.js
  const pathname = headersList.get('x-invoke-path') || ''
  
  let forceActiveSection: 'epopeya-cristera' | 'ensayos' | null = null

  // Si estamos dentro de un detalle de ensayo (ej. /ensayos/el-talon-de-aquiles)
  if (pathname.startsWith('/ensayos/')) {
    const ensayoId = pathname.split('/')[2]

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
          slugCategoria.includes('anacleto') || 
          nombreCategoria.toLowerCase().includes('anacleto') ||
          nombreCategoria.toLowerCase().includes('cuestión religiosa')

        if (esAnacleto) {
          forceActiveSection = 'epopeya-cristera'
        }
      } catch (e) {
        // Si hay algún error al buscar el ensayo, se ignora de forma segura
      }
    }
  }

  return (
    <html lang="es">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen flex flex-col">
        <Navbar user={user} forceActiveSection={forceActiveSection} />

        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}