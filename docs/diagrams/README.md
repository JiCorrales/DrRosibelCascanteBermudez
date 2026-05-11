# Diagramas de flujo — Dra. Rosibel Cascante Bermúdez

Este directorio existe para que **una IA (o un dev nuevo) entienda en 5 minutos cómo está armado el proyecto** sin tener que leer todo el código. Es el documento de contexto que pegás al principio de una conversación con Claude/ChatGPT cuando le pedís ayuda con este repo.

> Los archivos `.mmd` son **Mermaid.js**. Se previsualizan nativamente en VS Code (extensión "Markdown Preview Mermaid Support") y GitHub los renderiza dentro de bloques ` ```mermaid `. Si en algún momento querés versiones editables visualmente, se pueden subir a FigJam con el MCP de Figma sin cambiar el source.

---

## TL;DR del proyecto

- **Cliente**: Dra. Rosibel Cascante Bermúdez — psicóloga clínica en San José, Costa Rica.
- **Producto**: sitio público + flujo de reservas + panel admin + portal paciente.
- **Estado a 2026-05-11**: frontend en producción (Vercel), Supabase conectado para reservas, edge functions para correos vía Resend, cron diario para recordatorios. Módulo Redes funciona client-side con localStorage.
- **Audiencia**: pacientes adultos, mayoría mobile.

## Stack en una línea

`Vite 5 + React 18 + React Router 6` (JSX plano, sin TS) · `Supabase (Postgres + Auth + Edge Functions Deno)` · `Resend` para correos transaccionales · `Anthropic Haiku 4.5` opcional para variar copy de redes · `Vercel` hosting · `Vitest + Playwright` para tests.

## Estructura del repo

```
DrRosibelCascanteBermudez/
├── frontend/              # Vite + React (público + admin + portal)
│   └── src/
│       ├── pages/         # Sitio público (HomePage, ReservarPage, etc.)
│       ├── admin/         # Pantallas admin (desktop-first)
│       │   ├── content/   # Módulo Redes (templates + storage local)
│       │   └── pages/
│       ├── portal/        # Portal paciente (mobile-first)
│       ├── lib/           # api.js, queries.js (React Query), supabase.js
│       ├── auth/          # useAuth, ProtectedRoute
│       └── mock/          # admin-data.js — mocks que aún no llegaron al backend
├── supabase/
│   └── functions/
│       ├── booking-confirmation/   # email + .ics (paciente + doctora)
│       └── task-reminder/          # email recordatorio de tareas
├── database/              # README con schema sugerido (no aplicado todavía)
├── design-extract/        # diseño congelado (no editar)
└── docs/
    └── diagrams/          # ← estás acá
