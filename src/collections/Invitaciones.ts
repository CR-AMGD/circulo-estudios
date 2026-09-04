import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/roles'

export const Invitaciones: CollectionConfig = {
  slug: 'invitaciones',
  labels: {
    singular: 'Enlace de Invitación',
    plural: 'Enlaces de Invitación',
  },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'activo', 'enlaceCompleto', 'updatedAt'],
    // Oculta la colección del panel lateral y dashboard si el usuario no es admin
    hidden: ({ user }) => user?.rol !== 'admin',
  },
  access: {
    read: () => true, 
    create: isAdmin,   
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      defaultValue: 'Invitación General WhatsApp',
      admin: {
        description: 'Nombre de referencia para identificar este enlace.',
      },
    },
    {
      name: 'activo',
      type: 'checkbox',
      defaultValue: true,
      label: 'Acceso Habilitado (Switch)',
      admin: {
        description: 'Desactiva este interruptor para bloquear instantáneamente nuevos registros.',
      },
    },
    {
      name: 'token',
      type: 'text',
      required: true,
      unique: true,
      defaultValue: () => 'acceso-general-colaboradores',
      admin: {
        description: 'Modifica este identificador si deseas cambiar la ruta final del enlace.',
      },
    },
    {
      name: 'enlaceCompleto',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Copia este enlace completo para enviarlo por WhatsApp:',
        components: {
          // Inyectamos nuestro componente personalizado justo debajo del input
          Field: '@/components/EnlaceInvitacionField',
        },
      },
      hooks: {
        afterRead: [
          ({ data }) => {
            const token = data?.token || 'acceso-general-colaboradores'
            const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
            return `${baseUrl}/invitacion/${token}`
          },
        ],
      },
    },
  ],
}