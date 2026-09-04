import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'

const normalizarNombreAutor = (slugAutor: string): string => {
  const mapaNombres: Record<string, string> = {
    'beato-anacleto-gonzalez-flores': 'Beato Anacleto González Flores',
    'anacleto-gonzalez-flores': 'Beato Anacleto González Flores',
  }

  if (mapaNombres[slugAutor]) return mapaNombres[slugAutor]

  return slugAutor
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const importEnsayos = async () => {
  try {
    const payload = await getPayload({ config })

    // 1. Obtener usuario admin para autorRef
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (users.docs.length === 0) {
      throw new Error('No se encontró ningún usuario en la BD para asignar como autorRef.')
    }
    const adminUser = users.docs[0]

    // 2. Leer JSON (Permite pasar el nombre del archivo como parámetro)
    const jsonFilename = process.argv[2] || 'cuestion_religiosa_jalisco.json'
    const filePath = path.join(process.cwd(), 'data', jsonFilename)

    if (!fs.existsSync(filePath)) {
      throw new Error(`No se encontró el archivo JSON en: ${filePath}`)
    }

    const rawData = fs.readFileSync(filePath, 'utf-8')
    const { ensayos, metadata } = JSON.parse(rawData)

    console.log(`🚀 Iniciando ingesta de ${ensayos.length} ensayos desde "${jsonFilename}"...`)

    // Mapa de nombres formateados para categorías
    const mapaCategorias: Record<string, string> = {
      'la-cuestion-religiosa-en-jalisco': 'La Cuestión Religiosa en Jalisco',
      'ensayos-y-discursos': 'Ensayos y discursos',
    }

    for (const ensayo of ensayos) {
      // Evitar duplicados por TÍTULO
      const existingEssay = await payload.find({
        collection: 'ensayos',
        where: { titulo: { equals: ensayo.titulo } },
      })

      if (existingEssay.docs.length > 0) {
        console.log(`⚠️ Ensayo "${ensayo.titulo}" ya existe. Omitiendo...`)
        continue
      }

      // --- RESOLVER O CREAR CATEGORÍA ---
      const categoriaSlug = ensayo.categoria || metadata.categoria_default
      let categoriaId: string | number | null = null

      const categoriaQuery = await payload.find({
        collection: 'categorias',
        where: { slug: { equals: categoriaSlug } },
      })

      if (categoriaQuery.docs.length > 0) {
        categoriaId = categoriaQuery.docs[0].id
      } else {
        const nombreCategoria = mapaCategorias[categoriaSlug] || categoriaSlug.replace(/-/g, ' ').toUpperCase()
        const nuevaCategoria = await payload.create({
          collection: 'categorias',
          data: {
            nombre: nombreCategoria,
            slug: categoriaSlug,
            colorAcento: 'amber',
          },
        })
        categoriaId = nuevaCategoria.id
        console.log(`➕ Categoría creada: "${nuevaCategoria.nombre}" (Slug: ${nuevaCategoria.slug})`)
      }

      // --- RESOLVER O CREAR AUTORES ---
      const autoresSlugs: string[] = ensayo.autor || [metadata.autor_default]
      const autoresIds: (string | number)[] = []

      for (const slugAutor of autoresSlugs) {
        const nombreBuscado = normalizarNombreAutor(slugAutor)

        const autorQuery = await payload.find({
          collection: 'autores',
          where: { nombre: { equals: nombreBuscado } },
        })

        if (autorQuery.docs.length > 0) {
          autoresIds.push(autorQuery.docs[0].id)
        } else {
          const nuevoAutor = await payload.create({
            collection: 'autores',
            data: {
              nombre: nombreBuscado,
              biografia: 'Perfil generado automáticamente durante la ingesta.',
            },
          })
          autoresIds.push(nuevoAutor.id)
          console.log(`👤 Autor creado: "${nuevoAutor.nombre}"`)
        }
      }

      // --- RESOLVER FECHA Y CREAR ENSAYO ---
      const fechaEnsayo = ensayo.fechaPublicacion || (metadata.fecha_publicacion ? `${metadata.fecha_publicacion}T00:00:00.000Z` : new Date().toISOString())

      const ensayoCreado = await payload.create({
        collection: 'ensayos',
        data: {
          titulo: ensayo.titulo,
          autorRef: adminUser.id,
          autor: autoresIds as any,
          categoria: categoriaId as any,
          resumen: ensayo.resumen || `Capítulo perteneciente a ${metadata.pdf_fuente || 'la obra'}.`,
          contenido: ensayo.contenido,
          fechaPublicacion: fechaEnsayo,
          _status: 'published',
        },
      })

      console.log(`✅ Cargado exitosamente: "${ensayoCreado.titulo}" (ID: ${ensayoCreado.id})`)
    }

    console.log('\n🎉 Importación finalizada con éxito.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error en el proceso de ingesta:', error)
    process.exit(1)
  }
}

importEnsayos()