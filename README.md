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

## Deploy del frontend (sugerido)

`dist/` es estático puro — funciona en cualquier static host:

- **Vercel** o **Netlify** (cero config, deploy preview por PR).
- **Cloudflare Pages** (rápido en LATAM, bueno para tráfico CR).

Configurar SPA fallback: cualquier 404 debe servir `index.html` para que React Router funcione (`vercel.json` con rewrite `/* → /index.html`, o `_redirects` con `/*  /index.html  200` en Netlify).

## Próximos pasos

Cuando el frontend ya esté en producción y validado con la doctora:

1. Conectar backend (ver [`backend/README.md`](backend/README.md)) — Supabase es la opción más rápida.
2. Reemplazar el array `SERVICES` de [`frontend/src/data.js`](frontend/src/data.js) por fetches a la API.
3. Convertir el "Confirmar reserva" del wizard en POST real a `/api/bookings`.
4. Construir el panel admin (`/admin`, ya con variantes diseñadas en `design-extract/`).
