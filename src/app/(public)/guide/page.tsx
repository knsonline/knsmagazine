import Link from "next/link";
import { EventLogger } from "@/components/analytics/EventLogger";
import { TopPromoBanner } from "@/components/layout/TopPromoBanner";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function GuideIndexPage() {
  return (
    <>
      <EventLogger eventType="page_view" pagePath="/guide" />
      
      <div className="bg-ivory min-h-screen pb-24">
        {/* Simple Top Nav mimicking prototype */}
        <div className="sticky top-0 z-10 bg-[rgba(250,248,245,0.94)] backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-black/5">
          <div className="text-2xl font-extrabold tracking-[-0.03em]">
            입시 <span className="text-gold">가이드</span>
          </div>
        </div>

        <div className="shell pt-4 pb-10">
          <div className="text-[13px] text-text-secondary leading-[1.6] mb-6">
            처음 입시 정보를 찾아보시는 학부모님을 위해<br/>
            KNS가 차근차근 정리한 기본 가이드입니다.
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { t: '특목고 입시', s: '영재고·과학고·외고·자사고', bg: 'bg-[#FFF4D6]', color: 'text-[#E5A500]', ic: '🎯', cnt: '가이드 5개', href: '/guide/special-highschool' },
              { t: '대학 입시', s: '수시·정시·학종 전형 구조', bg: 'bg-[#DCE6FA]', color: 'text-[#3758C5]', ic: '🎓', cnt: '가이드 8개', href: '#' },
              { t: '학년별 로드맵', s: '초1~고3 해야 할 것', bg: 'bg-[#D8F1E4]', color: 'text-[#1F9E6A]', ic: '🗺️', cnt: '전 학년', href: '#' },
              { t: '용어 사전', s: '입시 용어 쉽게 풀이', bg: 'bg-[#FFE1D6]', color: 'text-[#D75F3C]', ic: '📖', cnt: '용어 86개', href: '/glossary' },
            ].map((p, i) => (
              <Link key={i} href={p.href} className="bg-white rounded-2xl p-3 border border-black/5 flex flex-col justify-between min-h-[140px] shadow-sm transition hover:shadow-md">
                <div>
                  <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center text-xl mb-3`}>
                    {p.ic}
                  </div>
                  <div className="text-sm font-extrabold tracking-tight text-navy mb-1">{p.t}</div>
                  <div className="text-[11px] text-text-secondary leading-[1.4] word-break-keep">{p.s}</div>
                </div>
                <div className={`text-[10px] font-bold mt-3 ${p.color}`}>{p.cnt} →</div>
              </Link>
            ))}
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-extrabold text-navy mb-3">많이 보는 가이드</h3>
            <div className="flex flex-col gap-2">
              {[
                { n: '01', t: '영재고 vs 과학고 — 어떻게 다른가요?', read: '5분', tag: '특목고', href: '/guide/special-highschool' },
                { n: '02', t: '수시 학종, 고1부터 무엇을 준비하나', read: '7분', tag: '대학입시', href: '#' },
                { n: '03', t: '초등학생 영어, 어디서부터 시작할까', read: '4분', tag: '로드맵', href: '#' },
              ].map((g, i) => (
                <Link key={i} href={g.href} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-black/5 shadow-sm">
                  <div className="text-xs font-extrabold text-gold w-5">{g.n}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-navy mb-1 truncate">{g.t}</div>
                    <div className="text-[10px] text-text-muted">{g.tag} · {g.read} 읽기</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-navy text-white rounded-[18px] p-5 shadow-lg">
            <div className="text-[10px] font-bold text-gold tracking-widest mb-1">CONSULT</div>
            <div className="text-base font-extrabold tracking-tight mb-2 leading-snug">
              가이드만으론 부족하셨다면,<br/>KNS 전문가에게 물어보세요
            </div>
            <div className="text-[11px] text-white/70 mb-4 leading-relaxed">
              학년과 현재 상황에 맞춘 맞춤 상담을 무료로 제공합니다.
            </div>
            <Link href="/" className="block p-3 bg-gold text-navy rounded-xl text-xs font-extrabold text-center transition hover:bg-gold-light">
              무료 학습 상담 신청 →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
