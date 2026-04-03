import { NextResponse } from "next/server";
import { buildAdminDailyMetricsCsv, getAdminDailyMetrics } from "@/lib/data/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getKstDateKey } from "@/lib/utils/format";

function parseDays(value: string | null): 7 | 30 {
  return value === "30" ? 30 : 7;
}

export async function GET(request: Request) {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "관리자 로그인 후 다시 시도해 주세요." }, { status: 401 });
    }
  }

  const { searchParams } = new URL(request.url);
  const days = parseDays(searchParams.get("days"));
  const rows = await getAdminDailyMetrics(days);
  const csv = buildAdminDailyMetricsCsv(rows);
  const filename = `kns-daily-metrics-${days}d-${getKstDateKey()}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
