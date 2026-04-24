"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const items = [
  { key: "home", href: "/", label: "홈", icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ) },
  { key: "guide", href: "/guide", label: "가이드", icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
  ) },
  { key: "magazine", href: "/magazine", label: "매거진", icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
  ) },
  { key: "glossary", href: "/glossary", label: "용어사전", icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
  ) },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  const activeKey =
    pathname.startsWith("/guide") ? "guide"
      : pathname.startsWith("/magazine") || pathname.startsWith("/contents") ? "magazine"
      : pathname.startsWith("/glossary") ? "glossary"
      : "home";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/8 bg-[rgba(250,248,245,0.94)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-4 gap-1 px-3 py-2">
        {items.map((item) => {
          const isActive = item.key === activeKey;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition ${
                isActive
                  ? "bg-white text-navy shadow-[0_12px_28px_-22px_rgba(27,42,74,0.32)]"
                  : "text-text-secondary"
              }`}
            >
              <div className={`transition-colors duration-200 ${isActive ? "text-gold" : "text-text-muted"}`}>
                {item.icon}
              </div>
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
