do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'cta_kind_enum'
  ) then
    create type public.cta_kind_enum as enum ('consult', 'external');
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'consult_segment_enum'
  ) then
    create type public.consult_segment_enum as enum ('초등', '중1', '고등관');
  end if;
end
$$;

alter table public.ctas
  add column if not exists kind public.cta_kind_enum not null default 'external',
  add column if not exists consult_segment public.consult_segment_enum;

alter table public.banners
  add column if not exists title text;

alter table public.events
  add column if not exists placement text,
  add column if not exists destination_channel text,
  add column if not exists landing_path text;

update public.ctas
set kind = case
  when url like 'tel:%' then 'consult'::public.cta_kind_enum
  else 'external'::public.cta_kind_enum
end;

update public.ctas
set consult_segment = case
  when label ilike '%초등%' then '초등'::public.consult_segment_enum
  when label ilike '%중1%' then '중1'::public.consult_segment_enum
  when label ilike '%고등%' then '고등관'::public.consult_segment_enum
  else consult_segment
end
where kind = 'consult'
  and consult_segment is null;

update public.banners
set title = coalesce(nullif(btrim(title), ''), '주요 안내')
where title is null
   or btrim(title) = '';

create index if not exists events_session_id_idx
  on public.events (session_id);

create index if not exists events_event_type_created_at_idx
  on public.events (event_type, created_at desc);

create index if not exists events_utm_campaign_idx
  on public.events (utm_campaign);
