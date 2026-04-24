import { EventLogger } from "@/components/analytics/EventLogger";

const SAMPLE_TERMS = [
  { term: "학생부 종합 전형 (학종)", desc: "교과 성적뿐만 아니라 비교과 영역(동아리, 봉사, 진로 등)을 종합적으로 정성 평가하여 학생을 선발하는 수시 전형입니다. 특목고/자사고 학생들이 주력으로 대비하는 전형이기도 합니다." },
  { term: "수시 전형", desc: "수능 시험 전에 대학에 지원하여 합격자를 선발하는 제도로, 보통 학생부 교과, 학생부 종합, 논술 전형 등으로 세분화됩니다." },
  { term: "정시 전형", desc: "수학능력시험(수능) 성적 위주로 대학 신입생을 선발하는 입시 전형입니다." },
  { term: "자유학기제 / 자유학년제", desc: "중학교 과정 중 한 학기 또는 두 학기 동안 지필평가를 보지 않고 진로 탐색과 체험 중심의 교육과정을 운영하는 제도입니다." },
  { term: "표준점수", desc: "개인의 원점수가 평균 성적으로부터 얼마나 떨어져 있는지를 보여주는 점수로, 수능 정시에서 매우 중요한 기준이 됩니다." },
  { term: "절대평가 / 상대평가", desc: "절대평가는 정해진 점수 기준(예: 90점 이상 A)을 넘으면 등급을 부여하는 방식(현 수능 영어)이고, 상대평가는 전체 학생 중 석차 비율에 따라 등급을 부여하는 방식입니다." },
  { term: "세특 (세부능력 및 특기사항)", desc: "학생부 교과 학습 발달 상황 항목에 과목별 담당 교사가 학생의 수업 참여도, 성취도, 특기사항 등을 기록하는 정성적 평가 구간입니다. 학종에서 제일 중요합니다." }
];

export default function GlossaryPage() {
  return (
    <>
      <EventLogger eventType="page_view" pagePath="/glossary" />
      
      <div className="bg-ivory min-h-screen pb-24">
        {/* Simple Top Nav */}
        <div className="sticky top-0 z-10 bg-[rgba(250,248,245,0.94)] backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-black/5">
          <div className="text-2xl font-extrabold tracking-[-0.03em]">
            용어 <span className="text-gold">사전</span>
          </div>
        </div>

        <div className="shell pt-4 pb-10">
          <div className="text-[13px] text-text-secondary leading-[1.6] mb-6 word-break-keep">
            입시 기사나 가이드를 읽다가 막히는 단어가 있다면 찾아보세요.<br/>
            어려운 입시 용어를 학부모 눈높이에서 쉽게 풀이했습니다.
          </div>

          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="용어 검색 (예: 학종, 표준점수)" 
              className="w-full bg-white border border-black/10 rounded-2xl py-3.5 px-4 pl-11 text-sm shadow-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition"
            />
            <svg className="absolute left-4 top-3.5 text-text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {['전체', '초/중등', '고등/대입', '주요 키워드'].map((cat, i) => (
              <button key={i} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition ${i === 0 ? "bg-navy text-white border-navy" : "bg-white text-navy border-black/10 hover:border-black/20"}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-3">
            {SAMPLE_TERMS.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 lg:p-5 border border-black/5 shadow-sm">
                <h3 className="text-[15px] font-extrabold text-navy mb-2 tracking-tight">
                  <span className="text-gold mr-1.5 opacity-70">#</span>{item.term}
                </h3>
                <p className="text-[13px] text-text-secondary leading-[1.65] word-break-keep">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
