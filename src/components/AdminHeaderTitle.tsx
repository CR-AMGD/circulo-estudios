'use client'
import React from 'react'
import { useAuth } from '@payloadcms/ui'

export const AdminHeaderTitle: React.FC = () => {
  const { user } = useAuth()

  // Si el usuario tiene rol de admin muestra "Panel Admin", de lo contrario "Panel Editor"
  const esAdmin = user?.rol === 'admin'
  const titulo = esAdmin ? 'Panel Admin' : 'Panel Editor'

  return (
    <div className="flex items-center gap-2 font-semibold text-sm tracking-wide text-neutral-200">
      <span>{titulo}</span>
    </div>
  )
}