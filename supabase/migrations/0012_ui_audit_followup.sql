-- Migración 0012 · Seguimiento de la auditoría de UI 2026-05-11
--
-- Dos cambios independientes:
--
--   1) bookings.meeting_url — columna para el botón "Unirme online" del portal
--      del paciente. Nullable. La UI de admin para setearla viene en un plan
--      posterior; por ahora se queda en NULL y la lógica que la consume está
--      condicionada a su presencia.
--
--   2) app_settings — tabla key/value para settings globales (hoy solo
--      buffer_min, en el futuro: meet_link genérico, horario por defecto, etc.).
--      Lectura pública (anon) porque /reservar también la consulta;
--      escritura solo admin via is_admin().
--
-- clinical_notes ya existe en la DB con policy clinical_notes_admin_only —
-- no se toca en esta migración.

-- ─────────────────────────────────────────────
-- 1. bookings.meeting_url
-- ─────────────────────────────────────────────
alter table public.bookings
  add column if not exists meeting_url text;

-- ─────────────────────────────────────────────
-- 2. app_settings
-- ─────────────────────────────────────────────
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

drop policy if exists app_settings_public_read on public.app_settings;
create policy app_settings_public_read on public.app_settings
  for select
  using (true);

drop policy if exists app_settings_admin_write on public.app_settings;
create policy app_settings_admin_write on public.app_settings
  for all
  using (is_admin())
  with check (is_admin());

drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at
  before update on public.app_settings
  for each row execute function public.set_updated_at();

-- Seed inicial: buffer global entre citas en minutos.
-- Si la doctora deja services.buffer_min en 15 por servicio, este global
-- actúa como override desde AdminAvailability. La lógica de /reservar
-- toma el mayor de los dos.
insert into public.app_settings (key, value)
values ('buffer_min', '15'::jsonb)
on conflict (key) do nothing;
