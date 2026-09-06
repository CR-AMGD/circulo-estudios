'use client'

import React from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export function ViewOnSiteButton() {
  const { id } = useDocumentInfo()

  if (!id) return null

  return (
    <span className="text-xs font-medium text-neutral-400 select-none mr-1">
      Ver previo →
    </span>
  )
}