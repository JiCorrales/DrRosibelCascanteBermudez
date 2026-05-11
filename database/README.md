# Database — placeholder

> No hay base de datos en uso todavía. Esta carpeta documenta el esquema previsto para cuando se conecte un backend.

## Stack recomendado

**Postgres 15+** (vía Supabase para empezar). Postgres es lo que la mayoría del ecosistema CR/LATAM usa, escala bien para un consultorio individual y permite Row-Level Security para el panel admin.

## Esquema previsto

```sql
-- ─────────────────────────────────────────────
-- Servicios (catálogo público)
-- ─────────────────────────────────────────────
create table services (
  id            text primary key,                  -- 'individual', 'pareja', etc.
  name          text not null,
  slug          text not null unique,
  description   text not null,
  duration_min  integer not null check (duration_min > 0),
  price_crc     integer not null default 0,        -- en colones, 0 = gratis
  active        boolean not null default true,
  for_you       jsonb not null default '[]'::jsonb, -- text[] de razones
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Disponibilidad declarada por la doctora
-- ─────────────────────────────────────────────
create table availability_rules (
  id            bigserial primary key,
  weekday       smallint not null check (weekday between 0 and 6), -- 0=Dom
  start_time    time not null,
  end_time      time not null,
  active        boolean not null default true
);

create table availability_overrides (
  id            bigserial primary key,
  date          date not null,
  is_closed     boolean not null default false,    -- si true, ese día no se atiende
  start_time    time,
  end_time      time,
  note          text
);

-- ─────────────────────────────────────────────
-- Reservas
-- ─────────────────────────────────────────────
create type booking_status as enum ('pending','confirmed','cancelled','completed','no_show');

create table bookings (
  id              uuid primary key default gen_random_uuid(),
  service_id      text not null references services(id) on delete restrict,
  scheduled_at    timestamptz not null,             -- fecha + hora exacta
  duration_min    integer not null,
  status          booking_status not null default 'pending',
  -- datos del paciente
  patient_name    text not null,
  patient_email   citext not null,
  patient_phone   text not null,
  message         text,
  consent         boolean not null default false,
  -- auditoría
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  cancelled_at    timestamptz,
  cancel_reason   text
);

create index bookings_scheduled_at_idx on bookings (scheduled_at);
create index bookings_status_idx on bookings (status);

-- Evitar dobles reservas en el mismo slot
create unique index bookings_no_overlap_idx
  on bookings (scheduled_at)
  where status in ('pending','confirmed');

-- ─────────────────────────────────────────────
-- Admin (la doctora)
-- ─────────────────────────────────────────────
-- Si se usa Supabase Auth, esta tabla se reduce a un perfil ligado a auth.users.
create table admin_profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null,
  created_at    timestamptz not null default now()
);
```

## Row-Level Security (Supabase)

```sql
-- Servicios: lectura pública, solo admin escribe.
alter table services enable row level security;
create policy "services_public_read"   on services for select using (active = true);
create policy "services_admin_all"     on services for all
  using  (auth.uid() in (select id from admin_profiles))
  with check (auth.uid() in (select id from admin_profiles));

-- Reservas: público puede INSERT (crear cita), pero no leer/modificar.
alter table bookings enable row level security;
create policy "bookings_public_insert" on bookings for insert with check (true);
create policy "bookings_admin_read"    on bookings for select
  using (auth.uid() in (select id from admin_profiles));
create policy "bookings_admin_modify"  on bookings for update
  using  (auth.uid() in (select id from admin_profiles))
  with check (auth.uid() in (select id from admin_profiles));
```

## Migraciones

Cuando se arranque el backend:

- **Si usás Supabase:** usar `supabase/migrations/` con `supabase db push` (CLI local).
- **Si usás backend propio con Drizzle:** poner las migraciones en `backend/drizzle/`.

## Datos de arranque (seed)

Los servicios del catálogo viven hoy en [`../frontend/src/data.js`](../frontend/src/data.js). Cuando exista DB, mover ese array a un script de seed:

```sql
insert into services (id, name, slug, description, duration_min, price_crc, for_you) values
  ('individual',       'Terapia individual',       'individual',       '…', 50, 25000, '["..."]'),
  ('pareja',           'Terapia de pareja',        'pareja',           '…', 80, 40000, '["..."]'),
  ('adolescentes',     'Terapia para adolescentes','adolescentes',     '…', 50, 25000, '["..."]'),
  ('primer-encuentro', 'Primer encuentro',         'primer-encuentro', '…', 20, 0,     '["..."]');
```
