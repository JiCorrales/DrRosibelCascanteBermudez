# Pendientes / TODO

Pequeñas tareas a no olvidar. Lo grande va al plan en `~/.claude/plans/`.

## Antes de mostrar el sitio a pacientes reales

- [ ] **Reemplazar correo de "notificación de reserva"** en
      [supabase/functions/booking-confirmation/index.ts](supabase/functions/booking-confirmation/index.ts):
      hoy va a `jocorrales.dev@gmail.com` porque la cuenta Resend no tiene dominio
      verificado y sólo entrega al owner. Cuando se verifique `rosibelpsicologa.cr`
      (o el dominio que se compre) en Resend, cambiar `ADMIN_EMAIL` a
      `cascantebermudezrosibel@gmail.com` (o el correo que la doctora use) y
      `FROM_ADDRESS` a `citas@rosibelpsicologa.cr`.
- [ ] **Verificar dominio en Resend** (https://resend.com/domains):
      1. Comprar dominio (~₡10k/año).
      2. Agregar el dominio en Resend → copiar registros TXT/MX/CNAME.
      3. Configurarlos en el DNS del dominio (Namecheap/Cloudflare/lo que sea).
      4. Esperar 5–60 min y confirmar "Verified".
- [ ] **Conectar repo a Vercel** (reemplaza GitHub Pages):
      1. Crear cuenta en vercel.com con la cuenta de GitHub.
      2. New Project → Import `JiCorrales/DrRosibelCascanteBermudez`.
      3. Framework Preset: **Other**.
      4. Environment Variables: agregar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (mismos valores que en `.env.local`).
      5. Deploy. Anotar la URL pública (algo como `https://dr-rosibel-cascante-bermudez.vercel.app`).
- [ ] **Configurar redirect URLs + Site URL en Supabase Auth**
      (https://supabase.com/dashboard/project/sqhudjvritubmaodrsha/auth/url-configuration):
      - Site URL: **la URL de Vercel** (ej. `https://dr-rosibel-cascante-bermudez.vercel.app`)
      - Redirect URLs:
        - `http://127.0.0.1:5173/portal/auth/callback`
        - `http://localhost:5173/portal/auth/callback`
        - `https://<URL-VERCEL>/portal/auth/callback`
      Sin esto, el magic link del portal del paciente no redirige correctamente.
- [ ] **Setear `RESEND_API_KEY` en Supabase Functions secrets**
      (https://supabase.com/dashboard/project/sqhudjvritubmaodrsha/functions/secrets):
      el valor está local en `frontend/.env.local`.
- [ ] **Datos reales de la doctora** (reemplazar placeholders en
      [frontend/src/data.js](frontend/src/data.js) y secciones):
      - Código CPCR real
      - Año exacto de licenciatura
      - Lista real de servicios + precios + descripciones
      - Correo profesional real
      - Teléfono real
      - Dirección del consultorio
      - Foto del consultorio (hoy es placeholder a rayas)
      - Bio definitiva
      - Aviso de privacidad / consentimiento informado (Ley 8968 CR)
- [ ] **Año de copyright dinámico** en el footer: revisar que se actualice solo
      (ya usa `new Date().getFullYear()`, OK).

## Mejoras técnicas posponibles

- [ ] **Disponibilidad real**: hoy `availability_rules` está en DB pero el wizard
      `/reservar` aún usa días/horas hardcoded del calendario. Conectar
      `CalPicker` para leer `availability_rules` + `availability_overrides`
      + bookings ya tomados → calcular slots libres reales.
- [ ] **Reagendar/cancelar desde el portal**: los botones existen pero no hacen
      nada. Necesitan mutation que valide `> 24h antes` y actualice el booking
      con `status='cancelled'` o cambie `scheduled_at`. Idealmente con
      `reschedule_token` para enviar enlace por correo.
- [ ] **Tasks y Documents en el portal**: hoy `PortalTasks` y `PortalDocs` leen
      mocks. La UI del admin para asignarles tareas y subirles documentos
      (Supabase Storage para los archivos) está pendiente.
- [ ] **Pagos**: integración Tilopay para tarjeta CR + flujo SINPE manual
      (paciente paga, doctora confirma desde admin). Tabla `payments` ya existe.
- [ ] **Calendar sync** con Google Calendar (opcional, después de pagos).
- [ ] **Recordatorios automáticos 24h antes**: cron en Supabase que dispara la
      edge function `booking-confirmation` con un template "Recordatorio".
- [ ] **Dominio propio**: cuando se compre (`rosibelpsicologa.cr` u otro),
      en Vercel → Project → Domains → Add → configurar DNS según indique Vercel.
      Vercel emite el certificado HTTPS solo. No requiere cambios de código.
- [ ] **Lighthouse en producción**: hoy ~95 perf en local; conviene verificar en
      Pages real con datos reales antes de promocionar.
- [ ] **Error tracking**: integrar Sentry free tier para capturar errores en
      producción (ahora se pierden).

## Triggers de base de datos a considerar

- [ ] **Auto-actualizar `clients.status` de 'new' a 'active'** después de la
      segunda sesión completada. Hoy queda en 'new' para siempre si nadie lo
      cambia manualmente.
- [ ] **Auto-calcular `clients.first_visit`** desde el booking más antiguo. Hoy
      lo setea el trigger sólo si el cliente nace de un booking.
- [ ] **Webhook DB → edge function** en vez de fire-and-forget desde el cliente.
      Hoy si JavaScript falla antes del `fetch`, no se manda correo. Con un
      webhook `AFTER INSERT ON bookings`, el correo se envía garantizado.

## Cosas que ya están sólidas (no tocar sin razón)

- Schema con RLS estricta, advisors a 0
- Auto-creación de cliente al primer booking via trigger
- Unique index `bookings_no_overlap_idx` previene dobles reservas en mismo slot
- Capa `lib/api.js` con fallback automático a mocks si Supabase no está configurado
- `useAuth` con misma interfaz pública en mock y real (Supabase Auth + magic link)
