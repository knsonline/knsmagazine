import Link from "next/link";

export interface AdminDailyMetricRow {
  dateKey: string;
  dateLabel: string;
  pageViews: number;
  sessions: number;
  contentViews: number;
  ctaClicks: number;
  bannerClicks: number;
}

interface AdminDailyMetricsTableProps {
  items: AdminDailyMetricRow[];
  selectedDays: 7 | 30;
}

function formatDelta(value: number): string {
  if (value > 0) {
    return `+${value}`;
  }

  return `${value}`;
}

function DeltaPill({ value }: { value: number }) {
  const toneClassName =
    value > 0
      ? "border border-success/15 bg-success/10 text-success"
      : value < 0
        ? "border border-error/12 bg-error/8 text-error"
        : "border border-black/6 bg-white text-text-secondary";

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${toneClassName}`}>{formatDelta(value)}</span>;
}

export function AdminDailyMetricsTable({ items, selectedDays }: AdminDailyMetricsTableProps) {
  const latest = items.at(-1);
  const previous = items.at(-2);

  const dailyDiffs =
    latest && previous
      ? [
          { label: "페이지뷰", value: latest.pageViews - previous.pageViews },
          { label: "방문 세션", value: latest.sessions - previous.sessions },
          { label: "상세조회", value: latest.contentViews - previous.contentViews },
          { label: "CTA 클릭", value: latest.ctaClicks - previous.ctaClicks },
          { label: "배너 클릭", value: latest.bannerClicks - previous.bannerClicks },
        ]
      : [];

  return (
    <div className="card-surface p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">일별 반응 보기</h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            최근 {selectedDays}일 동안 날짜별 핵심 반응을 한 줄씩 읽을 수 있게 정리했습니다.
          </p>
          <p className="mt-1 text-xs leading-5 text-text-muted">
            방문 세션은 해당 날짜에 이벤트를 남긴 쿠키 기반 세션 수입니다. 정확한 사람 수가 아니라 운영 흐름을 보는 기준으로 해석해 주세요.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin?range=7`}
            className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold transition ${
              selectedDays === 7 ? "bg-navy text-white" : "border border-black/10 bg-white text-text-primary hover:border-navy/20"
            }`}
          >
            최근 7일
          </Link>
          <Link
            href={`/admin?range=30`}
            className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold transition ${
              selectedDays === 30 ? "bg-navy text-white" : "border border-black/10 bg-white text-text-primary hover:border-navy/20"
            }`}
          >
            최근 30일
          </Link>
          <Link
            href={`/api/admin/analytics/daily?days=${selectedDays}`}
            className="inline-flex min-h-10 items-center rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-text-primary transition hover:border-navy/20 hover:text-navy"
          >
            CSV 내보내기
          </Link>
        </div>
      </div>

      {dailyDiffs.length > 0 && latest && previous ? (
        <div className="mt-5 rounded-[24px] border border-[rgba(27,42,74,0.08)] bg-[linear-gradient(180deg,rgba(244,247,251,0.95),rgba(238,243,249,0.92))] p-4">
          <p className="text-sm font-semibold text-text-primary">
            {latest.dateLabel} 기준 전일 대비
          </p>
          <p className="mt-1 text-xs leading-5 text-text-muted">
            비교 기준은 {previous.dateLabel}입니다. 급등락이 있으면 발행, 외부 공유, 배너 노출 여부를 함께 보시면 좋습니다.
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {dailyDiffs.map((diff) => (
              <div key={diff.label} className="inline-flex items-center gap-2 rounded-full bg-white/86 px-3 py-2 text-sm">
                <span className="font-semibold text-text-primary">{diff.label}</span>
                <DeltaPill value={diff.value} />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-[24px] border border-[rgba(27,42,74,0.08)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-[linear-gradient(180deg,rgba(241,246,252,0.96),rgba(234,240,248,0.96))] text-xs font-semibold tracking-[0.01em] text-text-secondary">
              <tr>
                <th className="px-4 py-3">날짜</th>
                <th className="px-4 py-3 text-right">페이지뷰</th>
                <th className="px-4 py-3 text-right">방문 세션</th>
                <th className="px-4 py-3 text-right">상세조회</th>
                <th className="px-4 py-3 text-right">CTA 클릭</th>
                <th className="px-4 py-3 text-right">배너 클릭</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(27,42,74,0.06)] bg-white">
              {items.map((item, index) => {
                const isLatest = index === items.length - 1;

                return (
                  <tr key={item.dateKey} className={isLatest ? "bg-[rgba(244,248,252,0.72)]" : ""}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary">{item.dateLabel}</span>
                        {isLatest ? (
                          <span className="rounded-full bg-navy/8 px-2 py-0.5 text-[11px] font-semibold text-navy">최신</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-text-primary">{item.pageViews}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-text-primary">{item.sessions}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-text-primary">{item.contentViews}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-text-primary">{item.ctaClicks}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-text-primary">{item.bannerClicks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
