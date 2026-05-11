# Backend — placeholder

> Esta carpeta está reservada. No hay código todavía. El frontend funciona de forma 100% client-side, con la lógica de reserva como mock.

## Cuándo arrancar acá

Cuando ya querás:

- Persistir reservas reales y enviar correos de confirmación a la doctora y al paciente.
- Tener panel admin (calendario, citas, clientes, servicios CRUD).
- Sincronizar disponibilidad real (Google Calendar / Outlook).
- Cobrar online (SINPE / tarjeta) en el momento de reservar.

## Opciones recomendadas (en orden de simplicidad)

### Opción A · Supabase como backend (Recomendado para empezar)

**Por qué:** ya tenés MCP de Supabase configurado. Postgres administrado, Auth, Storage, Row-Level Security, edge functions y dashboard incluidos. Cero infra propia. Ideal para un consultorio de una sola psicóloga.

- **Tablas:** ver [`../database/README.md`](../database/README.md).
- **Auth:** Supabase Auth con email/contraseña para la doctora (panel admin).
- **API:** REST + Realtime auto-generada por Supabase. El frontend usa `@supabase/supabase-js`.
- **Funciones serverless (Edge Functions):** envío de correos transaccionales (Resend / Postmark) tras crear una reserva.

### Opción B · Backend propio (Node + Fastify/Express)

Tiene sentido si después se quiere multi-tenant (varios profesionales) o lógica de negocio compleja que no quepa en RLS.

- Stack sugerido: **Node 22 + Fastify + Drizzle ORM + Postgres** (Neon o Supabase Postgres).
- Auth: Lucia o `@fastify/jwt`.
- Deploy: Railway, Fly.io o Render.

## Contrato API previsto (cuando exista backend)

```
GET    /api/services                    → lista de servicios
GET    /api/services/:id                → detalle
GET    /api/availability?from=&to=      → días/horas libres
POST   /api/bookings                    → crear reserva (público)
GET    /api/bookings        [auth]      → listar (admin)
PATCH  /api/bookings/:id    [auth]      → cambiar estado (admin)
DELETE /api/bookings/:id    [auth]      → cancelar (admin)
POST   /api/auth/login                  → login admin
POST   /api/contact                     → mensaje sin reservar
```

## Variables de entorno que el frontend espera

Cuando exista backend, agregar a `frontend/.env.local`:

```bash
VITE_API_URL=http://localhost:3000   # o https://api.rosibelpsicologa.cr
# Opción A · Supabase
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

El cliente ya está estructurado para inyectar esto sin tocar las páginas: crear `frontend/src/lib/api.js` con un wrapper alrededor de `fetch` / `supabase-js` cuando llegue el momento.
