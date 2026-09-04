'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { UserMenu } from './UserMenu'
import { useState, useEffect } from 'react'

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

  const [forceAmbar, setForceAmbar] = useState(false)

  // Sincronizar el estado inicial recibido desde el servidor con el prop forceActiveSection
  useEffect(() => {
    if (forceActiveSection === 'epopeya-cristera') {
      setForceAmbar(true)
    } else {
      setForceAmbar(false)
    }
  }, [forceActiveSection, pathname])

  // Escuchar si la página hija activa el modo ámbar por pertenecer a Anacleto vía evento del cliente
  useEffect(() => {
    const handleForceAmbar = (e: CustomEvent) => {
      setForceAmbar(e.detail?.active ?? false)
    }

    window.addEventListener('set-navbar-ambar' as any, handleForceAmbar)

    return () => {
      window.removeEventListener('set-navbar-ambar' as any, handleForceAmbar)
    }
  }, [])

  const isEpopeyaActive = forceAmbar || pathname.includes('epopeya-cristera') || forceActiveSection === 'epopeya-cristera'
  const isEnsayosActive = (pathname.includes('ensayo') || forceActiveSection === 'ensayos') && !isEpopeyaActive

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
      {/* Círculo de Estudios con Icono Más Grande */}
      <Link 
        href="/" 
        className="flex items-center gap-3 group no-underline"
      >
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

        <div className="flex flex-col text-left">
          <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors leading-tight">
            Círculo de Estudios
          </span>
          <span className="text-[11px] font-medium text-[#38bdf8] tracking-wide leading-tight">
            Luis María Grignion de Montfort
          </span>
        </div>
      </Link>

        {/* Enlaces de Navegación */}
        <nav className="flex items-center gap-4 text-sm font-medium">
          
          {/* Menú Desplegable: Epopeya Cristera (Dorado/Ámbar) */}
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

            {/* Submenú Flotante */}
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

          {/* Ensayos -> Cuadro sin fondo Cyan en Hover y Activo */}
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

          {/* Menú de usuario */}
          <UserMenu user={user} />
        </nav>

      </div>
    </header>
  )
}