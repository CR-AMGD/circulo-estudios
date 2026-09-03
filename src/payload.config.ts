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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Círculo de Estudios Luis María Grignion de Montfort',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      actions: ['/components/AdminHeader/CustomHeader#CustomHeader'],
      graphics: {
        Logo: {
          path: '/components/AdminHeaderTitle#AdminHeaderTitle',
        },
      },
      // Lista única de componentes al final de la navegación lateral
      afterNavLinks: [
        '/components/AdminNav/CustomNav#CustomNav',
      ],
    },
  },
  collections: [Users, Media, Ensayos, Eventos, Autores, Conversaciones, Categorias],
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