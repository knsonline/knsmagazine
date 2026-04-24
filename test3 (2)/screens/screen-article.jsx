// KNS Magazine — Screen 5: 매거진 기사 상세 (Article detail with guide link-back)

function ScreenArticleDetail() {
  const T = window.KNS_TOKENS;
  const grade = '중등';
  const topic = '특목고';
  const c = T.grade[grade];

  return (
    <div style={{
      width: '100%', height: '100%', background: '#fff',
      position: 'relative', overflow: 'hidden',
      fontFamily: T.font, color: T.ink,
    }}>
      <PhoneStatusBar />
      {/* Sticky top */}
      <div style={{
        padding: '6px 16px 10px', display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(12px)',
        position: 'relative', zIndex: 10,
        borderBottom: `1px solid ${T.lineSoft}`,
      }}>
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>
        </div>
      </div>

      <div style={{ overflow: 'auto', height: 'calc(100% - 44px - 54px - 78px)', paddingBottom: 24 }}>
        {/* Cover image */}
        <div style={{ padding: '16px 20px 0' }}>
          <Thumb grade={grade} topic={topic} label="특목고 준비" aspect="5/3" radius={16}/>
        </div>

        {/* Meta */}
        <div style={{ padding: '18px 20px 14px' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            <GradeBadge grade={grade} size="lg"/>
            <TopicBadge topic={topic}/>
            <Badge bg="#F7EFD8" ink="#715924">커버 스토리</Badge>
          </div>
          <h1 style={{
            fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em',
            lineHeight: 1.3, margin: 0, marginBottom: 12, wordBreak: 'keep-all',
          }}>
            외고 준비, 중1이면 늦을까요?<br/>학년별 단계 로드맵
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: T.ink3 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 999, background: T.ivoryWarm,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 800, color: T.navy,
            }}>K</div>
            <span style={{ fontWeight: 700, color: T.ink2 }}>KNS 입시연구소</span>
            <span>·</span>
            <span>2026.04.22</span>
            <span>·</span>
            <span>6분 읽기</span>
          </div>
        </div>

        {/* ★ Key bridge — link to basic guide */}
        <div style={{ padding: '0 20px 22px' }}>
          <div style={{
            background: T.ivoryWarm, borderRadius: 12,
            padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
            border: `1px solid ${T.line}`,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, background: '#FFF4D6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>📖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: T.gold, letterSpacing: '0.04em' }}>먼저 읽어보면 좋아요</div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 1 }}>
                KNS 가이드 · 영재고·과학고·외고 차이점
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '0 20px' }}>
          <p style={{ fontSize: 14, color: T.ink, lineHeight: 1.85, marginTop: 0, marginBottom: 16, fontWeight: 500, wordBreak: 'keep-all' }}>
            "외고는 중3에 원서를 쓰니까 중2부터 준비하면 되겠죠?" 상담에서 가장 자주 받는 질문입니다. 결론부터 말씀드리면,<strong style={{ background: 'linear-gradient(180deg, transparent 60%, #FFF4D6 60%)', fontWeight: 800 }}>중1부터가 아니라, 초등 고학년부터가 더 정확</strong>합니다.
          </p>
          <p style={{ fontSize: 14, color: T.ink2, lineHeight: 1.85, marginBottom: 20, wordBreak: 'keep-all' }}>
            외고 전형의 핵심은 중학교 3년 영어 내신과 자기주도학습 능력인데요, 이 둘은 중1이 되어서 갑자기 만들어지지 않습니다.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 24, marginBottom: 10 }}>
            중1 · 내신 기반 다지기
          </h3>
          <p style={{ fontSize: 14, color: T.ink2, lineHeight: 1.85, marginBottom: 8, wordBreak: 'keep-all' }}>
            중1은 대부분의 학교가 자유학기제를 시행합니다. 하지만 외고 입시에서는 중2·중3 성취도가 주요 지표이기 때문에…
          </p>
        </div>

        {/* Progress indicator */}
        <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 4, background: T.ivoryWarm, borderRadius: 999 }}>
            <div style={{ width: '34%', height: '100%', background: c.accent, borderRadius: 999 }}/>
          </div>
          <div style={{ fontSize: 10, color: T.ink3, fontWeight: 600 }}>34%</div>
        </div>
      </div>

      <TabBar active="mag" grade={grade} />
    </div>
  );
}

Object.assign(window, { ScreenArticleDetail });
