import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { AnalyticsEventRecord, AnalyticsEventType } from "@/types/analytics";

const allowedEventTypes: AnalyticsEventType[] = [
  "page_view",
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

  const body = (await request.json()) as Partial<AnalyticsEventRecord>;

  if (!body.eventType || !allowedEventTypes.includes(body.eventType)) {
    return NextResponse.json({ error: "지원하지 않는 이벤트입니다." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("events").insert({
    event_type: body.eventType,
    session_id: body.sessionId ?? null,
    content_id: body.contentId ?? null,
    cta_id: body.ctaId ?? null,
    banner_id: body.bannerId ?? null,
    collection_id: body.collectionId ?? null,
    grade: body.grade ?? null,
    topic: body.topic ?? null,
    page_path: body.pagePath ?? null,
    referrer: body.referrer ?? null,
    utm_source: body.utmSource ?? null,
    utm_medium: body.utmMedium ?? null,
    utm_campaign: body.utmCampaign ?? null,
    device_type: body.deviceType ?? null,
    created_at: body.timestamp ?? new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: "이벤트를 저장하지 못했습니다." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
