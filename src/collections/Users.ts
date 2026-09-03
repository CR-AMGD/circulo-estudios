import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    // Oculta la pestaña de usuarios en la barra lateral si el rol no es admin
    hidden: ({ user }) => user?.rol !== 'admin',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => user?.rol === 'admin',
    update: ({ req: { user } }) => user?.rol === 'admin',
    delete: ({ req: { user } }) => user?.rol === 'admin',
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
    // <--- NUEVO: Campo dinámico controlado por el Admin en la UI
    {
      name: 'coleccionesPermitidas',
      type: 'select',
      hasMany: true,
      label: 'Colecciones Visibles para Colaborador',
      admin: {
        description: 'Selecciona qué colecciones adicionales puede visualizar este usuario además de Ensayos y Autores.',
        condition: (data) => data?.rol !== 'admin', // Solo aplica si no es admin
      },
      options: [
        { label: 'Categorías', value: 'categorias' },
        { label: 'Conversaciones / Hilos', value: 'conversaciones' },
        { label: 'Media (Archivos / Imágenes)', value: 'media' },
        { label: 'Eventos', value: 'eventos' },
      ],
    },
  ],
}