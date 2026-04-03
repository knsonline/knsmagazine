"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE_COPY, SITE_NAME } from "@/constants/site";
import { PRIMARY_GRADES, TOPICS } from "@/constants/taxonomy";
import type { Cta } from "@/types/content";

interface SiteFooterProps {
  consultCta: Cta;
}

export function SiteFooter({ consultCta }: SiteFooterProps) {
  const [isBusinessInfoOpen, setIsBusinessInfoOpen] = useState(false);

  return (
    <footer className="bg-navy pb-12 pt-12 text-white md:pb-14 md:pt-14">
      <div className="shell">
        <div className="md:hidden">
          <div className="space-y-3">
            <p className="text-2xl font-bold tracking-[-0.03em]">{SITE_NAME}</p>
            <p className="text-keep max-w-[28rem] text-sm leading-7 text-white/72">{SITE_COPY.footerDescription}</p>
          </div>

          <div className="mt-6 grid gap-2">
            <Link
              href="/contents"
              className="flex min-h-12 items-center justify-between rounded-2xl bg-white/8 px-4 text-sm font-semibold text-white"
            >
              <span>전체 콘텐츠</span>
              <span className="text-white/60">→</span>
            </Link>
            <Link
              href="/search"
              className="flex min-h-12 items-center justify-between rounded-2xl bg-white/8 px-4 text-sm font-semibold text-white"
            >
              <span>검색</span>
              <span className="text-white/60">→</span>
            </Link>
            <a
              href={consultCta.url}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center justify-between rounded-2xl bg-white px-4 text-sm font-semibold text-navy"
            >
              <span>상담 신청</span>
              <span className="text-navy/60">→</span>
            </a>
          </div>

          <div className="mt-6 border-t border-white/12 pt-5">
            <button
              type="button"
              onClick={() => setIsBusinessInfoOpen((current) => !current)}
              aria-expanded={isBusinessInfoOpen}
              className="flex min-h-11 w-full items-center justify-between text-left text-sm font-semibold text-white/82"
            >
              <span>사업자 정보 보기</span>
              <span className={`transition ${isBusinessInfoOpen ? "rotate-180" : ""}`}>▾</span>
            </button>

            <div
              className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ${
                isBusinessInfoOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70"
              }`}
            >
              <div className="overflow-hidden rounded-2xl bg-white/6 px-4 py-4 text-sm leading-6 text-white/72">
                <p>서비스명: {SITE_NAME}</p>
                <p className="mt-1">운영 형태: 학부모 대상 교육 큐레이션 매거진</p>
                <p className="mt-1">상세 사업자 정보는 현재 상담 채널을 통해 안내드리고 있습니다.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
            <div className="space-y-3">
              <p className="text-2xl font-bold tracking-[-0.03em]">{SITE_NAME}</p>
              <p className="text-keep max-w-sm text-sm leading-7 text-white/72">{SITE_COPY.footerDescription}</p>
            </div>

            <div>
              <p className="mb-4 text-sm font-semibold text-white/70">학년별</p>
              <div className="space-y-3 text-sm text-white/88">
                {PRIMARY_GRADES.map((grade) => (
                  <Link key={grade} href={`/grades/${grade}`} className="block text-keep hover:text-white">
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
                    className="block text-keep hover:text-white"
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
                <a href={consultCta.url} target="_blank" rel="noreferrer" className="block hover:text-white">
                  상담 신청
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-6 border-t border-white/12 pt-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="text-sm leading-6 text-white/60">© 2026 KNS</div>
            <div className="rounded-2xl bg-white/6 px-5 py-4 text-sm leading-6 text-white/72">
              <p className="font-semibold text-white/82">사업자 정보</p>
              <p className="mt-2">서비스명: {SITE_NAME}</p>
              <p className="mt-1">운영 형태: 학부모 대상 교육 큐레이션 매거진</p>
              <p className="mt-1">상세 사업자 정보는 현재 상담 채널을 통해 안내드리고 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
