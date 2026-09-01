import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    // Oculta la pestaña de usuarios en la barra lateral si el rol no es admin
    hidden: ({ user }) => user?.rol !== 'admin',
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre Completo',
    },
    {
      name: 'rol',
      type: 'select',
      required: true,
      defaultValue: 'autor',
      options: [
        { label: 'Administrador / Editor', value: 'admin' },
        { label: 'Autor / Colaborador', value: 'autor' },
      ],
      saveToJWT: true, // Guarda el rol en la sesión para validaciones rápidas
      access: {
        // Solo los administradores pueden cambiar los roles de los usuarios
        update: ({ req: { user } }) => user?.rol === 'admin',
      },
    },
  ],
}