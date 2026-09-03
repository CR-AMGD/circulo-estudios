import type { CollectionConfig } from 'payload'
import { isAuthenticated, isAdmin, canSeeCollection } from '../access/roles'

export const Eventos: CollectionConfig = {
  slug: 'eventos',
  admin: {
    useAsTitle: 'titulo',
    // Se oculta del menú si el usuario no es admin y tampoco tiene el permiso dinámico asignado
    hidden: ({ user }) => {
      if (user?.rol === 'admin') return false
      const permitidas = (user as any)?.coleccionesPermitidas || []
      return !permitidas.includes('eventos')
    },
  },
  access: {
    // Lectura condicionada al permiso asignado por el admin o rol admin
    read: canSeeCollection('eventos'),
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
    },
  ],
}