import Link from "next/link";
import type { AdminAlertItem } from "@/types/admin";

interface AdminAlertListProps {
  items: AdminAlertItem[];
}

export function AdminAlertList({ items }: AdminAlertListProps) {
  return (
    <div className="card-surface p-5">
      <h2 className="text-lg font-semibold text-text-primary">운영 제안</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        이번 기간에 바로 손봐야 할 운영 신호를 모았습니다.
      </p>

      {items.length > 0 ? (
        <div className="mt-5 space-y-3">
          {items.map((item, index) => {
            const toneClassName =
              item.tone === "warning"
                ? "border-warning/20 bg-[rgba(217,119,6,0.08)] text-warning"
                : "border-navy/12 bg-[rgba(27,42,74,0.06)] text-navy";

            const content = (
              <div className={`rounded-[24px] border px-4 py-4 ${toneClassName}`}>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-text-primary/80">{item.description}</p>
              </div>
            );

            if (item.href) {
              return (
                <Link key={`${item.title}-${index}`} href={item.href}>
                  {content}
                </Link>
              );
            }

            return <div key={`${item.title}-${index}`}>{content}</div>;
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-[24px] bg-ivory px-5 py-8 text-center">
          <p className="font-semibold text-text-primary">지금은 큰 운영 경고가 없습니다.</p>
          <p className="mt-2 text-sm text-text-secondary">히어로, 배너, CTA, 상담 반응이 안정적으로 유지되고 있습니다.</p>
        </div>
      )}
    </div>
  );
}
