'use client'

import { useEffect } from 'react'

export function SetNavbarActive({ active }: { active: boolean }) {
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('set-navbar-ambar', { detail: { active } })
    )

    return () => {
      window.dispatchEvent(
        new CustomEvent('set-navbar-ambar', { detail: { active: false } })
      )
    }
  }, [active])

  return null
}