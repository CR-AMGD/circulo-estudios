'use client'
import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import { Modal, useModal } from '@payloadcms/ui'

interface Ensayo {
  id: string
  titulo: string
}

const modalID = 'parent-essay-search-modal'

export default function ParentEssaySelector({ path, label, field }: { path: string; label: string; field?: { admin?: { description?: string } } }) {
  const { value, setValue } = useField<string>({ path })
  const { toggleModal } = useModal()
  const [searchQuery, setSearchQuery] = useState('')
  const [ensayos, setEnsayos] = useState<Ensayo[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTitle, setSelectedTitle] = useState<string>('')

  useEffect(() => {
    const fetchEnsayos = async () => {
      setLoading(true)
      try {
        const query = searchQuery ? `&where[titulo][like]=${encodeURIComponent(searchQuery)}` : ''
        const res = await fetch(`/api/ensayos?limit=10${query}`)
        const data = await res.json()
        if (data && data.docs) {
          setEnsayos(data.docs)
        }
      } catch (error) {
        console.error('Error buscando ensayos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnsayos()
  }, [searchQuery])

  useEffect(() => {
    if (value) {
      fetch(`/api/ensayos/${value}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.titulo) {
            setSelectedTitle(data.titulo)
          }
        })
        .catch(() => setSelectedTitle(value))
    } else {
      setSelectedTitle('')
    }
  }, [value])

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--theme-elevation-800)' }}>
        {label}
      </label>
      
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <div style={{ 
          flex: 1, 
          padding: '7px 10px', 
          background: 'var(--theme-elevation-50)', 
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: '6px',
          fontSize: '13px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: selectedTitle ? 'var(--theme-text)' : 'var(--theme-elevation-400)'
        }}>
          {selectedTitle ? selectedTitle : 'Seleccionar valor...'}
        </div>

        {/* Botón con diseño estilizado y moderno */}
        <button
          type="button"
          onClick={() => toggleModal(modalID)}
          style={{
            background: 'var(--theme-elevation-100)',
            color: 'var(--theme-elevation-800)',
            border: '1px solid var(--theme-elevation-200)',
            padding: '7px 10px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '35px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--theme-elevation-200)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--theme-elevation-100)'
          }}
          title="Búsqueda Inteligente"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>

        {value && (
          <button
            type="button"
            onClick={() => setValue(null)}
            style={{
              background: 'transparent',
              color: 'var(--theme-error-500)',
              border: '1px solid var(--theme-elevation-200)',
              padding: '7px 9px',
              borderRadius: '6px',
              cursor: 'pointer',
              height: '35px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Limpiar selección"
          >
            ✕
          </button>
        )}
      </div>

      {/* Mensaje de ayuda / descripción inferior idéntico al estilo de Payload */}
      {field?.admin?.description && (
        <div style={{ fontSize: '12px', color: 'var(--theme-elevation-500)', marginTop: '0.4rem', lineHeight: '1.4' }}>
          {field.admin.description}
        </div>
      )}

      {/* Modal Nativo de Búsqueda */}
      <Modal slug={modalID} style={{ maxWidth: '600px', width: '100%', margin: 'auto' }}>
        <div style={{
          background: 'var(--theme-elevation-0)',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          border: '1px solid var(--theme-elevation-150)'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>Seleccionar Ensayo Padre</h3>
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '10px 14px',
              margin: '12px 0',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '6px',
              background: 'var(--theme-elevation-50)',
              color: 'var(--theme-text)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          
          <div style={{ minHeight: '200px', maxHeight: '320px', overflowY: 'auto', border: '1px solid var(--theme-elevation-150)', borderRadius: '6px', padding: '6px' }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: 'var(--theme-elevation-500)', padding: '20px', fontSize: '13px' }}>Buscando...</p>
            ) : ensayos.length > 0 ? (
              ensayos.map((ensayo) => (
                <div
                  key={ensayo.id}
                  onClick={() => {
                    setValue(ensayo.id)
                    toggleModal(modalID)
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--theme-elevation-150)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontWeight: 500 }}>{ensayo.titulo}</span>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--theme-elevation-500)', padding: '20px', fontSize: '13px' }}>No se encontraron ensayos.</p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => toggleModal(modalID)}
              style={{
                padding: '8px 16px',
                background: 'var(--theme-elevation-150)',
                color: 'var(--theme-text)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}