import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Ensayos } from './collections/Ensayos'
import { Eventos } from './collections/Eventos'
import { Autores } from './collections/Autores'
import { Conversaciones } from './collections/Conversaciones'
import { Categorias } from './collections/Categorias'
import { Invitaciones } from './collections/Invitaciones'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'dark',
    meta: {
      titleSuffix: '- Círculo de Estudios Luis María Grignion de Montfort',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      views: {
        login: {
          Component: '@/components/CustomLogin#default',
        },
      },
      actions: ['/components/AdminHeader/CustomHeader#CustomHeader'],
      graphics: {
        Logo: {
          path: '/components/AdminHeaderTitle#AdminHeaderTitle',
        },
      },
      afterNavLinks: [
        '/components/AdminNav/CustomNav#CustomNav',
      ],
    },
  },
  // <--- Orden ajustado exactamente como lo solicitaste
  collections: [
    Users,
    Autores,
    Ensayos,
    Categorias,
    Eventos,
    Conversaciones,
    Media,
    Invitaciones,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})