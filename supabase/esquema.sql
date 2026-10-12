-- Lado B: ejecutá este script una sola vez en Supabase > SQL Editor.

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text not null default '',
  precio integer not null check (precio >= 0),
  coleccion text not null default '',
  fotos text[] not null default '{}',
  -- Cada color: { "nombre": "Negro", "hex": "#1C1C1C", "stock": 3 }
  colores jsonb not null default '[]'::jsonb,
  publicado boolean not null default false,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.productos enable row level security;

-- Cualquier visitante ve solo los productos publicados.
create policy "Visitantes ven publicados"
  on public.productos for select
  using (publicado = true);

-- La administradora (usuaria logueada) puede ver y editar todo.
create policy "Admin ve todo"
  on public.productos for select to authenticated using (true);
create policy "Admin crea"
  on public.productos for insert to authenticated with check (true);
create policy "Admin edita"
  on public.productos for update to authenticated using (true) with check (true);
create policy "Admin borra"
  on public.productos for delete to authenticated using (true);

-- Carpeta pública para las fotos de las gorras.
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

create policy "Admin sube fotos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos');
create policy "Admin reemplaza fotos"
  on storage.objects for update to authenticated
  using (bucket_id = 'fotos');
create policy "Admin borra fotos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'fotos');
