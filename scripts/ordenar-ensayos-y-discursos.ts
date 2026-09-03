import { getPayload } from 'payload'
import config from '../src/payload.config'

const ordenEnsayos = [
  { titulo: 'EL VERDADERO SENTIDO DE LA VIDA', fecha: '1916-08-26' },
  { titulo: 'LA ARISTOCRACIA DEL TALENTO', fecha: '1916-08-27' },
  { titulo: 'EL ARTE Y LA CIVILIZACION', fecha: '1916-08-28' },
  { titulo: 'LA LITERATURA Y LA CIVILIZACION', fecha: '1916-08-29' },
  { titulo: 'LA MISION DE LA MUJER', fecha: '1916-08-30' },
]

const CATEGORIA_SLUG = 'ensayos-y-discursos'

const ordenarEnsayos = async () => {
  try {
    const payload = await getPayload({ config })

    console.log(`🔍 Buscando categoría con slug "${CATEGORIA_SLUG}"...`)

    // 1. Obtener la categoría
    const categoriaQuery = await payload.find({
      collection: 'categorias',
      where: { slug: { equals: CATEGORIA_SLUG } },
    })

    if (categoriaQuery.docs.length === 0) {
      throw new Error(`No se encontró la categoría con slug "${CATEGORIA_SLUG}" en la base de datos.`)
    }

    const categoriaId = categoriaQuery.docs[0].id

    // 2. Obtener los ensayos pertenecientes a esa categoría
    const ensayosQuery = await payload.find({
      collection: 'ensayos',
      where: { categoria: { equals: categoriaId } },
      limit: 100,
    })

    const ensayosExistentes = ensayosQuery.docs
    console.log(`📊 Ensayos encontrados en la base de datos: ${ensayosExistentes.length}`)

    // 3. Validación de títulos
    const titulosEsperados = ordenEnsayos.map((e) => e.titulo)
    const titulosExistentes = ensayosExistentes.map((e) => e.titulo)

    // Detectar títulos faltantes
    const faltantes = titulosEsperados.filter((t) => !titulosExistentes.includes(t))

    // Detectar títulos inesperados dentro de la categoría
    const inesperados = titulosExistentes.filter((t) => !titulosEsperados.includes(t))

    if (inesperados.length > 0) {
      console.warn(`⚠️ Títulos no mapeados encontrados en la categoría:`, inesperados)
    }

    if (faltantes.length > 0) {
      console.error(`❌ ERROR: No se puede proceder. Faltan ${faltantes.length} ensayos:`)
      faltantes.forEach((t) => console.error(`   - ${t}`))
      process.exit(1)
    }

    console.log('✅ Verificación exitosa. Los 5 ensayos existen. Procediendo a actualizar fechas...\n')

    // 4. Actualizar fechas
    let actualizadosCount = 0

    for (const item of ordenEnsayos) {
      const ensayoTarget = ensayosExistentes.find((e) => e.titulo === item.titulo)

      if (ensayoTarget) {
        const fechaISO = `${item.fecha}T00:00:00.000Z`

        await payload.update({
          collection: 'ensayos',
          id: ensayoTarget.id,
          data: {
            fechaPublicacion: fechaISO,
          },
        })

        console.log(`✓ ${item.titulo} → ${item.fecha}`)
        actualizadosCount++
      }
    }

    console.log(`\n🎉 ${actualizadosCount}/${ordenEnsayos.length} ensayos actualizados correctamente.`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error durante la actualización:', error)
    process.exit(1)
  }
}

ordenarEnsayos()