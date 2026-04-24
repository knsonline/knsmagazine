import Link from "next/link";
import type { AdminCalendarPeriod } from "@/types/admin";

const PERIOD_ITEMS: Array<{
  value: AdminCalendarPeriod;
  label: string;
}> = [
  { value: "today", label: "오늘" },
  { value: "calendar_week", label: "이번 주" },
  { value: "calendar_month", label: "이번 달" },
];

interface AdminPeriodTabsProps {
  selectedPeriod: AdminCalendarPeriod;
  basePath: string;
}

export function AdminPeriodTabs({
  selectedPeriod,
  basePath,
}: AdminPeriodTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PERIOD_ITEMS.map((item) => {
        const isSelected = item.value === selectedPeriod;

        return (
          <Link
            key={item.value}
            href={`${basePath}?period=${item.value}`}
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition ${
              isSelected
                ? "bg-navy text-white"
                : "border border-black/10 bg-white text-text-primary hover:border-navy/20 hover:text-navy"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
