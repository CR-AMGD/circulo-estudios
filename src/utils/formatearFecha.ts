export function formatearFecha(fechaString?: string | Date): string {
  if (!fechaString) return ''

  // Aseguramos interpretar la fecha correctamente sin desfasar zonas horarias
  const fecha = new Date(fechaString)

  // Usamos el formateador nativo en español
  const opciones: Intl.DateTimeFormatOptions = {
    weekday: 'long',  // "Martes"
    day: 'numeric',   // "11"
    month: 'long',    // "julio"
    year: 'numeric',  // "1920"
    timeZone: 'UTC',  // Mantiene la fecha exacta guardada en la base de datos
  }

  const fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(fecha)

  // Capitalizamos la primera letra (ej. "martes" -> "Martes")
  return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)
}