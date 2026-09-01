// src/collections/Categorias.ts
import type { CollectionConfig } from 'payload'

export const Categorias: CollectionConfig = {
  slug: 'categorias',

  labels: {
    singular: 'Categoría',
    plural: 'Categorías',
  },

  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'slug', 'colorAcento'],
  },

  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre de la Categoría',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug URL (ej. epopeya-cristera)',
    },
    {
      name: 'colorAcento',
      type: 'select',
      defaultValue: 'sky',
      required: true,
      options: [
        { label: 'Azul (Sky)', value: 'sky' },
        { label: 'Ámbar / Dorado (Epopeya)', value: 'amber' },
        { label: 'Esmeralda (Verde)', value: 'emerald' },
        { label: 'Púrpura', value: 'purple' },
      ],
      label: 'Color de Acento en UI',
    },
  ],
}