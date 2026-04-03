import { TrackedInternalLink } from "@/components/analytics/TrackedInternalLink";
import { GRADES } from "@/constants/taxonomy";
import type { Grade } from "@/types/content";

interface GradeQuickLinksProps {
  currentPath: string;
}

const GRADE_TILES: Record<
  Grade,
  {
    description: string;
    className: string;
  }
> = {
  초등: {
    description: "기초와 습관",
    className: "border-[#d6e4f0] bg-[#eff6fb] text-navy",
  },
  중등: {
    description: "내신과 방향",
    className: "border-[#d7dfd7] bg-[#f2f6f1] text-navy",
  },
  예비고1: {
    description: "전환 준비",
    className: "border-[#e7ddd0] bg-[#faf4ec] text-navy",
  },
  고등: {
    description: "입시 집중",
    className: "border-[#d9dde5] bg-[#f1f4f8] text-navy",
  },
  공통: {
    description: "함께 보는 주제",
    className: "border-[#e4dbd3] bg-[#f7f2ee] text-navy",
  },
};

export function GradeQuickLinks({ currentPath }: GradeQuickLinksProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {GRADES.map((grade) => (
        <TrackedInternalLink
          key={grade}
          href={`/grades/${encodeURIComponent(grade)}`}
          event={{
            eventType: "grade_select",
            pagePath: currentPath,
            grade,
          }}
          className={`group flex min-h-[92px] flex-col justify-between rounded-[24px] border px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-28px_rgba(27,42,74,0.22)] last:col-span-2 sm:last:col-span-1 lg:min-h-[84px] ${GRADE_TILES[grade].className}`}
        >
          <div className="flex items-start justify-between gap-3">
            <span className="text-[17px] font-semibold tracking-[-0.02em]">{grade}</span>
            <span className="text-sm text-navy/45 transition group-hover:text-navy">→</span>
          </div>
          <span className="text-xs font-semibold text-navy/58">{GRADE_TILES[grade].description}</span>
        </TrackedInternalLink>
      ))}
    </div>
  );
}
