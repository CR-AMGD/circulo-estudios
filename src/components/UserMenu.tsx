'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UserMenuProps {
  user?: {
    email: string
    nombre?: string
    rol?: string
  } | null
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Cerrar el menú si el usuario hace clic fuera del contenedor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', { method: 'POST' })
      setIsOpen(false)
      router.refresh()
      // Forzar recarga si quieres purgar por completo las cookies/contexto
      window.location.href = '/'
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const esAdmin = user?.rol === 'admin'

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      {/* Botón Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 hover:border-[#38bdf8] transition-colors focus:outline-none cursor-pointer"
        aria-label="Menú de usuario"
      >
        <svg
          className="w-5 h-5 text-neutral-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md bg-neutral-900 border border-neutral-800 shadow-xl py-1 z-50 text-white animate-in fade-in zoom-in-95 duration-100">
          {user ? (
            <>
              {/* Encabezado con datos del Usuario */}
              <div className="px-4 py-2 border-b border-neutral-800">
                <p className="text-[10px] uppercase tracking-wider text-[#38bdf8] font-bold">
                  {esAdmin ? 'Administrador' : 'Colaborador'}
                </p>
                <p className="text-sm font-semibold truncate text-white mt-0.5">
                  {user.nombre || user.email}
                </p>
              </div>

              {/* Acceso Dinámico al Panel */}
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                {esAdmin ? (
                  <>
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <span>Panel Admin</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Panel Editor</span>
                  </>
                )}
              </Link>

              {/* Botón Cerrar Sesión */}
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-neutral-800 transition-colors border-t border-neutral-800/80 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Cerrar Sesión</span>
              </button>
            </>
          ) : (
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Iniciar Sesión</span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}