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
  const { user } = await payload.auth({ headers: await headers() })

  return (
    <html lang="es">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen flex flex-col">
        {/* Asegúrate de que este sea el ÚNICO lugar donde se incluye la Navbar */}
        <Navbar user={user} />

        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}