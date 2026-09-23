'use client'

import React from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export function ViewOnSiteButton() {
  const { id, data } = useDocumentInfo()

  if (!id) return null

  // Obtenemos el slug del documento actual en el panel de administración
  const slug = (data as any)?.slug || id

  return (
    <a
      href={`/ensayos/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs font-medium text-[#38bdf8] hover:underline select-none mr-1"
    >
      <span>Ver previo</span>
      <span>→</span>
    </a>
  )
}