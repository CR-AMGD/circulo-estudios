import type { Access, CollectionConfig, Where } from 'payload'
import { isAdmin, isAuthenticated, canUpdateOrDeleteEnsayo } from '../access/roles'

import {
  lexicalEditor,
  AlignFeature,
  FixedToolbarFeature,
  HeadingFeature,
  BlockquoteFeature,
} from '@payloadcms/richtext-lexical'

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

    components: {
      edit: {
        beforeDocumentControls: [
          '@/components/ViewOnSiteButton#ViewOnSiteButton',
        ],
      },
    },

    // Si es colaborador, filtramos la lista en el panel para que vea los suyos o los de Anacleto
    baseListFilter: ({ req }) => {
      if (req?.user?.rol === 'admin') return null
      if (!req?.user) return null

      return {
        or: [
          { autorRef: { equals: req.user.id } },
          { 'autor.nombre': { equals: 'Beato Anacleto González Flores' } },
        ],
      } as any
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
            { 'autor.nombre': { equals: 'Beato Anacleto González Flores' } },
          ],
        }
        return query as any
      }

      const queryPublic: Where = {
        _status: { equals: 'published' },
      }
      return queryPublic
    },
    create: isAuthenticated,
    update: canUpdateOrDeleteEnsayo,
    delete: isAdmin,
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

    // ==========================================
    // ORDEN DE RELACIONES Y ESTRUCTURA (ADMIN)
    // ==========================================
    {
      name: 'categoria',
      type: 'relationship',
      relationTo: 'categorias',
      hasMany: false,
      label: 'Sección / Categoría',
      admin: {
        position: 'sidebar',
        description: 'Categoría o subcategoría temática a la que pertenece el ensayo.',
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
        description: 'Texto base al cual responde este ensayo.',
        components: {
          Field: '@/components/ParentEssaySelector',
        },
      },
    },
    {
      name: 'conversacion',
      type: 'relationship',
      relationTo: 'conversaciones',
      hasMany: false,
      label: 'Pertenece a Conversación / Hilo',
      admin: {
        position: 'sidebar',
      },
      access: {
        read: ({ req: { user } }) => user?.rol === 'admin',
        create: ({ req: { user } }) => user?.rol === 'admin',
        update: ({ req: { user } }) => user?.rol === 'admin',
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
      },
      access: {
        read: ({ req: { user } }) => user?.rol === 'admin',
        create: ({ req: { user } }) => user?.rol === 'admin',
        update: ({ req: { user } }) => user?.rol === 'admin',
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