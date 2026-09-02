import { getPayload } from 'payload'
import config from '../src/payload.config'

const ordenEnsayos = [
  { titulo: 'Prólogo', fecha: '1920-05-11' },
  { titulo: 'Génesis', fecha: '1920-05-12' },
  { titulo: 'La irrupción y la barbarie', fecha: '1920-05-13' },
  { titulo: 'La espada y la ley', fecha: '1920-05-14' },
  { titulo: 'El constituyente y la constitución de 1917', fecha: '1920-05-15' },
  { titulo: 'El primer encuentro', fecha: '1920-05-16' },
  { titulo: 'Ecce homo', fecha: '1920-05-17' },
  { titulo: 'Vox Populi', fecha: '1920-05-18' },
  { titulo: 'El talón de Aquiles', fecha: '1920-05-19' },
  { titulo: 'Victoria y Esperanza', fecha: '1920-05-20' },
  { titulo: 'Siempre de pie', fecha: '1920-05-21' },
  { titulo: 'El penacho de Godofredo', fecha: '1920-05-22' },
  { titulo: 'Hacia el porvenir', fecha: '1920-05-23' },
]

const CATEGORIA_SLUG = 'la-cuestion-religiosa-en-jalisco'

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

    console.log('✅ Verificación exitosa. Los 13 ensayos existen. Procediendo a actualizar fechas...\n')

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