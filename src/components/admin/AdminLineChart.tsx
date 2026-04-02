interface AdminLineChartProps {
  items: Array<{ date: string; value: number }>;
}

export function AdminLineChart({ items }: AdminLineChartProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);
  const points = items
    .map((item, index) => {
      const x = (index / Math.max(items.length - 1, 1)) * 100;
      const y = 100 - (item.value / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="card-surface p-5">
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-text-primary">최근 7일 페이지뷰 추이</h3>
          <span className="rounded-full bg-ivory px-3 py-1 text-xs font-semibold text-text-secondary">오늘 포함 · KST 기준</span>
        </div>
        <p className="mt-2 text-sm text-text-secondary">
          공개 페이지가 열릴 때마다 쌓이는 page_view를 하루 단위로 합산한 그래프입니다.
        </p>
        <p className="mt-1 text-xs text-text-muted">
          맨 오른쪽 값은 오늘 00:00부터 현재 시점까지의 누적이며, 날짜 기준은 모두 한국 시간입니다.
        </p>
      </div>

      <div className="rounded-2xl bg-ivory p-4">
        <svg viewBox="0 0 100 100" className="h-40 w-full overflow-visible">
          <polyline
            fill="none"
            stroke="rgba(27,42,74,0.18)"
            strokeWidth="0.8"
            points="0,100 100,100"
          />
          <polyline
            fill="none"
            stroke="#1B2A4A"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
          />
        </svg>

        <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-text-secondary">
          {items.map((item) => (
            <div key={item.date}>
              <div>{item.date}</div>
              <div className="mt-1 text-text-primary">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm text-text-secondary">
        짧은 급등은 특정 콘텐츠 발행이나 외부 공유 영향일 수 있고, 완만한 상승은 전체 탐색량이 늘어나는 흐름으로 해석하면 좋습니다.
      </p>
    </div>
  );
}
