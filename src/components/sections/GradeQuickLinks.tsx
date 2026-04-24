import { TrackedInternalLink } from "@/components/analytics/TrackedInternalLink";
import { PRIMARY_GRADES } from "@/constants/taxonomy";
import type { Grade } from "@/types/content";

interface GradeQuickLinksProps {
  currentPath: string;
  placement?: string;
}

const GRADE_TILES: Record<
  Grade,
  {
    description: string;
    surfaceClassName: string;
    accentClassName: string;
    descriptionClassName: string;
  }
> = {
  초등: {
    description: "기초와 습관",
    surfaceClassName:
      "border-[#d4e3f6] bg-[linear-gradient(180deg,#ffffff_0%,#edf4fb_100%)] text-[#1f446d]",
    accentClassName: "bg-[#85b5f3]",
    descriptionClassName: "text-[#5b7695]",
  },
  중등: {
    description: "내신과 방향",
    surfaceClassName:
      "border-[#d5e7da] bg-[linear-gradient(180deg,#ffffff_0%,#eef7f0_100%)] text-[#224a36]",
    accentClassName: "bg-[#8ec49e]",
    descriptionClassName: "text-[#5a7764]",
  },
  예비고1: {
    description: "전환 준비",
    surfaceClassName:
      "border-[#ead9c1] bg-[linear-gradient(180deg,#fffdf8_0%,#f8efe2_100%)] text-[#6b4722]",
    accentClassName: "bg-[#d7a46d]",
    descriptionClassName: "text-[#8d6f4f]",
  },
  고등: {
    description: "입시 집중",
    surfaceClassName:
      "border-[#dae2ec] bg-[linear-gradient(180deg,#ffffff_0%,#eef3f8_100%)] text-[#334866]",
    accentClassName: "bg-[#aebdd1]",
    descriptionClassName: "text-[#647388]",
  },
  공통: {
    description: "함께 보는 주제",
    surfaceClassName:
      "border-[#7a6d69]/72 bg-[linear-gradient(180deg,#4e4544_0%,#352e2f_100%)] text-[#fbf8f4]",
    accentClassName: "bg-[#cab7a8]",
    descriptionClassName: "text-[#e1d4cb]",
  },
};

export function GradeQuickLinks({ currentPath, placement }: GradeQuickLinksProps) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-x-visible lg:px-0">
      {PRIMARY_GRADES.map((grade) => {
        const tile = GRADE_TILES[grade];

        return (
          <TrackedInternalLink
            key={grade}
            href={`/grades/${encodeURIComponent(grade)}`}
            event={{
              eventType: "grade_select",
              pagePath: currentPath,
              grade,
              placement,
            }}
            className={`group relative flex min-h-[102px] w-[44%] min-w-[156px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[24px] border px-4 py-4 text-left shadow-[0_18px_36px_-30px_rgba(27,42,74,0.24)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_46px_-28px_rgba(27,42,74,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/10 lg:min-h-[88px] lg:w-auto lg:min-w-0 ${tile.surfaceClassName}`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.82),transparent_48%)] opacity-90" />
            <span className={`pointer-events-none absolute left-4 top-4 h-1.5 w-1.5 rounded-full opacity-90 ${tile.accentClassName}`} />

            <div className="relative z-10 flex items-start justify-between gap-3">
              <span className="text-[17px] font-semibold tracking-[-0.015em]">{grade}</span>
              <span className="text-sm text-current/42 transition group-hover:text-current/70">→</span>
            </div>
            <span className={`relative z-10 text-xs font-semibold ${tile.descriptionClassName}`}>{tile.description}</span>
          </TrackedInternalLink>
        );
      })}
    </div>
  );
}
