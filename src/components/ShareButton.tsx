'use client'

import React, { useState } from 'react'

export function ShareButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.error('Error al copiar el enlace', err)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white transition-all shadow-sm group"
      title="Copiar enlace al portapapeles"
    >
      {copied ? (
        <>
          <span className="text-emerald-400">✓</span>
          <span className="text-emerald-400 font-semibold">¡Enlace copiado!</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4 text-neutral-400 group-hover:text-amber-400 transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          <span>Compartir</span>
        </>
      )}
    </button>
  )
}