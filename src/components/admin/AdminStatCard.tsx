interface AdminStatCardProps {
  label: string;
  value: string;
  help: string;
  tooltip?: string;
}

export function AdminStatCard({ label, value, help, tooltip }: AdminStatCardProps) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-text-secondary">{label}</p>
        {tooltip ? (
          <div className="group relative">
            <button
              type="button"
              aria-label={`${label} 설명`}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-black/10 bg-ivory text-[11px] font-bold text-text-secondary"
            >
              i
            </button>
            <div className="pointer-events-none absolute left-0 top-full z-10 mt-2 hidden w-64 rounded-2xl bg-navy px-3 py-3 text-xs font-medium leading-5 text-white shadow-lg group-hover:block group-focus-within:block">
              {tooltip}
            </div>
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-bold tracking-[-0.03em] text-text-primary">{value}</p>
      <p className="mt-3 text-sm leading-6 text-text-secondary">{help}</p>
    </div>
  );
}
