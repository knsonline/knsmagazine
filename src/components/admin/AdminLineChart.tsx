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
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-text-primary">최근 7일 조회수 추이</h3>
        <p className="mt-2 text-sm text-text-secondary">페이지 조회와 콘텐츠 조회를 합산한 흐름입니다.</p>
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
    </div>
  );
}
