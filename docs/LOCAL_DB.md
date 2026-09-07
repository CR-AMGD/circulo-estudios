# Base de Datos Local (MongoDB vía Docker)

En desarrollo, MongoDB corre en un contenedor Docker en lugar de Mongo Atlas.
La app Next/Payload sigue ejecutándose en el host (`pnpm dev`); solo la base de
datos está contenedorizada.

## Por qué un replica set de un nodo

Mongo Atlas siempre es un **replica set**. El adapter de Payload
(`@payloadcms/db-mongodb`) habilita transacciones únicamente cuando la URI de
conexión incluye la opción `replicaSet=` — no sondea la topología del servidor.
Un `mongod` standalone no soporta transacciones, así que Payload las desactivaría
en silencio y el comportamiento local dejaría de parecerse a producción.

Por eso `docker-compose.yml` levanta `mongo:8` con `--replSet rs0` y ejecuta
`rs.initiate()` de forma **idempotente desde el healthcheck** (si el replica set
ya está iniciado, `rs.status()` tiene éxito y no hace nada).

El miembro se registra como `localhost:27017` y la URI usa
`?replicaSet=rs0&directConnection=true`. El `directConnection=true` evita que el
driver, al descubrir el replica set, intente resolver un hostname interno del
contenedor que el host no conoce.

`DATABASE_URL` local (ya viene en `.env.example`):

```txt
mongodb://127.0.0.1:27017/circulo-estudios?replicaSet=rs0&directConnection=true
```

## Comandos

| Comando                       | Qué hace                                                                |
| ----------------------------- | ----------------------------------------------------------------------- |
| `pnpm db:up`                  | `docker compose up -d --wait mongo` — levanta y espera a que esté sano. |
| `pnpm db:down`                | `docker compose down` — detiene el contenedor, **conserva** los datos.  |
| `pnpm db:logs`                | Sigue los logs de MongoDB.                                              |
| `pnpm db:shell`               | `mongosh` sobre la base `circulo-estudios`.                             |
| `pnpm db:seed [archivo.json]` | Importa ensayos desde `data/` (ver abajo).                              |

### Resetear la base por completo

```bash
docker compose down -v   # elimina también los volúmenes mongo_data y mongo_config
pnpm db:up
```

### Inspección con MongoDB Compass

Cadena de conexión:

```txt
mongodb://127.0.0.1:27017/?directConnection=true
```

## Sembrar datos

### Scripts de importación del repo

`scripts/import-ensayos.ts` lee un JSON de `data/` y crea los ensayos vía la API de
Payload. **Requiere que ya exista al menos un usuario** (crea el admin en `/admin`
antes de correrlo).

```bash
pnpm db:seed                # data/cuestion_religiosa_jalisco.json (default)
pnpm db:seed ensayos.json   # data/ensayos.json
```

Los scripts de ordenamiento son one-off y se corren directamente:

```bash
tsx scripts/ordenar-cuestion-religiosa.ts
tsx scripts/ordenar-ensayos-y-discursos.ts
```

### Copiar datos reales desde Atlas

Con las herramientas de MongoDB Database Tools instaladas en el host:

```bash
mongodump --uri="<ATLAS_SRV_URI>" --out=./dump

mongorestore \
  --uri="mongodb://127.0.0.1:27017/?directConnection=true" \
  --nsInclude="circulo-estudios.*" \
  --drop ./dump
```

`<ATLAS_SRV_URI>` es la cadena `mongodb+srv://...` del cluster de Atlas. Ajusta el
nombre de base en `--nsInclude` si en Atlas se llama distinto. El directorio
`./dump` no debe commitearse (está cubierto por `.gitignore`).

## Notas

- **Tests:** `vitest` (integración) y `playwright` (e2e) también necesitan MongoDB.
  Pueden reutilizar este mismo contenedor apuntando a una base separada
  (p. ej. `circulo-estudios-test`), pero eso no está cableado en esta iteración.
- **Producción:** no cambia. `DATABASE_URL` sigue apuntando a Atlas en los entornos
  desplegados; esto solo afecta al desarrollo local.
