import Link from "next/link";
import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { TrackedInternalLink } from "@/components/analytics/TrackedInternalLink";
import { SITE_NAME } from "@/constants/site";
import { PRIMARY_GRADES, TOPICS } from "@/constants/taxonomy";
import type { Cta, Grade, Topic } from "@/types/content";

interface SiteHeaderProps {
  consultCta: Cta;
}

interface DesktopMenuProps {
  label: string;
  children: React.ReactNode;
}

function DesktopMenu({ label, children }: DesktopMenuProps) {
  return (
    <div className="group relative">
      <button
        type="button"
        aria-haspopup="menu"
        className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-text-secondary transition hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
      >
        {label}
      </button>
      <div className="pointer-events-none absolute left-0 top-full z-20 mt-3 min-w-[220px] translate-y-1 rounded-[24px] border border-black/6 bg-white p-3 opacity-0 shadow-[0_18px_44px_-28px_rgba(27,42,74,0.28)] transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
        {children}
      </div>
    </div>
  );
}

function GradeMenuItem({ grade }: { grade: Grade }) {
  return (
    <TrackedInternalLink
      href={`/grades/${encodeURIComponent(grade)}`}
      event={{
        eventType: "grade_select",
        pagePath: `/grades/${grade}`,
        grade,
      }}
      className="flex min-h-11 items-center rounded-2xl px-3 text-sm font-semibold text-text-primary transition hover:bg-ivory hover:text-navy"
    >
      {grade}
    </TrackedInternalLink>
  );
}

function TopicMenuItem({ topic }: { topic: Topic }) {
  return (
    <Link
      href={`/search?topic=${encodeURIComponent(topic)}`}
      className="flex min-h-11 items-center rounded-2xl px-3 text-sm font-semibold text-text-primary transition hover:bg-ivory hover:text-navy"
    >
      {topic}
    </Link>
  );
}

export function SiteHeader({ consultCta }: SiteHeaderProps) {
  return (
    <header className="sticky top-11 z-30 border-b border-black/6 bg-white/95 backdrop-blur-md">
      <div className="shell">
        <div className="flex min-h-[76px] items-center justify-between gap-6">
          <Link href="/" className="flex shrink-0 flex-col">
            <span className="text-lg font-bold tracking-[-0.03em] text-navy">{SITE_NAME}</span>
            <span className="hidden text-xs text-text-secondary sm:block">교육 입시 큐레이션</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-text-secondary transition hover:text-navy"
            >
              홈
            </Link>
            <Link
              href="/contents"
              className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-text-secondary transition hover:text-navy"
            >
              전체 콘텐츠
            </Link>
            <DesktopMenu label="학년별">
              <div className="grid gap-1">
                {PRIMARY_GRADES.map((grade) => (
                  <GradeMenuItem key={grade} grade={grade} />
                ))}
              </div>
            </DesktopMenu>
            <DesktopMenu label="주제별">
              <div className="grid min-w-[260px] gap-1 sm:grid-cols-2">
                {TOPICS.map((topic) => (
                  <TopicMenuItem key={topic} topic={topic} />
                ))}
              </div>
            </DesktopMenu>
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
                placement: "site_header",
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
