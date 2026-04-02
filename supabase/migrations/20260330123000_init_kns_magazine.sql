create extension if not exists pgcrypto;

create type grade_enum as enum ('초등', '중등', '예비고1', '고등', '공통');
create type topic_enum as enum ('내신', '수능', '특목고', '학습법', '입시정보', '기타');
create type content_type_enum as enum ('글', '영상');

create table if not exists public.ctas (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.contents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  body text,
  external_url text not null,
  thumbnail_url text,
  grade grade_enum not null,
  topic topic_enum not null,
  content_type content_type_enum not null,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  is_hero boolean not null default false,
  cta_id uuid references public.ctas(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  link_url text,
  starts_at date,
  ends_at date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_visible_home boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.collection_items (
  collection_id uuid not null references public.collections(id) on delete cascade,
  content_id uuid not null references public.contents(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (collection_id, content_id)
);

create table if not exists public.events (
  id bigint generated always as identity primary key,
  event_type text not null,
  session_id text,
  content_id uuid references public.contents(id) on delete set null,
  cta_id uuid references public.ctas(id) on delete set null,
  banner_id uuid references public.banners(id) on delete set null,
  collection_id uuid references public.collections(id) on delete set null,
  grade text,
  topic text,
  page_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  device_type text,
  created_at timestamptz not null default now()
);

create unique index if not exists contents_single_hero_idx
  on public.contents (is_hero)
  where is_hero = true;

create index if not exists contents_published_idx
  on public.contents (is_published, updated_at desc);

create index if not exists collection_items_collection_idx
  on public.collection_items (collection_id, sort_order);

create index if not exists events_created_at_idx
  on public.events (created_at desc);

create index if not exists events_content_idx
  on public.events (content_id);

create or replace function public.set_contents_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contents_updated_at_trigger on public.contents;
create trigger contents_updated_at_trigger
before update on public.contents
for each row
execute function public.set_contents_updated_at();

alter table public.ctas enable row level security;
alter table public.contents enable row level security;
alter table public.banners enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;
alter table public.events enable row level security;

create policy "authenticated_manage_ctas"
on public.ctas
for all
to authenticated
using (true)
with check (true);

create policy "authenticated_manage_contents"
on public.contents
for all
to authenticated
using (true)
with check (true);

create policy "authenticated_manage_banners"
on public.banners
for all
to authenticated
using (true)
with check (true);

create policy "authenticated_manage_collections"
on public.collections
for all
to authenticated
using (true)
with check (true);

create policy "authenticated_manage_collection_items"
on public.collection_items
for all
to authenticated
using (true)
with check (true);

create policy "authenticated_manage_events"
on public.events
for all
to authenticated
using (true)
with check (true);

create policy "public_insert_events"
on public.events
for insert
to anon
with check (true);
