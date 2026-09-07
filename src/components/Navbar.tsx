'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { UserMenu } from './UserMenu'
import { useState, useEffect, useRef } from 'react'

export interface NavbarProps {
  user?: {
    email: string
    nombre?: string
    rol?: string
  } | null
  forceActiveSection?: 'epopeya-cristera' | 'ensayos' | null
}

export function Navbar({ user, forceActiveSection }: NavbarProps) {
  const rawPathname = usePathname()
  const pathname = (rawPathname || '').toLowerCase()

  // La sección "epopeya" también puede activarse mediante un evento global
  // (`set-navbar-ambar`). Guardamos la clave de ruta en la que se activó, de forma que
  // el override caduca solo al navegar a otra sección, sin un efecto que llame a setState.
  const sectionKey = `${forceActiveSection ?? ''}|${pathname}`
  const sectionKeyRef = useRef(sectionKey)
  const [ambarEventKey, setAmbarEventKey] = useState<string | null>(null)

  useEffect(() => {
    sectionKeyRef.current = sectionKey
  }, [sectionKey])

  useEffect(() => {
    const handleForceAmbar = (e: Event) => {
      const active = (e as CustomEvent).detail?.active ?? false
      setAmbarEventKey(active ? sectionKeyRef.current : null)
    }
    window.addEventListener('set-navbar-ambar', handleForceAmbar)
    return () => {
      window.removeEventListener('set-navbar-ambar', handleForceAmbar)
    }
  }, [])

  const forceAmbar = ambarEventKey === sectionKey

  const isEpopeyaActive = forceAmbar || pathname.includes('epopeya-cristera') || forceActiveSection === 'epopeya-cristera'
  const isEnsayosActive = (pathname.includes('ensayo') || forceActiveSection === 'ensayos') && !isEpopeyaActive

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo y Título */}
        <Link href="/" className="flex items-center gap-3 group no-underline min-w-0">
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            <Image
              src="/logo.svg"
              alt="Círculo de Estudios"
              width={40}
              height={40}
              className="w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-105"
              priority
            />
          </div>

          <div className="flex flex-col text-left min-w-0">
            <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors leading-tight truncate">
              Círculo de Estudios
            </span>
            <span className="text-[11px] font-medium text-[#38bdf8] tracking-wide leading-tight truncate">
              Luis María Grignion de Montfort
            </span>
          </div>
        </Link>

        {/* ========================================================= */}
        {/* NAVEGACIÓN DE ESCRITORIO (Hover intacto)                   */}
        {/* ========================================================= */}
        <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
          
          <div className="relative group">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                isEpopeyaActive
                  ? 'text-amber-400 font-semibold border border-amber-400/40 bg-amber-400/5'
                  : 'text-neutral-300 hover:text-amber-400 hover:border hover:border-amber-400/40 hover:bg-amber-400/5 border border-transparent'
              }`}
            >
              <span>Epopeya Cristera</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 group-hover:rotate-180 ${
                  isEpopeyaActive ? 'text-amber-400' : 'text-neutral-400 group-hover:text-amber-400'
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div className="absolute left-0 mt-1 w-64 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <Link
                href="/epopeya-cristera/anacleto-gonzalez-flores"
                className="block px-4 py-3 text-sm transition-colors hover:bg-neutral-800/80 group/item"
              >
                <div className="font-semibold text-white group-hover/item:text-amber-400 transition-colors">
                  Beato Anacleto González Flores
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5 normal-case font-normal leading-tight">
                  Vida, escritos y legado de los mártires
                </div>
              </Link>
            </div>
          </div>

          <Link 
            href="/ensayos" 
            className={`px-3 py-1.5 rounded-md border transition-all ${
              isEnsayosActive
                ? '!text-[#38bdf8] border-[#38bdf8]/50 bg-[#38bdf8]/10 font-semibold'
                : 'text-neutral-300 border-transparent hover:!text-[#38bdf8] hover:border-[#38bdf8]/40 hover:bg-[#38bdf8]/5'
            }`}
          >
            Ensayos
          </Link>

          <UserMenu user={user} />
        </nav>

        {/* ========================================================= */}
        {/* NAVEGACIÓN MÓVIL (Basada en <details> nativo sin fallos)    */}
        {/* ========================================================= */}
        <div className="flex sm:hidden items-center gap-2">
          <UserMenu user={user} />

          <details className="group relative">
            <summary className="list-none p-2.5 rounded-lg bg-neutral-900 text-white border border-neutral-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center select-none">
              {/* Icono Hamburguesa */}
              <svg className="w-6 h-6 group-open:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icono Cerrar (X) */}
              <svg className="w-6 h-6 hidden group-open:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </summary>

            {/* Panel Desplegable Móvil */}
            <div className="absolute right-0 top-12 w-[calc(100vw-2rem)] max-w-xs bg-neutral-950 border border-neutral-800 rounded-2xl p-4 shadow-2xl z-[99999] space-y-3">
              
              <details className="group/sub">
                <summary className="list-none w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-neutral-200 bg-neutral-900 border border-neutral-800 cursor-pointer">
                  <span>Epopeya Cristera</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-open/sub:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>

                <div className="pl-3 mt-2 space-y-1 border-l border-neutral-800 ml-2">
                  <Link
                    href="/epopeya-cristera/anacleto-gonzalez-flores"
                    className="block px-3.5 py-3 rounded-lg text-xs text-neutral-300 hover:text-amber-400 bg-neutral-900 border border-neutral-800"
                  >
                    <div className="font-semibold text-white">Beato Anacleto González Flores</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">Vida, escritos y legado de los mártires</div>
                  </Link>
                </div>
              </details>

              <Link
                href="/ensayos"
                className="block px-4 py-3 rounded-xl text-sm font-medium text-neutral-200 bg-neutral-900 border border-neutral-800 text-center"
              >
                Ensayos
              </Link>

            </div>
          </details>
        </div>

      </div>
    </header>
  )
}