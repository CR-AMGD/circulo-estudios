import type { CollectionConfig } from 'payload'
import { isAdmin, canSeeCollection } from '../access/roles'

export const Conversaciones: CollectionConfig = {
  slug: 'conversaciones',
  labels: {
    singular: 'Conversación / Hilo',
    plural: 'Conversaciones / Hilos',
  },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'estado', 'createdAt'],
    // Se oculta del menú si el usuario no es admin y tampoco tiene el permiso dinámico asignado
    hidden: ({ user }) => {
      if (user?.rol === 'admin') return false
      const permitidas = (user as any)?.coleccionesPermitidas || []
      return !permitidas.includes('conversaciones')
    },
  },
  access: {
    // Lectura dinámica condicionada a si el admin le dio acceso o si es admin
    read: canSeeCollection('conversaciones'),
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      label: 'Título de la Conversación / Eje de Debate',
      admin: {
        description: 'Nombre del hilo conceptual que agrupa los ensayos.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Identificador para la URL (ej. debate-derecho-natural).',
      },
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Premisa / Contexto del Debate',
      admin: {
        description: 'Introducción a las preguntas o planteamientos centrales de este hilo.',
      },
    },
    {
      name: 'estado',
      type: 'select',
      defaultValue: 'abierta',
      options: [
        { label: 'Abierta (En debate active)', value: 'abierta' },
        { label: 'Concluida (Sintetizada)', value: 'concluida' },
        { label: 'Archivada', value: 'archivada' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'moderador',
      type: 'relationship',
      relationTo: 'users',
      label: 'Moderador del Hilo',
      admin: {
        position: 'sidebar',
        description: 'Usuario encargado de coordinar la síntesis o flujo de la discusión.',
      },
    },
  ],
}