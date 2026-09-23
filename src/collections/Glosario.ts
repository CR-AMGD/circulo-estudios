import type { CollectionConfig } from 'payload'

export const Glosario: CollectionConfig = {
  slug: 'glosario',
  admin: {
    useAsTitle: 'termino',
    defaultColumns: ['termino', 'updatedAt'],
    labels: {
      singular: {
        en: 'Glosario',
        es: 'Glosario',
      },
      plural: {
        en: 'Glosario',
        es: 'Glosario',
      },
    },
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'termino',
      type: 'text',
      required: true,
      label: 'Término o Concepto',
    },
    {
      name: 'etimologia',
      type: 'textarea',
      label: 'Etimología u Origen',
    },
    {
      name: 'definicion',
      type: 'textarea',
      required: true,
      label: 'Definición Completa',
    },
  ],
}