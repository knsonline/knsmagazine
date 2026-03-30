import Link from "next/link";
import { SITE_COPY, SITE_NAME } from "@/constants/site";
import { PRIMARY_GRADES, TOPICS } from "@/constants/taxonomy";

export function SiteFooter() {
  return (
    <footer className="bg-navy pb-24 pt-14 text-white md:pb-14">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="space-y-3">
            <p className="text-2xl font-bold tracking-[-0.03em]">{SITE_NAME}</p>
            <p className="max-w-sm text-sm leading-7 text-white/72">{SITE_COPY.footerDescription}</p>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold text-white/70">학년별</p>
            <div className="space-y-3 text-sm text-white/88">
              {PRIMARY_GRADES.map((grade) => (
                <Link key={grade} href={`/grades/${grade}`} className="block hover:text-white">
                  {grade}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold text-white/70">주제별</p>
            <div className="space-y-3 text-sm text-white/88">
              {TOPICS.map((topic) => (
                <Link
                  key={topic}
                  href={`/search?topic=${encodeURIComponent(topic)}`}
                  className="block hover:text-white"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold text-white/70">KNS 안내</p>
            <div className="space-y-3 text-sm text-white/88">
              <Link href="/" className="block hover:text-white">
                홈
              </Link>
              <Link href="/contents" className="block hover:text-white">
                전체 콘텐츠
              </Link>
              <Link href="/search" className="block hover:text-white">
                콘텐츠 검색
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/12 pt-6 text-sm text-white/60">© 2026 KNS</div>
      </div>
    </footer>
  );
}
