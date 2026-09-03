import type { CollectionConfig } from 'payload'
import { isAuthenticated, isAdmin, canSeeCollection } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    // Se oculta del menú si el usuario no es admin y tampoco tiene el permiso dinámico asignado
    hidden: ({ user }) => {
      if (user?.rol === 'admin') return false
      const permitidas = (user as any)?.coleccionesPermitidas || []
      return !permitidas.includes('media')
    },
  },
  access: {
    // Lectura pública o condicionada según lo que asigne el admin
    read: canSeeCollection('media'),
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}