"use client";

import Link from "next/link";
import { Grade } from "@/types/content";

interface GradeGuideTeaserProps {
  grade: Grade;
}

export function GradeGuideTeaser({ grade }: GradeGuideTeaserProps) {
  const guides = [
    { icon: "🎯", title: "특목고 입시 한눈에", desc: "영재고·과학고·외고 준비 전략" },
    { icon: "📈", title: `${grade} 내신 완전 정복`, desc: "학년별 시험 대비 로드맵" },
    { icon: "📖", title: "입시 용어 사전", desc: "학종·수시·정시 한 번에 정리" },
  ];

  return (
    <div className="bg-white shell pb-6">
      <div className="flex justify-between items-end mb-3 px-1">
        <div>
          <div className="text-[10px] font-bold text-gold tracking-widest mb-1">GUIDE</div>
          <h3 className="text-lg font-extrabold tracking-tight text-navy">{grade} 기본 입시 가이드</h3>
        </div>
        <Link href="/guide" className="text-xs font-semibold text-text-secondary mb-1">
          전체보기 →
        </Link>
      </div>

      <div className="flex flex-col gap-2.5">
        {guides.map((item, i) => (
          <Link key={i} href="/guide" className="flex items-center gap-4 p-4 bg-white rounded-[20px] border border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition hover:border-black/10">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-[14px] bg-ivory text-2xl">
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-navy mb-0.5">{item.title}</div>
              <div className="text-xs font-medium text-text-secondary">{item.desc}</div>
            </div>
            <div className="text-text-muted">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
