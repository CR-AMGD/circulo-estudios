import dotenv from 'dotenv'
import path from 'path'

// 1. Cargamos las variables de entorno primero
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function generarSlugsFaltantes() {
  // 2. Importamos Payload y la configuración de forma dinámica DESPUÉS de cargar el .env
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')

  const payload = await getPayload({ config })

  console.log('🔍 Buscando ensayos sin slug...')

  const ensayos = await payload.find({
    collection: 'ensayos',
    limit: 1000,
    depth: 0,
    draft: true,
  })

  let actualizados = 0

  for (const ensayo of ensayos.docs) {
    if ((ensayo as any).slug) {
      continue
    }

    const titulo = (ensayo as any).titulo || 'ensayo'
    const slugGenerado = titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    try {
      await payload.update({
        collection: 'ensayos',
        id: ensayo.id,
        data: {
          slug: slugGenerado,
        },
      })
      console.log(`✅ Slug generado para "${titulo}" ──> /ensayos/${slugGenerado}`)
      actualizados++
    } catch (error) {
      console.error(`❌ Error actualizando el ensayo ${ensayo.id}:`, error)
    }
  }

  console.log(`\n🎉 Migración completa. Se actualizaron ${actualizados} ensayos con éxito.`)
  process.exit(0)
}

generarSlugsFaltantes().catch((err) => {
  console.error('Error fatal ejecutando el script:', err)
  process.exit(1)
})