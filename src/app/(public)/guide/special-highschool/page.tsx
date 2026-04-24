import Link from "next/link";
import { EventLogger } from "@/components/analytics/EventLogger";

export default function GuideSpecialHighschoolPage() {
  return (
    <>
      <EventLogger eventType="page_view" pagePath="/guide/special-highschool" />
      
      <div className="bg-ivory min-h-screen pb-24">
        {/* Sticky top Nav */}
        <div className="sticky top-0 z-20 bg-[rgba(250,248,245,0.94)] backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-black/5">
          <Link href="/guide" className="w-9 h-9 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </Link>
          <div className="flex-1 text-[13px] font-bold text-center">특목고 입시 가이드</div>
          <div className="w-9 h-9 flex items-center justify-center text-text-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
          </div>
        </div>

        {/* Cover */}
        <div className="bg-[linear-gradient(135deg,#FFF4D6_0%,#FFFAEE_100%)] p-6 lg:p-10 border-b border-gold/10">
          <div className="shell px-0">
            <div className="text-[10px] font-extrabold text-[#E5A500] tracking-widest mb-2">PART 01 · 특목고 입시 개요</div>
            <h1 className="text-2xl font-extrabold tracking-tight leading-snug mb-3 word-break-keep text-navy">
              영재고·과학고·외고,<br/>어떻게 다른가요?
            </h1>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              5종류 특목고의 전형·일정·선발 방식을 한눈에 비교해 드려요.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-text-muted font-semibold">
              <span>⏱ 8분 읽기</span>
              <span>·</span>
              <span>2026.04.24 기준</span>
            </div>
          </div>
        </div>

        <div className="shell pt-5 pb-10">
          {/* TOC */}
          <div className="bg-white rounded-2xl p-4 lg:p-5 border border-black/5 mb-6 shadow-sm">
            <div className="text-[11px] font-extrabold text-text-secondary tracking-widest mb-3">목차</div>
            {[
              { t: '1. 특목고의 5가지 유형', active: true },
              { t: '2. 전형별 선발 방식 비교', active: false },
              { t: '3. 언제부터 준비해야 할까', active: false },
            ].map((t, i) => (
              <div key={i} className={`text-xs py-2.5 flex justify-between items-center ${i !== 2 ? "border-b border-black/5" : ""} ${t.active ? "font-bold text-navy" : "font-medium text-text-secondary"}`}>
                <span>{t.t}</span>
                {t.active && <span className="text-[#E5A500] text-[10px] font-bold">● 읽는 중</span>}
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="mb-6">
            <h2 className="text-[17px] font-extrabold tracking-tight mb-3 text-navy">
              1. 특목고의 5가지 유형
            </h2>
            <p className="text-[13px] text-text-secondary leading-[1.8] mb-5 word-break-keep">
              특목고는 크게 영재학교, 과학고, 외국어고, 국제고, 자율형사립고(자사고)로 나뉩니다. 각 유형마다 선발 시기와 방식, 중점 과목이 다릅니다.
            </p>

            {/* Comparison table */}
            <div className="bg-white rounded-[14px] overflow-hidden border border-black/5 mb-6 shadow-sm">
              <div className="grid grid-cols-[80px_1fr_1fr] bg-[#FFF4D6] p-3 text-[11px] font-extrabold text-[#6B4B00]">
                <div>유형</div><div>선발 시기</div><div>중점</div>
              </div>
              {[
                { t: '영재학교', when: '중3 3~5월', focus: '수학·과학 심화' },
                { t: '과학고',   when: '중3 8~11월', focus: '수학·과학' },
                { t: '외국어고', when: '중3 10~12월', focus: '영어·제2외국어' },
                { t: '자사고',   when: '중3 10~12월', focus: '전 과목 균형' },
              ].map((r, i) => (
                <div key={i} className="grid grid-cols-[80px_1fr_1fr] p-3 text-[11.5px] border-t border-black/5 items-center">
                  <div className="font-extrabold text-navy">{r.t}</div>
                  <div className="text-text-secondary">{r.when}</div>
                  <div className="text-text-secondary">{r.focus}</div>
                </div>
              ))}
            </div>

            {/* Callout */}
            <div className="bg-[#FFF4D6] border-l-[3px] border-[#E5A500] p-4 rounded-lg mb-6">
              <div className="text-[10px] font-extrabold text-[#E5A500] tracking-widest mb-1.5">KNS 입시연구소 TIP</div>
              <div className="text-xs text-[#6B4B00] leading-relaxed word-break-keep">
                영재학교는 중3 상반기에 선발이 끝나기 때문에, 준비 시작 시점이 다른 학교보다 1년 이상 빠릅니다.
              </div>
            </div>
          </div>
          
          {/* Magazine Bridge (Manual placeholder for now) */}
          <div className="mt-8">
            <h3 className="text-[11px] font-bold text-gold tracking-widest mb-2">RELATED MAGAZINE</h3>
            <div className="space-y-2.5">
              {[
                { t: '외고 준비, 중1이면 늦을까요?', tag: '특목고', grade: '중등' },
                { t: '자사고 면접 — 기출 질문 유형 정리', tag: '특목고', grade: '중등' },
              ].map((m, idx) => (
                <Link key={idx} href="/magazine" className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-black/5 shadow-sm">
                  <div className="w-14 h-14 bg-ivory-warm rounded-lg flex items-center justify-center text-lg">🎥</div>
                  <div className="flex-1">
                    <div className="flex gap-1.5 mb-1.5">
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">{m.grade}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold">{m.tag}</span>
                    </div>
                    <div className="text-xs font-bold text-navy truncate">{m.t}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
