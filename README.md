# Dra. Rosibel Cascante Bermúdez · Sitio profesional

Sitio web + flujo de reservas para Dra. Rosibel Cascante Bermúdez, psicóloga clínica en San José, Costa Rica.

## Estructura

```text
DrRosibelCascanteBermudez/
├── frontend/          # App web (Vite + React + React Router)
├── backend/           # Reservado — sin código todavía (ver backend/README.md)
├── database/          # Reservado — schema documentado (ver database/README.md)
├── design-extract/    # Bundle original de claude.ai/design (referencia, no se edita)
└── README.md
```

## Stack actual

| Capa     | Tecnología                                                             | Estado |
| -------- | ---------------------------------------------------------------------- | ------ |
| Frontend | **Vite 5 + React 18 + React Router 6**, plain JSX                      | ✅      |
| Estilos  | CSS variables (paleta beige/salvia del brief) + fuentes Fraunces/DM Sans | ✅      |
| Tests    | **Vitest + Testing Library** (unit) + **Playwright** (e2e)             | ✅      |
| Backend  | —                                                                      | ⏳ pendiente |
| Database | —                                                                      | ⏳ pendiente |

Decisiones documentadas en cada README sub-carpeta.

## Comandos rápidos

```bash
# Desarrollo del frontend
cd frontend
npm install
npm run dev              # http://127.0.0.1:5173

# Build de producción
npm run build
npm run preview          # sirve dist/ en 127.0.0.1:4173

# Tests unitarios (jsdom)
npm test                 # one-shot
npm run test:watch       # modo watch
npm run test:ui          # UI de Vitest

# Tests e2e (Playwright) — corre en chromium-desktop + mobile-chromium
npm run test:e2e
npm run test:e2e:ui      # modo UI interactivo
```

## Estado de QA

Última ejecución local:

- **Unit tests:** 24 / 24 ✅ (FAQ, Testimonios, Header, ReservarPage, AdminLogin, AdminAppts, PortalTasks)
- **E2E tests:** 27 / 27 ✅ + 1 skip intencional (admin/sign-out en móvil, omitido por diseño desktop-first)
- **Build:** ✅ ~212 KB JS público, ~18 KB CSS (gzipped ~67 + 4 KB). Admin y portal viajan como **chunks lazy** que solo cargan al entrar a `/admin/*` o `/portal/*`.

## Rutas del sitio

### Público

| Path                  | Página                          |
| --------------------- | ------------------------------- |
| `/`                   | Landing (hero, sobre, enfoque, servicios, situaciones, testimonios, FAQ, CTA) |
| `/sobre`              | Bio extendida + formación       |
| `/servicios`          | Listado completo de servicios   |
| `/servicios/:id`      | Detalle de un servicio          |
| `/reservar`           | Wizard 4 pasos (mock submit)    |
| `/reservar?servicio=` | Pre-selecciona un servicio      |
| `*`                   | 404                             |

### Admin (desktop-first, protegido por auth mock)

| Path                       | Pantalla |
| -------------------------- | -------- |
| `/admin/login`             | Split-screen (panel salvia + form) |
| `/admin`                   | Dashboard (4 KPIs + agenda hoy + próximamente) |
| `/admin/calendario`        | Vista semanal hora × día con citas |
| `/admin/disponibilidad`    | Reglas semanales + bloqueos + buffer |
| `/admin/citas`             | Tabla con filtros + búsqueda + `?estado=` |
| `/admin/clientes`          | Grid de cards con búsqueda y tabs |
| `/admin/clientes/:id`      | Perfil + tabs (Historial/Notas/Tareas/Documentos/Pagos) |
| `/admin/servicios`         | CRUD grid con toggle activo |
| `/admin/servicios/:id`     | Form de edición + vista previa pública |

### Portal paciente (mobile-first, protegido)

| Path                       | Pantalla |
| -------------------------- | -------- |
| `/portal/login`            | Login simple con magic-link-style |
| `/portal`                  | Inicio: próxima cita + tareas + docs |
| `/portal/tareas`           | Lista de tareas con tabs activas/completadas |
| `/portal/citas`            | Próximas + pasadas, con reagendar/cancelar |
| `/portal/documentos`       | Documentos compartidos por la doctora |

> **Auth actual:** mock con `localStorage`. Cualquier credencial entra. La forma del hook (`useAuth().signIn/signOut`) está estructurada para reemplazarse por Supabase Auth sin cambiar UI.

## Diseño de origen

El bundle original viene de [claude.ai/design](https://claude.ai/design) y vive en
`design-extract/dr-rosibel-cascante-bermudez-psicologa/`. **No editar esos archivos** — son la referencia visual congelada. El frontend actual ya incorpora todas las decisiones aprobadas:

- Hero B · editorial elegante
- Sobre A · foto + credenciales checklist
- Cómo trabajo A · 3 principios numerados
- Servicios A · tarjetas detalladas con precio
- Situaciones C · grid 2×N con iconos
- Testimonios A · cita única con paginación
- FAQ A · acordeón clásico
- CTA A · bloque salvia
- Footer A · oscuro con navegación

## Deploy

Configurado para **GitHub Pages** vía Actions. URL pública: **https://jicorrales.github.io/DrRosibelCascanteBermudez/**

Cualquier push a `main` dispara el workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) que:

1. Corre `npm test` (frena el deploy si los unit tests rompen).
2. Build de Vite con `VITE_BASE=/<repo-name>/` (auto-detectado del nombre del repo).
3. Postbuild copia `dist/index.html` a `dist/404.html` (SPA fallback) y genera `.nojekyll`.
4. Publica el artefacto a Pages.

**Workflows manuales:** `gh workflow run "Deploy frontend to GitHub Pages" --repo JiCorrales/DrRosibelCascanteBermudez`

**Migrar a dominio propio** (ej. `rosibelpsicologa.cr`):

1. Comprar el dominio (Namecheap, GoDaddy, etc.).
2. En el DNS del dominio, agregar registros A o CNAME apuntando a GitHub Pages ([guía oficial](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).
3. En el repo: `Settings → Pages → Custom domain → rosibelpsicologa.cr`. Marcar "Enforce HTTPS".
4. En el workflow, cambiar `VITE_BASE` a `/` (línea 41) y commitear. Sin base path el sitio sirve desde el root del dominio.

**Otras opciones de hosting si querés migrar:** Vercel, Netlify y Cloudflare Pages soportan SPA fallback nativo (no necesitan el truco del 404.html). En todos, root del proyecto = `frontend/`, build command = `npm run build`, output = `dist/`.

## Próximos pasos

Cuando el frontend ya esté en producción y validado con la doctora:

1. Conectar backend (ver [`backend/README.md`](backend/README.md)) — Supabase es la opción más rápida.
2. Reemplazar el array `SERVICES` de [`frontend/src/data.js`](frontend/src/data.js) por fetches a la API.
3. Convertir el "Confirmar reserva" del wizard en POST real a `/api/bookings`.
4. Construir el panel admin (`/admin`, ya con variantes diseñadas en `design-extract/`).
