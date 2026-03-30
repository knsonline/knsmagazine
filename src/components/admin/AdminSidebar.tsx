import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

const navigationItems = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/contents", label: "콘텐츠 관리" },
  { href: "/admin/ctas", label: "CTA 관리" },
  { href: "/admin/banners", label: "배너 관리" },
  { href: "/admin/collections", label: "컬렉션 관리" },
] as const;

export function AdminSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 bg-navy px-6 py-8 text-white lg:block">
      <div className="flex h-full flex-col">
        <div>
          <p className="text-2xl font-bold tracking-[-0.03em]">KNS 매거진</p>
          <p className="mt-2 text-sm text-white/70">깔끔한 큐레이션 도구</p>
        </div>

        <nav className="mt-10 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center rounded-2xl px-4 text-sm font-semibold text-white/86 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={logoutAction} className="mt-auto">
          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-white/12 px-4 text-sm font-semibold text-white"
          >
            로그아웃
          </button>
        </form>
      </div>
    </aside>
  );
}
