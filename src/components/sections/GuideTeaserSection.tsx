"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export function GuideTeaserSection() {
  return (
    <section className="py-6 lg:py-10 bg-white">
      <div className="shell">
        <div className="rounded-[24px] bg-[linear-gradient(135deg,#f5f0eb_0%,#FBF4E8_100%)] border border-black/5 p-5 lg:p-8">
          <div className="text-[11px] font-bold text-gold tracking-[0.06em] mb-2 uppercase">
            KNS 입시가이드
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold tracking-[-0.03em] mb-2 leading-[1.3] text-navy word-break-keep">
            특목고부터 대학 입시까지,<br />
            학부모가 먼저 알아야 할 기본기
          </h2>
          <p className="text-sm text-text-secondary mb-5 leading-[1.6]">
            영재고·과학고·외고 준비부터 수시·정시 전형 구조까지 차근차근 정리했어요.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "특목고 개요", href: "/guide/special-highschool" },
              { label: "과목별 가이드", href: "/guide/subject" },
              { label: "용어 사전", href: "/glossary" }
            ].map((item, i) => (
              <Link 
                key={i} 
                href={item.href}
                className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-xs font-bold text-navy shadow-sm transition hover:bg-ivory-warm"
              >
                {item.label} <span className="ml-1 text-[10px] opacity-60">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
