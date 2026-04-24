-- Rollback intelligence upgrade
drop view if exists public.admin_channel_performance_v cascade;
drop view if exists public.admin_conversion_performance_v cascade;
drop view if exists public.admin_content_intelligence_v cascade;
drop view if exists public.admin_track_funnel_v cascade;
drop view if exists public.admin_session_journeys_v cascade;

drop policy if exists "authenticated_manage_conversion_targets" on public.conversion_targets;
drop policy if exists "authenticated_manage_program_schedules" on public.program_schedules;
drop policy if exists "authenticated_manage_program_tracks" on public.program_tracks;

alter table public.events
  drop column if exists track_id cascade,
  drop column if exists conversion_target_id cascade,
  drop column if exists conversion_type cascade,
  drop column if exists placement cascade,
  drop column if exists page_type cascade,
  drop column if exists outbound_url cascade,
  drop column if exists referrer_host cascade,
  drop column if exists journey_key cascade,
  drop column if exists parent_event_id cascade,
  drop column if exists event_meta cascade;

alter table public.banners
  drop column if exists track_id cascade,
  drop column if exists conversion_target_id cascade;

alter table public.contents
  drop column if exists primary_conversion_target_id cascade,
  drop column if exists track_id cascade;

drop table if exists public.program_schedules cascade;
drop table if exists public.conversion_targets cascade;
drop table if exists public.program_tracks cascade;
drop type if exists conversion_target_type_enum cascade;
