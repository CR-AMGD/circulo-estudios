```markdown
# Arquitectura del Proyecto - Círculo de Estudios

## 📁 Estructura de Directorios

```text
src/
├── app/
│   ├── (frontend)/       # Rutas públicas (App Router), Server Components y Previews
│   ├── (payload)/        # Interfaz de administración nativa de Payload CMS v3
│   └── my-route/         # Endpoints de prueba / custom routes
├── collections/          # Esquemas y lógica de acceso de Payload CMS
├── components/           # Componentes modulares UI
│   ├── AdminHeader/      # Componentes extendidos para la UI del Admin Panel
│   ├── AdminNav/         # Navegación extendida para el Admin Panel
│   └── ...               # Componentes del Frontend (Layouts, Acordeones, Navbars)
├── payload.config.ts     # Configuración principal de Payload CMS
├── payload-types.ts      # Tipos autogenerados por Payload para TypeScript
└── utils/                # Funciones utilitarias (formato de fechas, etc.)

🧩 Componentes UI (src/components/)
Frontend

    EnsayoLayout.tsx: Shell global/layout enfocado para la lectura de ensayos (soporta lectura extendida y visualización sin distracciones).

    ListaEnsayosAcordeon.tsx: Renderiza el índice de ensayos clasificados y agrupados dinámicamente por autor.

    AnacletoAccordion.tsx: UI especializada para catalogar las obras y discursos de la sección Anacleto González Flores.

    Navbar.tsx & NavMisEnsayos.tsx: Barras de navegación pública y accesos directos al flujo de colaboradores.

Admin Panel Customization

    AdminHeaderTitle.tsx, AdminNav.tsx, UserMenu.tsx: Inyecciones UI personalizadas dentro del panel de administración para adaptar la experiencia de usuario de los redactores.

⚙️ Decisiones Técnicas y Patrones

    Modo Vista Previa (/ensayos/preview/[id]):

        Integración directa con Next.js App Router mediante lectura de documentos en estado borrador (draft: true).

        Validación de sesión vía headers() de Next.js y la API payload.auth().

        Banner de acciones flotante con navegación rápida al panel de edición.

    Normalización y Tipado Seguro en React:

        Abstracción de tipos para los campos de relación (ej. autor en Ensayos).

        Manejo dinámico que soporta autowrapping de firmas ya sea que Payload devuelva IDs planos (string), arreglos de autores o relaciones totalmente pobladas (objetos).

        Normalización de campos nulos (resumen: null -> undefined) para asegurar cumplimiento estricto de props en componentes UI.

    Infraestructura:

        Configuración de contenedores mediante Dockerfile y docker-compose.yml para despliegues portables o entornos locales aislados.