```

## Convenciones críticas

| Tema | Regla |
|---|---|
| **Estados de cita** | `pending` → `confirmed` → `completed` / `cancelled` / `no_show`. Strings exactos en frontend y DB. |
| **Auth** | `useAuth` + `ProtectedRoute`. Modo demo (sin Supabase) → cualquier credencial entra y se guarda en `localStorage` (`rosibel:mock-session`). Modo real → admin con password, paciente con magic link. La forma del hook es la misma en los dos modos. |
| **Zona horaria** | Costa Rica = UTC-6 sin DST. Convertir manualmente en edge functions (no confiar en TZ del runtime). |
| **Mock data** | `frontend/src/mock/admin-data.js` — "hoy" siempre es jueves 14 de mayo de 2026 para que los mocks tengan datos coherentes. |
| **Redes (módulo admin)** | API key de Anthropic vive en `localStorage` del navegador, **no en backend**. Aceptable porque el admin es uso personal de 1 persona. |
| **WhatsApp** | Número de la doctora: `50688414861`. Botones generan `wa.me/<num>?text=<encoded>` con texto prellenado. |
| **Vite dev server** | `127.0.0.1:5173`, host fijo + strictPort. En Windows matar procesos node huérfanos con `Stop-Process -Id N -Force`. |

## Índice de diagramas

Los números reflejan el orden recomendado de lectura para alguien nuevo.

| # | Archivo | Tipo | Qué muestra |
|---|---|---|---|
| 1 | [`01-arquitectura.mmd`](./01-arquitectura.mmd) | `graph LR` | Componentes del sistema y cómo se hablan: frontend, Supabase, edge functions, Resend, Anthropic, pg_cron, WhatsApp. **Empezá por acá.** |
| 2 | [`02-sitio-publico.mmd`](./02-sitio-publico.mmd) | `graph LR` | Rutas del sitio público y cómo desembocan en `/reservar`. |
| 3 | [`03-reserva-wizard.mmd`](./03-reserva-wizard.mmd) | `flowchart TD` | Wizard de 4 pasos del paciente, validaciones, manejo de slots concurrentes y persistencia. |
| 4 | [`04-notificaciones-reserva.mmd`](./04-notificaciones-reserva.mmd) | `sequenceDiagram` | Edge function `booking-confirmation`: arma `.ics` y dispara dos correos en paralelo vía Resend. |
| 5 | [`05-cron-recordatorios.mmd`](./05-cron-recordatorios.mmd) | `sequenceDiagram` | `pg_cron` diario 07:00 CR → SQL → edge functions → recordatorios de tareas y citas T-24h. |
| 6 | [`06-auth.mmd`](./06-auth.mmd) | `flowchart TD` | Login admin (password) vs login portal (magic link), ambos con fallback demo en localStorage. |
| 7 | [`07-estados-cita.mmd`](./07-estados-cita.mmd) | `stateDiagram-v2` | Máquina de estados de una cita. **Es la fuente de verdad** para los strings de status. |
| 8 | [`08-modulo-redes.mmd`](./08-modulo-redes.mmd) | `flowchart TD` | Editor de contenido del admin: tema → ángulo → formato → plantilla → caption híbrido (determinista + Claude opcional) → PNG + caption descargables. |
| 9 | [`09-portal-paciente.mmd`](./09-portal-paciente.mmd) | `graph TD` | Portal paciente mobile-first: 4 tabs, cancelar/reagendar con regla de 24h, marcar tareas hechas. |
| 10 | [`10-lifecycle-cita.mmd`](./10-lifecycle-cita.mmd) | `sequenceDiagram` | Vista cross-actor del ciclo completo de una cita: paciente, doctora, sistema, cron — desde la reserva hasta `completed`/`no_show`. |

## Cómo previsualizar

- **VS Code**: instalar "Markdown Preview Mermaid Support" o "Mermaid Editor", abrir el `.mmd` y `Ctrl+Shift+V`.
- **GitHub**: pegar el contenido del `.mmd` dentro de un bloque ` ```mermaid ` en cualquier `.md`.
- **Online**: pegar en [mermaid.live](https://mermaid.live).
- **FigJam**: usar el MCP `mcp__claude_ai_Figma__generate_diagram` pasando el contenido como `mermaidSyntax`.

## Cómo mantener actualizados estos diagramas

> Regla simple: si tocás el código que un diagrama describe, abrí el `.mmd` y actualizalo en el mismo PR.

- Cambias el wizard de reserva → tocá `03-reserva-wizard.mmd`.
- Agregás un estado nuevo de cita → tocá `07-estados-cita.mmd` **y** todos los lugares del código que filtran por status.
- Agregás un nuevo cron job → tocá `05-cron-recordatorios.mmd` y `01-arquitectura.mmd`.
- Conectás backend a un módulo que estaba en mock → tocá `01-arquitectura.mmd`.

## Para una IA leyendo esto por primera vez

Si sos un LLM al que le pegaron este README como contexto inicial, asumí lo siguiente sin re-verificar:

1. El proyecto está en **español de Costa Rica** — todo lo user-facing en español, código en inglés.
2. **No agregar TypeScript.** El usuario eligió JSX plano deliberadamente.
3. La paleta es **beige + salvia** (variables CSS en `frontend/src/styles/tokens.css`). No proponer otra.
4. Antes de proponer una librería UI nueva, revisar `frontend/src/components/primitives.jsx` — el sistema es minimalista a propósito.
5. **Mobile-first** para portal y sitio público; **desktop-first** para admin.
6. Si un módulo aún funciona con datos mock (`frontend/src/mock/admin-data.js`), no inventarle backend — está en migración progresiva a Supabase.
