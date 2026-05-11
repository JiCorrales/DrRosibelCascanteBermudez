-- Migración 0011 · Recordatorios automáticos via pg_cron + pg_net
--
-- Activa dos cron jobs:
--   1) booking-reminders: cada 15 min revisa bookings con scheduled_at
--      entre 23h45m y 24h15m de NOW(), status='confirmed' y dispara la
--      edge function `booking-confirmation` con template='reminder'.
--   2) task-reminders: cada día a las 13:00 UTC (07:00 CR) revisa tasks
--      con due_date = mañana o vencidas no completadas y dispara la
--      edge function `task-reminder`.
--
-- Idempotencia: tabla `notifications_sent` evita disparar dos veces.
--
-- Auth: pg_net usa la anon key del proyecto (es un JWT público — no es
-- secret real, es parte del bundle del frontend). La edge function valida
-- el JWT y envía via Resend con su propio RESEND_API_KEY del Vault.

-- ─────────────────────────────────────────────
-- 1. Extensions
-- ─────────────────────────────────────────────
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- ─────────────────────────────────────────────
-- 2. Tabla de idempotencia
-- ─────────────────────────────────────────────
create table if not exists public.notifications_sent (
  id uuid primary key default gen_random_uuid(),
  -- Una de las dos FKs estará seteada según el tipo de recordatorio.
  booking_id uuid references public.bookings(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  kind text not null check (kind in ('booking_reminder_24h', 'task_reminder')),
  sent_at timestamptz not null default now(),
  -- Para auditoría: si el HTTP falló y queremos reintentar después
  http_status int,
  http_request_id bigint,
  -- Garantiza que el mismo recordatorio no se envíe dos veces
  unique (booking_id, kind),
  unique (task_id, kind)
);

alter table public.notifications_sent enable row level security;

-- Solo admin y el propio paciente pueden leer (no se inserta desde cliente — sólo desde funciones SECURITY DEFINER)
create policy "admin_read_notifications" on public.notifications_sent
  for select to authenticated
  using (
    exists (select 1 from public.admin_profiles ap where ap.user_id = auth.uid())
  );

create index if not exists idx_notifications_sent_booking on public.notifications_sent (booking_id);
create index if not exists idx_notifications_sent_task on public.notifications_sent (task_id);

-- ─────────────────────────────────────────────
-- 3. Función para enviar recordatorios de citas (24h antes)
-- ─────────────────────────────────────────────
create or replace function public.send_booking_reminders()
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_url text := 'https://sqhudjvritubmaodrsha.supabase.co/functions/v1/booking-confirmation';
  v_anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxaHVkanZyaXR1Ym1hb2Ryc2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NTE1MDUsImV4cCI6MjA5NDAyNzUwNX0.bfpuBXgm027n77iC24arYVTq1VUmCaVO_qMLULCm9gY';
  v_booking record;
  v_request_id bigint;
begin
  for v_booking in
    select
      b.id,
      b.service_id,
      b.scheduled_at,
      b.duration_min,
      b.modality,
      b.patient_name,
      b.patient_email,
      b.patient_phone,
      b.message,
      s.name as service_name,
      s.price as price_crc
    from public.bookings b
    left join public.services s on s.id = b.service_id
    where b.status = 'confirmed'
      -- Ventana: entre 23h45m y 24h15m en el futuro (cron cada 15 min cubre cualquier slot)
      and b.scheduled_at between (now() + interval '23 hours 45 minutes')
                              and (now() + interval '24 hours 15 minutes')
      and not exists (
        select 1 from public.notifications_sent ns
        where ns.booking_id = b.id and ns.kind = 'booking_reminder_24h'
      )
  loop
    -- Dispara HTTP post fire-and-forget
    select net.http_post(
      url := v_url,
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || v_anon,
        'apikey', v_anon,
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'id', v_booking.id,
        'service_id', v_booking.service_id,
        'service_name', v_booking.service_name,
        'scheduled_at', to_char(v_booking.scheduled_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
        'duration_min', v_booking.duration_min,
        'modality', v_booking.modality,
        'patient_name', v_booking.patient_name,
        'patient_email', v_booking.patient_email,
        'patient_phone', v_booking.patient_phone,
        'message', v_booking.message,
        'price_crc', v_booking.price_crc,
        'template', 'reminder'
      )
    ) into v_request_id;

    -- Marca como enviado (aunque el HTTP fuera async, evita reintento en el siguiente tick)
    insert into public.notifications_sent (booking_id, kind, http_request_id)
      values (v_booking.id, 'booking_reminder_24h', v_request_id);
  end loop;
end;
$$;

-- ─────────────────────────────────────────────
-- 4. Función para enviar recordatorios de tareas
-- ─────────────────────────────────────────────
create or replace function public.send_task_reminders()
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_url text := 'https://sqhudjvritubmaodrsha.supabase.co/functions/v1/task-reminder';
  v_anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxaHVkanZyaXR1Ym1hb2Ryc2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NTE1MDUsImV4cCI6MjA5NDAyNzUwNX0.bfpuBXgm027n77iC24arYVTq1VUmCaVO_qMLULCm9gY';
  v_task record;
  v_request_id bigint;
begin
  for v_task in
    select
      t.id,
      t.title,
      t.description,
      t.due_date,
      c.full_name as client_name,
      c.email as client_email
    from public.tasks t
    join public.clients c on c.id = t.client_id
    where t.status != 'done'
      -- Recordatorio para tareas con due_date = hoy o mañana
      and t.due_date is not null
      and t.due_date between current_date and (current_date + interval '1 day')
      and c.email is not null
      and not exists (
        select 1 from public.notifications_sent ns
        where ns.task_id = t.id and ns.kind = 'task_reminder'
      )
  loop
    select net.http_post(
      url := v_url,
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || v_anon,
        'apikey', v_anon,
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'task_id', v_task.id,
        'title', v_task.title,
        'description', v_task.description,
        'due_date', v_task.due_date,
        'patient_name', v_task.client_name,
        'patient_email', v_task.client_email
      )
    ) into v_request_id;

    insert into public.notifications_sent (task_id, kind, http_request_id)
      values (v_task.id, 'task_reminder', v_request_id);
  end loop;
end;
$$;

-- ─────────────────────────────────────────────
-- 5. Cron jobs
-- ─────────────────────────────────────────────
-- Desinstalar si ya existían (idempotencia de migración)
do $$
begin
  if exists (select 1 from cron.job where jobname = 'booking-reminders-15min') then
    perform cron.unschedule('booking-reminders-15min');
  end if;
  if exists (select 1 from cron.job where jobname = 'task-reminders-daily') then
    perform cron.unschedule('task-reminders-daily');
  end if;
end $$;

-- Citas: cada 15 minutos
select cron.schedule(
  'booking-reminders-15min',
  '*/15 * * * *',
  $$select public.send_booking_reminders()$$
);

-- Tareas: una vez al día a las 13:00 UTC = 07:00 CR (hora razonable para recibir)
select cron.schedule(
  'task-reminders-daily',
  '0 13 * * *',
  $$select public.send_task_reminders()$$
);
