-- Dakar Transit & Auto — schema for the vehicle catalog + admin space.
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  marque text not null,
  modele text not null,
  annee integer not null,
  kilometrage integer,
  prix bigint,
  prix_barre bigint,
  statut text not null check (statut in ('neuf', 'occasion')),
  vendu boolean not null default false,
  provenance text not null,
  photo_url text not null,
  description text not null default '',
  specs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  sold_at timestamptz
);

alter table public.vehicles enable row level security;

-- Anyone (site visitors) can read the catalog.
create policy "Public can read vehicles"
  on public.vehicles for select
  to anon, authenticated
  using (true);

-- Only a signed-in admin can create, edit or mark vehicles as sold.
create policy "Authenticated can insert vehicles"
  on public.vehicles for insert
  to authenticated
  with check (true);

create policy "Authenticated can update vehicles"
  on public.vehicles for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete vehicles"
  on public.vehicles for delete
  to authenticated
  using (true);

-- Storage bucket for vehicle photos.
insert into storage.buckets (id, name, public)
values ('vehicle-photos', 'vehicle-photos', true)
on conflict (id) do nothing;

create policy "Public can view vehicle photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'vehicle-photos');

create policy "Authenticated can upload vehicle photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'vehicle-photos');

create policy "Authenticated can update vehicle photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'vehicle-photos');
