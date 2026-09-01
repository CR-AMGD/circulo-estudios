import type { CollectionConfig } from 'payload'

export const Eventos: CollectionConfig = {
  slug: 'eventos',
  admin: {
    useAsTitle: 'titulo',
    // Oculta la colección Eventos del menú lateral si el usuario no es admin
    hidden: ({ user }) => user?.rol !== 'admin',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
    },
  ],
}