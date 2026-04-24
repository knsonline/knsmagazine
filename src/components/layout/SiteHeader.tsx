"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { TrackedInternalLink } from "@/components/analytics/TrackedInternalLink";
import { SITE_NAME } from "@/constants/site";
import { PRIMARY_GRADES, TOPICS } from "@/constants/taxonomy";
import type { Cta, Grade, Topic } from "@/types/content";

const DESKTOP_MENU_CLOSE_DELAY = 180;

type DesktopMenuKey = "grades" | "topics";

interface SiteHeaderProps {
  consultCta: Cta;
}

interface DesktopMenuProps {
  label: string;
  menuKey: DesktopMenuKey;
  isOpen: boolean;
  onOpen: (menuKey: DesktopMenuKey) => void;
  onClose: () => void;
  onScheduleClose: () => void;
  children: React.ReactNode;
}

function DesktopMenu({
  label,
  menuKey,
  isOpen,
  onOpen,
  onClose,
  onScheduleClose,
  children,
}: DesktopMenuProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelId = `desktop-menu-${menuKey}`;

  return (
    <div
      className="relative"
      onPointerEnter={() => onOpen(menuKey)}
      onPointerLeave={onScheduleClose}
      onBlurCapture={(event) => {
        const nextFocused = event.relatedTarget as Node | null;

        if (!nextFocused || !event.currentTarget.contains(nextFocused)) {
          onClose();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => (isOpen ? onClose() : onOpen(menuKey))}
        onFocus={() => onOpen(menuKey)}
        className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
          isOpen ? "text-navy" : "text-text-secondary hover:text-navy"
        }`}
      >
        {label}
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full z-20 w-max pt-3">
          <div
            id={panelId}
            aria-label={label}
            className="rounded-[24px] border border-black/6 bg-white p-3 shadow-[0_18px_44px_-28px_rgba(27,42,74,0.28)]"
          >
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function GradeMenuItem({
  grade,
  onSelect,
  currentPath,
}: {
  grade: Grade;
  onSelect: () => void;
  currentPath: string;
}) {
  return (
    <TrackedInternalLink
      href={`/grades/${encodeURIComponent(grade)}`}
      event={{
        eventType: "grade_select",
        pagePath: currentPath,
        grade,
      }}
      onClick={onSelect}
      className="flex min-h-11 items-center rounded-2xl px-3 text-sm font-semibold text-text-primary transition hover:bg-ivory hover:text-navy"
    >
      {grade}
    </TrackedInternalLink>
  );
}

function TopicMenuItem({ topic, onSelect }: { topic: Topic; onSelect: () => void }) {
  return (
    <Link
      href={`/search?topic=${encodeURIComponent(topic)}`}
      onClick={onSelect}
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
  const [openDesktopMenu, setOpenDesktopMenu] = useState<DesktopMenuKey | null>(null);
  const desktopNavRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const closeDesktopMenu = () => {
    clearCloseTimer();
    setOpenDesktopMenu(null);
  };

  const openDesktopMenuByKey = (menuKey: DesktopMenuKey) => {
    clearCloseTimer();
    setOpenDesktopMenu(menuKey);
  };

  const scheduleDesktopMenuClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenDesktopMenu(null);
      closeTimerRef.current = null;
    }, DESKTOP_MENU_CLOSE_DELAY);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, []);

  useEffect(() => {
    if (openDesktopMenu === null) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (desktopNavRef.current && !desktopNavRef.current.contains(event.target as Node)) {
        clearCloseTimer();
        setOpenDesktopMenu(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [openDesktopMenu]);

  const consultButtonLabel = consultCta.kind === "consult" ? "상담 연결" : consultCta.label;

  const headerClass = pathname === "/" 
    ? "hidden md:block sticky top-0 z-30 border-b border-black/6 bg-white/95 backdrop-blur-md"
    : "sticky top-0 z-30 border-b border-black/6 bg-white/95 backdrop-blur-md";

  return (
    <header className={headerClass}>
      <div className="shell">
        <div className="flex min-h-[64px] items-center justify-between gap-4 lg:min-h-[76px] lg:gap-6">
          <Link href="/" className="flex min-w-0 shrink-0 flex-col">
            <span className="text-lg font-bold tracking-[-0.03em] text-navy">{SITE_NAME}</span>
            <span className="hidden text-xs text-text-secondary sm:block">교육 입시 큐레이션</span>
          </Link>

          <nav ref={desktopNavRef} className="hidden items-center gap-1 lg:flex xl:gap-2">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-text-secondary transition hover:text-navy"
            >
              홈
            </Link>
            <Link
              href="/magazine"
              className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-text-secondary transition hover:text-navy"
            >
              전체 콘텐츠
            </Link>
            <DesktopMenu
              label="학년별"
              menuKey="grades"
              isOpen={openDesktopMenu === "grades"}
              onOpen={openDesktopMenuByKey}
              onClose={closeDesktopMenu}
              onScheduleClose={scheduleDesktopMenuClose}
            >
              <div className="grid gap-1">
                {PRIMARY_GRADES.map((grade) => (
                  <GradeMenuItem
                    key={grade}
                    grade={grade}
                    onSelect={closeDesktopMenu}
                    currentPath={pathname || "/"}
                  />
                ))}
              </div>
            </DesktopMenu>
            <DesktopMenu
              label="주제별"
              menuKey="topics"
              isOpen={openDesktopMenu === "topics"}
              onOpen={openDesktopMenuByKey}
              onClose={closeDesktopMenu}
              onScheduleClose={scheduleDesktopMenuClose}
            >
              <div className="grid min-w-[260px] gap-1 sm:grid-cols-2">
                {TOPICS.map((topic) => (
                  <TopicMenuItem key={topic} topic={topic} onSelect={closeDesktopMenu} />
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
              {consultButtonLabel}
            </TrackedExternalLink>
          </div>

          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => {
              closeDesktopMenu();
              setIsMobileMenuOpen((current) => !current);
            }}
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
                  href="/magazine"
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
                  <span>{consultButtonLabel}</span>
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
                        pagePath: pathname || "/",
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
