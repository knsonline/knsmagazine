import type { AdminTrendPoint } from "@/types/admin";

interface AdminTrendChartProps {
  title: string;
  description: string;
  items: AdminTrendPoint[];
}

function getMaxValue(items: AdminTrendPoint[]) {
  return Math.max(
    1,
    ...items.flatMap((item) => [
      item.sessions,
      item.contentViews,
      item.contentClicks,
      item.consultClicks,
    ]),
  );
}

function getBarHeight(value: number, maxValue: number) {
  if (value <= 0) {
    return 0;
  }

  return Math.max(8, Math.round((value / maxValue) * 176));
}

export function AdminTrendChart({
  title,
  description,
  items,
}: AdminTrendChartProps) {
  const maxValue = getMaxValue(items);

  return (
    <div className="card-surface p-5">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>

      {items.length > 0 ? (
        <>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-text-secondary">
            <span className="inline-flex items-center gap-2 rounded-full bg-ivory px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-navy" />
              유입 세션
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-ivory px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#40618f]" />
              상세조회
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-ivory px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-gold" />
              원문 이동
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-ivory px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
              상담 클릭
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <div className="flex min-w-max items-end gap-4 rounded-[28px] bg-[linear-gradient(180deg,rgba(244,247,251,0.96),rgba(236,241,248,0.94))] px-4 pb-4 pt-8">
              {items.map((item) => (
                <div key={item.key} className="flex w-12 flex-col items-center gap-3">
                  <div className="flex h-44 items-end gap-1">
                    <div
                      className="w-2 rounded-full bg-navy"
                      style={{ height: `${getBarHeight(item.sessions, maxValue)}px` }}
                      title={`유입 세션 ${item.sessions}`}
                    />
                    <div
                      className="w-2 rounded-full bg-[#40618f]"
                      style={{ height: `${getBarHeight(item.contentViews, maxValue)}px` }}
                      title={`상세조회 ${item.contentViews}`}
                    />
                    <div
                      className="w-2 rounded-full bg-gold"
                      style={{ height: `${getBarHeight(item.contentClicks, maxValue)}px` }}
                      title={`원문 이동 ${item.contentClicks}`}
                    />
                    <div
                      className="w-2 rounded-full bg-success"
                      style={{ height: `${getBarHeight(item.consultClicks, maxValue)}px` }}
                      title={`상담 클릭 ${item.consultClicks}`}
                    />
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-xs font-semibold text-text-primary">{item.label}</p>
                    <p className="text-[11px] text-text-secondary">{item.sessions}세션</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-[24px] bg-ivory px-5 py-8 text-center">
          <p className="font-semibold text-text-primary">아직 추이 데이터가 쌓이지 않았습니다.</p>
          <p className="mt-2 text-sm text-text-secondary">유입과 탐색이 발생하면 날짜별 흐름이 여기에 표시됩니다.</p>
        </div>
      )}
    </div>
  );
}
