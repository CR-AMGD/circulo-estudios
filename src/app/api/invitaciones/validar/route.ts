import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ valido: false, mensaje: 'Enlace no proporcionado.' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'invitaciones',
      where: {
        token: { equals: token },
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return NextResponse.json({ valido: false, mensaje: 'El enlace de invitación no existe.' }, { status: 404 })
    }

    const invitacion = result.docs[0]

    // Verificar si el switch está apagado
    if (!invitacion.activo) {
      return NextResponse.json({ 
        valido: false, 
        mensaje: 'Las inscripciones se encuentran cerradas temporalmente por el administrador.' 
      }, { status: 400 })
    }

    return NextResponse.json({ valido: true })
  } catch (error) {
    console.error('Error al validar enlace:', error)
    return NextResponse.json({ valido: false, mensaje: 'Error interno del servidor.' }, { status: 500 })
  }
}