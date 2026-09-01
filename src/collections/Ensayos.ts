import type { Access, CollectionConfig, Where } from 'payload'

import {
  lexicalEditor,
  AlignFeature,
  FixedToolbarFeature,
  HeadingFeature,
  BlockquoteFeature,
} from '@payloadcms/richtext-lexical'

const esOwnerOAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.rol === 'admin') return true

  const query: Where = {
    autorRef: {
      equals: user.id,
    },
  }
  return query
}

export const Ensayos: CollectionConfig = {
  slug: 'ensayos',

  labels: {
    singular: 'Ensayo',
    plural: 'Ensayos',
  },

  versions: {
    drafts: true,
  },

  admin: {
    useAsTitle: 'titulo',

    preview: (doc) => {
      if (doc?.id) {
        return `/ensayos/preview/${doc.id}`
      }
      return null
    },

    baseListFilter: ({ req }) => {
      if (req?.user?.rol === 'admin') return null
      if (!req?.user) return null

      return {
        autorRef: {
          equals: req.user.id,
        },
      }
    },
  },

  access: {
    read: ({ req: { user } }): boolean | Where => {
      if (user?.rol === 'admin') return true

      if (user) {
        const query: Where = {
          or: [
            { _status: { equals: 'published' } },
            { autorRef: { equals: user.id } },
          ],
        }
        return query
      }

      const queryPublic: Where = {
        _status: { equals: 'published' },
      }
      return queryPublic
    },
    create: ({ req: { user } }) => Boolean(user),
    update: esOwnerOAdmin,
    delete: esOwnerOAdmin,
  },

  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      label: 'Título del Ensayo',
    },
    {
      name: 'autorRef',
      type: 'relationship',
      relationTo: 'users',
      defaultValue: ({ user }) => user?.id,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      label: 'Creado por (Usuario de Plataforma)',
    },
    {
      name: 'autor',
      type: 'relationship',
      relationTo: 'autores',
      required: true,
      hasMany: true,
      label: 'Firma de Autor(es)',
      admin: {
        description: 'Perfil del autor o coautores del escrito.',
      },
    },
    {
      name: 'categoria',
      type: 'select',
      label: 'Sección / Categoría',
      defaultValue: 'general',
      options: [
        { label: 'General / Otros', value: 'general' },
        { label: 'Anacleto González Flores', value: 'anacleto-gonzalez-flores' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'subcategoria',
      type: 'select',
      label: 'Obra / Libro',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.categoria === 'anacleto-gonzalez-flores',
      },
      options: [
        { label: 'La cuestión religiosa en Jalisco', value: 'la-cuestion-religiosa' },
        { label: 'Ensayos y discursos', value: 'ensayos-y-discursos' },
        { label: 'Tú serás Rey', value: 'tu-seras-rey' },
        { label: 'El plebiscito de los mártires', value: 'el-plebiscito-de-los-martires' },
      ],
    },

    // ==========================================
    // RELACIONES FILOSÓFICAS / ESTRUCTURA DE DEBATE
    // ==========================================
    {
      name: 'conversacion',
      type: 'relationship',
      relationTo: 'conversaciones',
      hasMany: false,
      label: 'Pertenece a Conversación / Hilo',
      admin: {
        position: 'sidebar',
        description: 'Hilo conceptual o debate bajo el cual se enmarca este texto.',
      },
    },
    {
      name: 'parentEssay',
      type: 'relationship',
      relationTo: 'ensayos',
      hasMany: false,
      label: 'Deriva de (Ensayo Padre)',
      admin: {
        position: 'sidebar',
        description: 'Texto base del cual surge esta réplica, adenda o respuesta.',
      },
    },
    {
      name: 'relatedEssays',
      type: 'relationship',
      relationTo: 'ensayos',
      hasMany: true,
      label: 'Dialoga con (Ensayos Relacionados)',
      admin: {
        position: 'sidebar',
        description: 'Textos con los que establece debate o referencia cruzada.',
      },
    },

    {
      name: 'resumen',
      type: 'textarea',
      label: 'Resumen / Introducción Breve',
    },
    {
      name: 'contenido',
      type: 'richText',
      required: true,
      label: 'Contenido del Ensayo / Transcripción',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          AlignFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          BlockquoteFeature(),
        ],
      }),
    },
    {
      name: 'pdfAdjunto',
      type: 'upload',
      relationTo: 'media',
      label: 'Documento PDF Adjunto (Opcional)',
    },
    {
      name: 'fechaPublicacion',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      label: 'Fecha de Publicación',
      defaultValue: () => new Date().toISOString(),
    },
  ],
}