import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: Request) {
  try {
    const { token, email, password, nombreAutor } = await request.json()

    if (!token || !email || !password || !nombreAutor) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Validar que el enlace general siga activo
    const result = await payload.find({
      collection: 'invitaciones',
      where: {
        token: { equals: token },
      },
      limit: 1,
    })

    if (result.docs.length === 0 || !result.docs[0].activo) {
      return NextResponse.json({ error: 'El registro a través de este enlace está cerrado.' }, { status: 400 })
    }

    // 1. Crear automáticamente el perfil de Autor
    const nuevoAutor = await payload.create({
      collection: 'autores',
      data: {
        nombre: nombreAutor,
      },
    })

    // 2. Crear el usuario en la plataforma con el rol de colaborador y su nombre obligatorio
    await payload.create({
      collection: 'users',
      data: {
        email: email,
        password: password,
        nombre: nombreAutor, // <--- Añadido para cumplir con required: true en Users.ts
        rol: 'autor',        // Coincide con el value definido en Users.ts ('autor' o 'admin')
      },
    })

    return NextResponse.json({ success: true, message: 'Registro completado con éxito.' })
  } catch (error: any) {
    console.error('Error al registrar colaborador:', error)
    const mensaje = error?.data?.errors?.[0]?.message || 'Error al procesar el registro (es posible que el correo ya esté registrado).'
    return NextResponse.json({ error: mensaje }, { status: 500 })
  }
}