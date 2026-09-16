export function formatearFecha(fechaString?: string | Date): string {
  if (!fechaString) return ''

  const fecha = new Date(fechaString)
  if (isNaN(fecha.getTime())) return ''

  // Forzamos la zona horaria de México para que respete el día calendario local
  const opciones: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Mexico_City', 
  }

  const fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(fecha)

  // Capitalizamos la primera letra
  return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)
}