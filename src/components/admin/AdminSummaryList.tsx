import Link from "next/link";

interface AdminSummaryListItem {
  label: string;
  value: number;
  meta?: string;
  href?: string;
}

interface AdminSummaryListProps {
  title: string;
  description: string;
  items: AdminSummaryListItem[];
  emptyTitle: string;
  emptyDescription: string;
  valueLabel?: string;
}

export function AdminSummaryList({
  title,
  description,
  items,
  emptyTitle,
  emptyDescription,
  valueLabel = "수치",
}: AdminSummaryListProps) {
  return (
    <div className="card-surface p-5">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>

      {items.length > 0 ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-black/6">
          <div className="grid grid-cols-[56px_minmax(0,1fr)_88px] bg-ivory px-4 py-3 text-xs font-semibold text-text-secondary">
            <span>순위</span>
            <span>항목</span>
            <span className="text-right">{valueLabel}</span>
          </div>
          <div className="divide-y divide-black/6">
            {items.map((item, index) => {
              const content = (
                <>
                  <span className="text-sm font-semibold text-navy">#{index + 1}</span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-text-primary">{item.label}</p>
                    {item.meta ? <p className="mt-1 text-xs text-text-secondary">{item.meta}</p> : null}
                  </div>
                  <span className="text-right text-sm font-semibold text-text-primary">{item.value}</span>
                </>
              );

              if (item.href) {
                return (
                  <Link
                    key={`${item.label}-${index}`}
                    href={item.href}
                    className="grid grid-cols-[56px_minmax(0,1fr)_88px] items-center gap-3 px-4 py-3 transition hover:bg-ivory/70"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div
                  key={`${item.label}-${index}`}
                  className="grid grid-cols-[56px_minmax(0,1fr)_88px] items-center gap-3 px-4 py-3"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl bg-ivory px-5 py-8 text-center">
          <p className="font-semibold text-text-primary">{emptyTitle}</p>
          <p className="mt-2 text-sm text-text-secondary">{emptyDescription}</p>
        </div>
      )}
    </div>
  );
}
