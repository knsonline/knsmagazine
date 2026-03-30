"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "홈" },
  { href: "/contents", label: "콘텐츠" },
  { href: "/search", label: "검색" },
  { href: "/search?topic=%EB%82%B4%EC%8B%A0", label: "주제별" },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/8 bg-white/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold ${
                isActive ? "text-navy" : "text-text-secondary"
              }`}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
