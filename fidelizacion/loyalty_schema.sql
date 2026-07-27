-- =========================================================================
-- MÓDULO DE FIDELIZACIÓN DIGITAL - IVAD Home & Goods
-- Ejecutar este script en el SQL Editor de Supabase
-- =========================================================================


-- ─── 1. TARJETAS DE FIDELIZACIÓN ─────────────────────────────────────────
-- Guarda cada tarjeta digital emitida a un cliente
create table if not exists loyalty_cards (
  id               uuid        default gen_random_uuid() primary key,
  created_at       timestamptz default timezone('utc', now()) not null,
  card_code        text        unique not null,          -- Ej: IVAD-693886E7
  client_name      text        not null,
  client_email     text        unique not null,
  client_phone     text,
  client_cedula    text,                                 -- Cedula o identificacion del cliente
  current_points   integer     default 0,
  points_target    integer     default 50,               -- Puntos para completar la tarjeta (Meta de Recompensas)
  temp_password    text        not null,                 -- Clave de acceso del cliente
  status           text        default 'activo'          -- activo | suspendido | completado
);

-- Si ya tienes la tabla creada, agrega la columna con:
-- alter table loyalty_cards add column if not exists client_cedula text;

-- ─── 2. CREDENCIALES DE ACCESO ───────────────────────────────────────────
-- Registra usuario y clave de cada cliente para su panel
-- Se guarda automáticamente cuando se emite la tarjeta
create table if not exists loyalty_credentials (
  id               uuid        default gen_random_uuid() primary key,
  created_at       timestamptz default timezone('utc', now()) not null,
  card_id          uuid        references loyalty_cards(id) on delete cascade,
  client_email     text        unique not null,          -- Usado como usuario para login
  temp_password    text        not null,                 -- Clave temporal enviada por correo
  last_login       timestamptz,                          -- Última vez que inició sesión
  email_sent       boolean     default false,            -- Si el correo fue enviado
  email_sent_at    timestamptz                           -- Cuándo se envió el correo
);

-- ─── 3. TRANSACCIONES / HISTORIAL DE PUNTOS ──────────────────────────────
-- Cada vez que el admin registra una compra, se agrega una fila aquí
create table if not exists loyalty_transactions (
  id               uuid        default gen_random_uuid() primary key,
  created_at       timestamptz default timezone('utc', now()) not null,
  card_id          uuid        references loyalty_cards(id) on delete cascade,
  sale_amount      numeric     not null,                 -- Monto de la venta en RD$
  points_added     integer     default 1,               -- Puntos sumados (normalmente 1 por compra)
  invoice_number   text,                                 -- Número de factura asociado
  notes            text                                  -- Nota opcional del cajero
);


-- =========================================================================
-- SEGURIDAD RLS (Row Level Security)
-- =========================================================================

alter table loyalty_cards         enable row level security;
alter table loyalty_credentials   enable row level security;
alter table loyalty_transactions  enable row level security;

-- Limpiar políticas previas si existen
drop policy if exists "Tarjetas: acceso público total"       on loyalty_cards;
drop policy if exists "Credenciales: acceso público total"   on loyalty_credentials;
drop policy if exists "Transacciones: acceso público total"  on loyalty_transactions;

-- Políticas abiertas para el panel admin y cliente
-- (En producción avanzada se restringe por JWT/rol)
create policy "Tarjetas: acceso público total"
  on loyalty_cards for all using (true);

create policy "Credenciales: acceso público total"
  on loyalty_credentials for all using (true);

create policy "Transacciones: acceso público total"
  on loyalty_transactions for all using (true);


-- =========================================================================
-- REALTIME (Actualizaciones en tiempo real al cliente)
-- =========================================================================

-- Permite que el panel del cliente se actualice instantáneamente
-- cuando el admin registra una compra o suma puntos
alter publication supabase_realtime add table loyalty_cards;
alter publication supabase_realtime add table loyalty_transactions;


-- =========================================================================
-- ÍNDICES PARA BÚSQUEDA RÁPIDA
-- =========================================================================

create index if not exists idx_loyalty_cards_email
  on loyalty_cards (client_email);

create index if not exists idx_loyalty_cards_code
  on loyalty_cards (card_code);

create index if not exists idx_loyalty_credentials_email
  on loyalty_credentials (client_email);

create index if not exists idx_loyalty_transactions_card
  on loyalty_transactions (card_id, created_at desc);


-- =========================================================================
-- VERIFICACIÓN FINAL
-- =========================================================================

-- Ejecuta esto para confirmar que las tablas existen:
-- select table_name from information_schema.tables
-- where table_schema = 'public'
-- and table_name like 'loyalty%';
