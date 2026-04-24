import Link from "next/link";
import type { AdminBreakdownItem } from "@/types/admin";

interface AdminInsightListProps {
  title: string;
  description: string;
  items: AdminBreakdownItem[];
  emptyTitle: string;
  emptyDescription: string;
  valueSuffix?: string;
}

function formatPercent(share: number) {
  return `${Math.round(share * 100)}%`;
}

export function AdminInsightList({
  title,
  description,
  items,
  emptyTitle,
  emptyDescription,
  valueSuffix = "",
}: AdminInsightListProps) {
  return (
    <div className="card-surface p-5">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>

      {items.length > 0 ? (
        <div className="mt-5 space-y-3">
          {items.map((item) => {
            const content = (
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-text-primary">{item.label}</p>
                    {item.meta ? (
                      <p className="mt-1 text-xs text-text-secondary">{item.meta}</p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-text-primary">
                      {item.value}
                      {valueSuffix}
                    </p>
                    <p className="text-xs text-text-secondary">{formatPercent(item.share)}</p>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ivory-warm">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#1b2a4a,#405c93)]"
                    style={{ width: `${Math.max(6, Math.round(item.share * 100))}%` }}
                  />
                </div>
              </div>
            );

            if (item.href) {
              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  className="block rounded-[24px] border border-black/6 bg-white px-4 py-4 transition hover:bg-ivory/60"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={item.label}
                className="rounded-[24px] border border-black/6 bg-white px-4 py-4"
              >
                {content}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-[24px] bg-ivory px-5 py-8 text-center">
          <p className="font-semibold text-text-primary">{emptyTitle}</p>
          <p className="mt-2 text-sm text-text-secondary">{emptyDescription}</p>
        </div>
      )}
    </div>
  );
}
