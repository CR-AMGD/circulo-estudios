import type { CollectionConfig } from 'payload'

export const Conversaciones: CollectionConfig = {
  slug: 'conversaciones',
  labels: {
    singular: 'Conversación / Hilo',
    plural: 'Conversaciones / Hilos',
  },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'estado', 'createdAt'],
  },
  access: {
    read: () => true, // Acceso público para visualizar los hilos de discusión
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