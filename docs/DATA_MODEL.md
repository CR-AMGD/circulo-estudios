```markdown
# Modelo de Datos y Colecciones

El modelo de datos está estructurado en torno a colecciones de Payload CMS, usando TypeScript para asegurar la integridad de tipos en toda la aplicación.

## 📦 Colecciones (`src/collections/`)

### 1. `Ensayos` (`Ensayos.ts`)
Colección principal del repositorio.
* **Versionamiento:** Soporte de borradores (`drafts: true`).
* **Campos clave:** 
  * `titulo` (Text, required)
  * `contenido` (RichText Lexical: Headings, Blockquote, Align, FixedToolbar)
  * `resumen` (Textarea)
  * `categoria` (Select: `general`, `anacleto-gonzalez-flores`)
  * `subcategoria` (Select: Obra/Libro condicional)
  * `pdfAdjunto` (Upload -> Media)
  * `fechaPublicacion` (Date)
* **Relaciones de Debate:**
  * `conversacion` (Relationship -> `conversaciones`): Hilo temático al que se suscribe el texto.
  * `parentEssay` (Relationship -> `ensayos`): Ensayo origen del cual deriva una réplica o adenda.
  * `relatedEssays` (Relationship -> `ensayos` [hasMany]): Colección de ensayos con los que establece debate cruzado.

### 2. `Autores` (`Autores.ts`)
Perfiles de autores históricos, filósofos o colaboradores.
* Permite independizar la firma visible de un texto de la cuenta de usuario que subió el documento a la plataforma.

### 3. `Conversaciones` (`Conversaciones.ts`)
Estructura de agrupación conceptual para debates filosóficos que contienen múltiples ensayos.

### 4. `Eventos` (`Eventos.ts`)
Registro de actividades, foros académicos y fechas históricas asociadas al círculo de estudios.

### 5. `Media` (`Media.ts`)
Colección centralizada de gestión de archivos multimedia y documentos PDF adjuntos.

### 6. `Users` (`Users.ts`)
Cuentas de acceso a la plataforma.
* **Campos clave:** `email`, `nombre`, `rol` (`admin`, `colaborador`).
* **Control de Acceso (ACL):** Determina permisos de creación, actualización y borrado basados en pertenencia de documentos (`esOwnerOAdmin`).

---

## 🔗 Matriz de Relaciones

```text
[ Users ] ──(crea/administra)──> [ Ensayos ] <──(adjunta)── [ Media ]
                                   │   │
  [ Autores ] ◄──(firmado por)─────┘   └───(pertenece a)──> [ Conversaciones ]
                                   │
                                   ├───(deriva de)───────> [ Ensayos (parent) ]
                                   └───(dialoga con)─────> [ Ensayos (related) ]