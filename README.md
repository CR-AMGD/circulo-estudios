# Círculo de Estudios 📚

Plataforma académica y repositorio digital para la publicación, consulta, catálogo y debate de ensayos filosóficos y de teoría social.

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16 (App Router, Server Components)
- **CMS:** Payload CMS v3 (Native Integration & Lexical Rich Text)
- **Base de Datos:** MongoDB 8 (vía Mongoose Adapter) — en local se corre con Docker (replica set de un nodo)
- **Estilos:** Tailwind CSS
- **Testing:** Playwright (E2E) y Vitest (Integración)
- **Infraestructura:** Dockerizado (`Dockerfile`, `docker-compose.yml`)

## 🚀 Inicio Rápido Local

No necesitas Mongo Atlas para desarrollar: MongoDB corre en un contenedor Docker.
Requisitos: Docker y Corepack habilitado (`corepack enable`, una sola vez — así pnpm
usa la versión fijada en `packageManager`).

1. **Instalar dependencias:**

   ```bash
   pnpm install
   ```

2. **Configurar variables de entorno:**

   ```bash
   cp .env.example .env
   ```

   Edita `.env` y pon un valor cualquiera en `PAYLOAD_SECRET`. El `DATABASE_URL`
   por defecto ya apunta al MongoDB local de Docker.

3. **Levantar MongoDB (Docker):**

   ```bash
   pnpm db:up
   ```

   Arranca `mongo:8` como replica set `rs0` y espera a que quede listo. Los datos
   persisten en un volumen entre reinicios.

4. **Arrancar la app:**

   ```bash
   pnpm dev
   ```

   Disponible en `http://localhost:3000` (panel de administración en `/admin`).

5. **Crear el primer usuario administrador:** abre `/admin` y completa el
   formulario de onboarding de Payload.

6. **(Opcional) Importar ensayos de ejemplo:**

   ```bash
   pnpm db:seed                # usa data/cuestion_religiosa_jalisco.json
   pnpm db:seed ensayos.json   # o cualquier otro archivo de data/
   ```

   Requiere que ya exista el usuario admin del paso 5.

### Scripts de base de datos

| Script                        | Descripción                                         |
| ----------------------------- | --------------------------------------------------- |
| `pnpm db:up`                  | Levanta MongoDB en Docker y espera a que esté sano. |
| `pnpm db:down`                | Detiene el contenedor (conserva los datos).         |
| `pnpm db:logs`                | Sigue los logs de MongoDB.                          |
| `pnpm db:shell`               | Abre `mongosh` sobre la base `circulo-estudios`.    |
| `pnpm db:seed [archivo.json]` | Importa ensayos desde `data/`.                      |

Para más detalle (resetear la base, copiar datos reales desde Atlas con
`mongodump`/`mongorestore`, inspección con Compass) ver [`docs/LOCAL_DB.md`](docs/LOCAL_DB.md).
