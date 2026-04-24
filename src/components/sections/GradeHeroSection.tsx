"use client";

import { Grade } from "@/types/content";
import { PRIMARY_GRADES } from "@/constants/taxonomy";
import Link from "next/link";

interface GradeHeroSectionProps {
  grade: Grade;
}

export function GradeHeroSection({ grade }: GradeHeroSectionProps) {
  const configMap: Record<string, any> = {
    초등: { 
      bg: "bg-blue-50/50", border: "border-blue-100", accent: "text-blue-600",
      en: "Elementary", label: "초등",
      title: "영어의 기본기를 다지는 첫걸음",
      desc: "흥미를 잃지 않고 꾸준히 공부하는 습관을 만들어주는 시기입니다."
    },
    중등: { 
      bg: "bg-emerald-50/50", border: "border-emerald-100", accent: "text-emerald-600",
      en: "Middle", label: "중등",
      title: "내신과 방향 설정, 둘 다 놓치면 안 되는 시기",
      desc: "내신 성적 관리와 함께 특목고·자사고 선택, 고교 방향을 함께 준비해야 하는 학년이에요."
    },
    예비고1: { 
      bg: "bg-amber-50/50", border: "border-amber-100", accent: "text-amber-600",
      en: "Pre-High", label: "예비고1",
      title: "고등학교 3년을 결정하는 골든타임",
      desc: "입시의 본격적인 시작, 겨울방학 동안 고등 내신과 수능의 기초를 단단히 해야 합니다."
    },
    고등: { 
      bg: "bg-rose-50/50", border: "border-rose-100", accent: "text-rose-600",
      en: "High", label: "고등",
      title: "수능과 내신, 완벽한 실전 전략",
      desc: "원하는 대학을 위한 전략적 접근과 흔들리지 않는 실력을 보여줘야 할 때입니다."
    }
  };

  const config = configMap[grade] || {
    bg: "bg-gray-50", border: "border-gray-200", accent: "text-gray-600",
    en: "Grade", label: grade, title: `${grade} 학습 준비`, desc: "시기별 맞춤 전략을 세워보세요."
  };

  return (
    <div className="bg-white">
      {/* Grade Tabs */}
      <div className="shell pt-2 pb-4">
        <div className="flex gap-2 p-1 bg-ivory-warm rounded-2xl w-full">
          {PRIMARY_GRADES.map(g => {
            const isActive = g === grade;
            return (
              <Link
                key={g}
                href={`/grades/${encodeURIComponent(g)}`}
                className={`flex-1 text-center py-2.5 rounded-xl text-sm transition-all ${
                  isActive ? "bg-white text-navy font-bold shadow-sm" : "text-text-secondary font-semibold"
                }`}
              >
                {g}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Hero Card */}
      <div className="shell pb-6">
        <div className={`rounded-[24px] p-5 lg:p-8 border ${config.bg} ${config.border}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[11px] font-extrabold tracking-widest uppercase ${config.accent}`}>
              {config.en} · {config.label}
            </span>
          </div>
          <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-navy mb-2 leading-snug word-break-keep">
            {config.title}
          </h2>
          <p className="text-sm font-medium text-text-secondary leading-relaxed mb-5">
            {config.desc}
          </p>

          <Link href="/guide" className="block bg-white rounded-2xl p-4 border border-black/5 shadow-sm transition hover:shadow-md">
            <div className={`text-xs font-bold mb-2 ${config.accent}`}>학년별 로드맵 보기 →</div>
            <div className="flex gap-2">
              {[1, 2, 3].map((year) => (
                <div key={year} className="flex-1 text-center">
                  <div className="text-xs font-extrabold text-navy bg-ivory py-1.5 rounded-lg mb-1">{grade} {year}</div>
                  <div className="text-[10px] text-text-secondary font-semibold">목표달성</div>
                </div>
              ))}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
