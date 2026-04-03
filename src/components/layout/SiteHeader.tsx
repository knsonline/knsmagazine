"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
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

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative h-4 w-5">
      <span
        className={`absolute left-0 top-0 h-[1.5px] w-5 rounded-full bg-current transition ${open ? "translate-y-[7px] rotate-45" : ""}`}
      />
      <span
        className={`absolute left-0 top-[7px] h-[1.5px] w-5 rounded-full bg-current transition ${open ? "opacity-0" : ""}`}
      />
      <span
        className={`absolute left-0 top-[14px] h-[1.5px] w-5 rounded-full bg-current transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
      />
    </span>
  );
}

export function SiteHeader({ consultCta }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-black/6 bg-white/95 backdrop-blur-md">
      <div className="shell">
        <div className="flex min-h-[64px] items-center justify-between gap-4 lg:min-h-[76px] lg:gap-6">
          <Link href="/" className="flex min-w-0 shrink-0 flex-col">
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

          <div className="hidden items-center gap-2 lg:flex">
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
                pagePath: pathname,
                ctaId: consultCta.id,
                ctaLabel: consultCta.label,
                placement: "site_header",
              }}
              className="inline-flex min-h-11 items-center rounded-full bg-cta-primary px-4 text-sm font-semibold text-white transition hover:bg-navy-light"
            >
              상담 신청
            </TrackedExternalLink>
          </div>

          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-black/10 text-text-primary transition hover:border-navy/20 hover:text-navy lg:hidden"
          >
            <MenuIcon open={isMobileMenuOpen} />
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="border-t border-black/6 pb-4 pt-4 lg:hidden">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Link
                  href="/contents"
                  onClick={closeMobileMenu}
                  className="flex min-h-14 items-center justify-between rounded-2xl bg-ivory px-4 text-sm font-semibold text-text-primary"
                >
                  <span>전체 콘텐츠</span>
                  <span className="text-text-secondary">→</span>
                </Link>
                <Link
                  href="/search"
                  onClick={closeMobileMenu}
                  className="flex min-h-14 items-center justify-between rounded-2xl bg-ivory px-4 text-sm font-semibold text-text-primary"
                >
                  <span>검색</span>
                  <span className="text-text-secondary">→</span>
                </Link>
                <TrackedExternalLink
                  href={consultCta.url}
                  event={{
                    eventType: "cta_click",
                    pagePath: pathname,
                    ctaId: consultCta.id,
                    ctaLabel: consultCta.label,
                    placement: "mobile_header_menu",
                  }}
                  onClick={closeMobileMenu}
                  className="flex min-h-14 items-center justify-between rounded-2xl bg-cta-primary px-4 text-sm font-semibold text-white"
                >
                  <span>상담 신청</span>
                  <span className="text-white/72">→</span>
                </TrackedExternalLink>
              </div>

              <div className="rounded-[24px] bg-ivory p-4">
                <p className="text-sm font-semibold text-text-primary">학년별 모아보기</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {PRIMARY_GRADES.map((grade) => (
                    <TrackedInternalLink
                      key={grade}
                      href={`/grades/${encodeURIComponent(grade)}`}
                      event={{
                        eventType: "grade_select",
                        pagePath: `/grades/${grade}`,
                        grade,
                      }}
                      onClick={closeMobileMenu}
                      className="flex min-h-12 items-center justify-center rounded-2xl bg-white px-4 text-sm font-semibold text-text-primary"
                    >
                      {grade}
                    </TrackedInternalLink>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] bg-ivory p-4">
                <p className="text-sm font-semibold text-text-primary">주제별 보기</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {TOPICS.map((topic) => (
                    <Link
                      key={topic}
                      href={`/search?topic=${encodeURIComponent(topic)}`}
                      onClick={closeMobileMenu}
                      className="flex min-h-12 items-center justify-center rounded-2xl bg-white px-4 text-sm font-semibold text-text-primary"
                    >
                      {topic}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
