"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { SITE_COPY, SITE_NAME } from "@/constants/site";
import { GRADES, TOPICS } from "@/constants/taxonomy";
import type { Cta } from "@/types/content";

interface SiteFooterProps {
  consultCta: Cta;
}

interface FooterLinkItem {
  label: string;
  href: string;
}

const FOOTER_LINK_GROUPS: Array<{
  title: string;
  items: FooterLinkItem[];
}> = [
  {
    title: "학년별",
    items: GRADES.map((grade) => ({
      label: grade,
      href: `/grades/${encodeURIComponent(grade)}`,
    })),
  },
  {
    title: "주제별",
    items: TOPICS.map((topic) => ({
      label: topic,
      href: `/search?topic=${encodeURIComponent(topic)}`,
    })),
  },
  {
    title: "KNS 안내",
    items: [
      { label: "홈", href: "/" },
      { label: "전체 콘텐츠", href: "/contents" },
      { label: "콘텐츠 검색", href: "/search" },
    ],
  },
];

export function SiteFooter({ consultCta }: SiteFooterProps) {
  const [isFooterExpanded, setIsFooterExpanded] = useState(false);
  const pathname = usePathname();
  const consultButtonLabel = consultCta.kind === "consult" ? "상담 연결" : consultCta.label;

  return (
    <footer className="bg-navy pb-12 pt-12 text-white md:pb-14 md:pt-14">
      <div className="shell">
        <div className="flex flex-col gap-5 border-b border-white/12 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-2xl font-bold tracking-[-0.03em]">{SITE_NAME}</p>
            <p className="text-keep max-w-[32rem] text-sm leading-7 text-white/72">{SITE_COPY.footerDescription}</p>
          </div>

          <button
            type="button"
            aria-expanded={isFooterExpanded}
            aria-controls="site-footer-content"
            onClick={() => setIsFooterExpanded((current) => !current)}
            className="inline-flex min-h-11 items-center justify-between gap-2.5 rounded-full border border-white/14 bg-white/6 px-4 text-[13px] font-semibold text-white transition hover:bg-white/10"
          >
            <span>{isFooterExpanded ? "접기" : "전체 보기"}</span>
            <span className={`transition ${isFooterExpanded ? "rotate-180" : ""}`}>▾</span>
          </button>
        </div>

        {isFooterExpanded ? (
          <div id="site-footer-content" className="mt-8 space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr_1.15fr]">
              {FOOTER_LINK_GROUPS.map((group) => (
                <div key={group.title} className="rounded-[24px] border border-white/12 bg-white/6 px-5 py-5">
                  <p className="text-sm font-semibold text-white/82">{group.title}</p>
                  <div className="mt-4 space-y-3 text-sm text-white/88">
                    {group.items.map((item) => (
                      <Link key={item.href} href={item.href} className="block text-keep transition hover:text-white">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="rounded-[24px] border border-white/12 bg-white/6 px-5 py-5">
                <p className="text-sm font-semibold text-white/82">상담 안내</p>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  우리 아이에게 맞는 학습 방향이 궁금하다면 상담으로 차분하게 이어가 보세요.
                </p>
                <TrackedExternalLink
                  href={consultCta.url}
                  event={{
                    eventType: "cta_click",
                    ctaId: consultCta.id,
                    ctaLabel: consultCta.label,
                    pagePath: pathname || "/",
                    placement: "site_footer",
                  }}
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-navy transition hover:bg-ivory"
                >
                  {consultButtonLabel}
                </TrackedExternalLink>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/12 bg-white/6 px-5 py-5 text-sm leading-6 text-white/72">
              <p className="font-semibold text-white/82">사업자 정보</p>
              <p className="mt-3">서비스명: {SITE_NAME}</p>
              <p className="mt-1">운영 형태: 학부모 대상 교육 큐레이션 매거진</p>
              <p className="mt-1">상세 사업자 정보는 현재 상담 채널을 통해 안내드리고 있습니다.</p>
            </div>
          </div>
        ) : null}

        <div className="mt-6 text-sm leading-6 text-white/60">© 2026 KNS</div>
      </div>
    </footer>
  );
}
