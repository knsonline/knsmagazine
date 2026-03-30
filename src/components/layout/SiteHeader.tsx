import Link from "next/link";
import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { TrackedInternalLink } from "@/components/analytics/TrackedInternalLink";
import { SITE_NAME } from "@/constants/site";
import { PRIMARY_GRADES, TOPICS } from "@/constants/taxonomy";
import type { Cta } from "@/types/content";

interface SiteHeaderProps {
  consultCta: Cta;
}

export function SiteHeader({ consultCta }: SiteHeaderProps) {
  return (
    <header className="sticky top-11 z-30 border-b border-black/6 bg-white/95 backdrop-blur-md">
      <div className="shell">
        <div className="flex min-h-16 items-center justify-between gap-4">
          <Link href="/" className="flex flex-col">
            <span className="text-lg font-bold tracking-[-0.03em] text-navy">{SITE_NAME}</span>
            <span className="hidden text-xs text-text-secondary sm:block">영어 입시 큐레이션</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-text-secondary lg:flex">
            <Link href="/" className="transition hover:text-navy">
              홈
            </Link>
            <Link href="/contents" className="transition hover:text-navy">
              전체 콘텐츠
            </Link>
            {PRIMARY_GRADES.map((grade) => (
              <TrackedInternalLink
                key={grade}
                href={`/grades/${encodeURIComponent(grade)}`}
                event={{
                  eventType: "grade_select",
                  pagePath: `/grades/${grade}`,
                  grade,
                }}
                className="transition hover:text-navy"
              >
                {grade}
              </TrackedInternalLink>
            ))}
            {TOPICS.slice(0, 4).map((topic) => (
              <Link
                key={topic}
                href={`/search?topic=${encodeURIComponent(topic)}`}
                className="transition hover:text-navy"
              >
                {topic}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="inline-flex min-h-11 items-center rounded-full border border-black/10 px-4 text-sm font-semibold text-text-primary transition hover:border-navy/20 hover:text-navy"
            >
              검색
            </Link>
            <TrackedExternalLink
              href={consultCta.url}
              event={{
                eventType: "cta_click",
                pagePath: "/",
                ctaId: consultCta.id,
                ctaLabel: consultCta.label,
              }}
              className="inline-flex min-h-11 items-center rounded-full bg-cta-primary px-4 text-sm font-semibold text-white transition hover:bg-navy-light"
            >
              상담 신청
            </TrackedExternalLink>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 lg:hidden">
          <Link
            href="/contents"
            className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-ivory-warm px-4 text-sm font-semibold text-text-primary"
          >
            전체 콘텐츠
          </Link>
          {PRIMARY_GRADES.map((grade) => (
            <TrackedInternalLink
              key={grade}
              href={`/grades/${encodeURIComponent(grade)}`}
              event={{
                eventType: "grade_select",
                pagePath: `/grades/${grade}`,
                grade,
              }}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-ivory-warm px-4 text-sm font-semibold text-text-primary"
            >
              {grade}
            </TrackedInternalLink>
          ))}
          {TOPICS.slice(0, 3).map((topic) => (
            <Link
              key={topic}
              href={`/search?topic=${encodeURIComponent(topic)}`}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-ivory-warm px-4 text-sm font-semibold text-text-primary"
            >
              {topic}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
