import type { CollectionConfig, FieldHook } from 'payload'
import { isAdmin, canSeeCollection } from '../access/roles'

// Función auxiliar para formatear slugs de forma limpia
const formatSlug = (val: string): string =>
  val
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const slugifyField: FieldHook = ({ value, data }) => {
  if (!value && data?.nombre) {
    return formatSlug(data.nombre)
  }
  return value ? formatSlug(value) : value
}

export const Categorias: CollectionConfig = {
  slug: 'categorias',

  labels: {
    singular: 'Categoría',
    plural: 'Categorías',
  },

  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'slug', 'categoriaPadre', 'colorAcento'],
    hidden: ({ user }) => {
      if (user?.rol === 'admin') return false
      const permitidas = (user as any)?.coleccionesPermitidas || []
      return !permitidas.includes('categorias')
    },
  },

  access: {
    read: canSeeCollection('categorias'),
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },

  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre de la Categoría / Subcategoría',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL (ej. historia-patria, epopeya-cristera)',
      admin: {
        description: 'Se genera automáticamente a partir del nombre si se deja en blanco.',
      },
      hooks: {
        beforeValidate: [slugifyField],
      },
    },
    {
      name: 'categoriaPadre',
      type: 'relationship',
      relationTo: 'categorias',
      hasMany: false,
      label: 'Categoría Padre (Opcional)',
      admin: {
        description: 'Si se deja vacío, actúa como Categoría Principal. Si se selecciona una, será una Subcategoría.',
      },
    },
    {
      name: 'colorAcento',
      type: 'select',
      defaultValue: 'sky',
      required: true,
      label: 'Color de Acento en UI',
      admin: {
        description: 'Color temático con el que se renderizará el frontend.',
      },
      options: [
        { label: '🔵 Azul (Sky)', value: 'sky' },
        { label: '🟡 Ámbar / Dorado (Epopeya / Cristera)', value: 'amber' },
        { label: '🟢 Esmeralda (Verde)', value: 'emerald' },
        { label: '🟣 Púrpura (Teoría Política)', value: 'purple' },
        { label: '🔴 Carmesí / Rojo', value: 'rose' },
      ],
    },
  ],
}