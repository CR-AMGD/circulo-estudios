import type { CollectionConfig } from 'payload'
import { isAuthenticated, isAdmin } from '../access/roles'

export const Autores: CollectionConfig = {
  slug: 'autores',
  labels: {
    singular: 'Autor',
    plural: 'Autores',
  },
  admin: {
    useAsTitle: 'nombre',
  },
  access: {
    read: isAuthenticated,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre Completo / Seudónimo',
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotografía / Retrato',
    },
    {
      name: 'biografia',
      type: 'textarea',
      label: 'Biografía Breve',
      admin: {
        description: 'Semblanza del autor, contexto histórico o perfil académico.',
      },
    },
    {
      name: 'usuarioAsociado',
      type: 'relationship',
      relationTo: 'users',
      label: 'Usuario de Plataforma (Opcional)',
      admin: {
        position: 'sidebar',
        description: 'Víncula este perfil con una cuenta de usuario si aplica.',
      },
    },
  ],
}