import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { AnalyticsEventType, ClientEventPayload } from "@/types/analytics";

const allowedEventTypes: AnalyticsEventType[] = [
  "session_start",
  "page_view",
  "content_impression",
  "content_view",
  "content_click",
  "cta_click",
  "banner_click",
  "grade_select",
  "collection_view",
];

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ ok: true });
  }

  const body = (await request.json()) as Partial<ClientEventPayload>;

  if (!body.eventType || !allowedEventTypes.includes(body.eventType)) {
    return NextResponse.json({ error: "지원하지 않는 이벤트입니다." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("events").insert({
    event_type: body.eventType,
    content_id: body.content_id ?? null,
    cta_id: body.cta_id ?? null,
    banner_id: body.banner_id ?? null,
    collection_id: body.collection_id ?? null,
    grade: body.grade ?? null,
    topic: body.topic ?? null,
    page_path: body.page_path ?? null,
    referrer: body.referrer ?? null,
    device_type: body.device_type ?? null,
    session_id: body.session_id ?? null,
    utm_source: body.utm_source ?? null,
    utm_medium: body.utm_medium ?? null,
    utm_campaign: body.utm_campaign ?? null,
    utm_content: body.utm_content ?? null,
    placement: body.placement ?? null,
    destination_channel: body.destination_channel ?? null,
    landing_path: body.landing_path ?? null,
  });

  if (error) {
    return NextResponse.json({ error: "이벤트를 저장하지 못했습니다." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
