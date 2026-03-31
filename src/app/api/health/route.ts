import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

function buildHealthPayload() {
  const supabaseConfigured = hasSupabaseEnv();
  const isProduction = process.env.NODE_ENV === "production";
  const status = isProduction && !supabaseConfigured ? "degraded" : "ok";

  return {
    status,
    service: "kns-magazine",
    mode: "lightweight",
    timestamp: new Date().toISOString(),
    checks: {
      app: "ok",
      supabaseEnv: supabaseConfigured ? "configured" : "missing",
      database: "skipped",
      storage: "skipped",
    },
    notes: [
      "이 endpoint는 DB나 Storage를 직접 조회하지 않습니다.",
      "기본 상태 확인과 외부 uptime 체크 용도로 사용하세요.",
    ],
  } as const;
}

function buildHealthResponse() {
  const payload = buildHealthPayload();
  const statusCode = payload.status === "ok" ? 200 : 503;

  return NextResponse.json(payload, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function GET() {
  return buildHealthResponse();
}

export async function HEAD() {
  const payload = buildHealthPayload();
  const statusCode = payload.status === "ok" ? 200 : 503;

  return new NextResponse(null, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
