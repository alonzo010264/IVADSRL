-- 1. Crear tabla de órdenes/pedidos (ya creada, pero mantenida por seguridad)
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_name text not null,
  client_email text not null,
  client_phone text,
  total_amount numeric not null,
  items jsonb not null,
  status text default 'pendiente'::text
);

-- 2. Crear tabla de productos (especialmente para Desechables)
create table if not exists products (
  id text primary key,
  title text not null,
  price text not null,
  price_num numeric not null,
  img text not null,
  sub_category text not null, -- platos, vasos, cubiertos, bandejas, contenedores, servilletas, bolsas
  material text,
  uso text[] default '{}',
  recent_score integer default 0,
  description text,
  features text[] default '{}',
  status text default 'Activo', -- Activo, Borrador
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar seguridad RLS para productos
alter table products enable row level security;

-- Eliminar políticas de productos si existen
drop policy if exists "Permitir lectura de productos pública" on products;
drop policy if exists "Permitir modificaciones de productos a administradores" on products;

-- Crear políticas para productos
create policy "Permitir lectura de productos pública"
on products for select
using (true);

create policy "Permitir modificaciones de productos a administradores"
on products for all
using (true); -- En un entorno real se limitaría al admin, pero aquí permitimos gestión libre para desarrollo

-- 3. Crear bucket de almacenamiento para imágenes si no existe
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Eliminar políticas de objetos del bucket si existen
drop policy if exists "Acceso público de lectura de fotos" on storage.objects;
drop policy if exists "Permitir subidas públicas de fotos" on storage.objects;
drop policy if exists "Permitir actualización de fotos" on storage.objects;
drop policy if exists "Permitir eliminación de fotos" on storage.objects;

-- Crear políticas para subir y administrar fotos en el bucket 'product-images'
create policy "Acceso público de lectura de fotos"
on storage.objects for select
using ( bucket_id = 'product-images' );

create policy "Permitir subidas públicas de fotos"
on storage.objects for insert
with check ( bucket_id = 'product-images' );

create policy "Permitir actualización de fotos"
on storage.objects for update
using ( bucket_id = 'product-images' );

create policy "Permitir eliminación de fotos"
on storage.objects for delete
using ( bucket_id = 'product-images' );


-- =========================================================================
-- 4. TABLAS PARA EL MÓDULO DE FIDELIZACIÓN DIGITAL (LOVELY DIGITAL WALLET)
-- =========================================================================

-- Tabla de Tarjetas de Fidelización
create table if not exists loyalty_cards (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  card_code text unique not null,
  client_name text not null,
  client_email text unique not null,
  client_phone text,
  client_cedula text,
  current_points integer default 0,
  points_target integer default 50,
  temp_password text not null,
  status text default 'activo'
);

-- Si ya tienes la tabla, agrega la columna cedula con:
-- alter table loyalty_cards add column if not exists client_cedula text;

-- Tabla de Credenciales de Acceso
create table if not exists loyalty_credentials (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  card_id uuid references loyalty_cards(id) on delete cascade,
  client_email text unique not null,
  temp_password text not null,
  last_login timestamp with time zone,
  email_sent boolean default false,
  email_sent_at timestamp with time zone
);

-- Tabla de Transacciones de Fidelización (Historial de puntos)
create table if not exists loyalty_transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  card_id uuid references loyalty_cards(id) on delete cascade,
  sale_amount numeric not null,
  points_added integer default 1,
  invoice_number text,
  notes text
);

-- Habilitar seguridad RLS
alter table loyalty_cards enable row level security;
alter table loyalty_credentials enable row level security;
alter table loyalty_transactions enable row level security;

-- Eliminar políticas si ya existen
drop policy if exists "Permitir todo público en tarjetas" on loyalty_cards;
drop policy if exists "Permitir todo público en credenciales" on loyalty_credentials;
drop policy if exists "Permitir todo público en transacciones" on loyalty_transactions;

-- Crear políticas de acceso simplificadas para desarrollo
create policy "Permitir todo público en tarjetas" on loyalty_cards for all using (true);
create policy "Permitir todo público en credenciales" on loyalty_credentials for all using (true);
create policy "Permitir todo público en transacciones" on loyalty_transactions for all using (true);

-- Habilitar replicación en tiempo real (Realtime) para actualización instantánea
alter publication supabase_realtime add table loyalty_cards;
alter publication supabase_realtime add table loyalty_transactions;

