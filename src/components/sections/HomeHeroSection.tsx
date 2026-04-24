"use client";

import Link from "next/link";
import { PRIMARY_GRADES } from "@/constants/taxonomy";

export function HomeHeroSection() {
  return (
    <section className="bg-[linear-gradient(180deg,#15233e_0%,#1b2a4a_50%,#2a3f6a_100%)] pb-8 pt-4 text-white lg:pb-12 lg:pt-8 w-full">
      <div className="shell space-y-4">
        {/* Mobile top bar inside hero */}
        <div className="flex md:hidden justify-between items-center mb-6">
          <div className="text-xl font-extrabold tracking-[-0.03em]">
            KNS <span className="text-gold">매거진</span>
          </div>
        </div>

        <div className="text-xs font-semibold text-gold tracking-wide uppercase mb-2">
          학부모가 먼저 찾는 영어 입시 매거진
        </div>
        <h1 className="text-2xl lg:text-[40px] font-extrabold leading-[1.25] tracking-[-0.03em] mb-6 word-break-keep">
          우리 아이 학년부터<br />
          골라보세요
        </h1>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4 lg:mt-10">
          {PRIMARY_GRADES.map((grade) => {
            const label =
              grade === "초등" ? "ELEMENTARY" :
              grade === "중등" ? "MIDDLE" :
              grade === "예비고1" ? "PRE-HIGH" : "HIGH";

            return (
              <Link
                key={grade}
                href={`/grades/${encodeURIComponent(grade)}`}
                className="group flex items-center justify-between rounded-[16px] bg-white/10 border border-white/15 p-4 transition-all hover:bg-white/20 active:scale-[0.98]"
              >
                <div>
                  <div className="text-[10px] lg:text-xs font-bold text-white/50 tracking-wider mb-1">
                    {label}
                  </div>
                  <div className="text-[16px] lg:text-lg font-extrabold text-white tracking-[-0.02em]">
                    {grade}
                  </div>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 group-hover:bg-gold transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
