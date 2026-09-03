import type { Access, Where } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.rol === 'admin')
}

export const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

// Función dinámica para verificar si el usuario tiene acceso a una colección oculta
export const canSeeCollection = (slugColeccion: string): Access => {
  return ({ req: { user } }) => {
    if (!user) return false
    if (user.rol === 'admin') return true

    // Si el usuario tiene la colección en su arreglo de permisos otorgados por el admin
    const permitidas = (user as any)?.coleccionesPermitidas || []
    return permitidas.includes(slugColeccion)
  }
}

// Control granular de ensayos (Anacleto u propios)
export const canUpdateOrDeleteEnsayo: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.rol === 'admin') return true

  if (user.rol === 'autor') {
    const query: Where = {
      'autor.nombre': {
        equals: 'Beato Anacleto González Flores',
      },
    }
    return query
  }

  return false
}