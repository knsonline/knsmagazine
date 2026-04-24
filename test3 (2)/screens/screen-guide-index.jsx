// KNS Magazine — Screen 3: 입시가이드 인덱스 (Guide landing)

function ScreenGuideIndex() {
  const T = window.KNS_TOKENS;

  return (
    <div style={{
      width: '100%', height: '100%', background: T.ivory,
      position: 'relative', overflow: 'hidden',
      fontFamily: T.font, color: T.ink,
    }}>
      <PhoneStatusBar />
      <div style={{
        padding: '6px 16px 10px', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ flex: 1, fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>
          입시 <span style={{ color: T.gold }}>가이드</span>
        </div>
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </div>

      <div style={{ overflow: 'auto', height: 'calc(100% - 44px - 54px - 78px)', paddingBottom: 20 }}>
        <div style={{ padding: '0 16px 6px', fontSize: 13, color: T.ink2, lineHeight: 1.6, marginBottom: 20 }}>
          처음 입시 정보를 찾아보시는 학부모님을 위해<br/>KNS가 차근차근 정리한 기본 가이드입니다.
        </div>

        {/* 4 big pillars */}
        <div style={{ padding: '0 16px', marginBottom: 26 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { t: '특목고 입시', s: '영재고·과학고·외고·국제고·자사고', c: '#FFF4D6', a: '#E5A500', ic: '🎯', cnt: '5개 가이드' },
              { t: '대학 입시',   s: '수시·정시·학종 전형 구조',          c: '#DCE6FA', a: '#3758C5', ic: '🎓', cnt: '8개 가이드' },
              { t: '학년별 로드맵', s: '초1~고3 해야 할 것',                c: '#D8F1E4', a: '#1F9E6A', ic: '🗺️', cnt: '12학년' },
              { t: '용어 사전',   s: '입시 용어 쉽게 풀이',                c: '#FFE1D6', a: '#D75F3C', ic: '📖', cnt: '86개 용어' },
            ].map((p, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 16, padding: '16px 14px',
                border: `1px solid ${T.lineSoft}`,
                position: 'relative', overflow: 'hidden', minHeight: 150,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: p.c, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, marginBottom: 10,
                  }}>{p.ic}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>{p.t}</div>
                  <div style={{ fontSize: 11, color: T.ink2, lineHeight: 1.5 }}>{p.s}</div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: p.a, marginTop: 10 }}>{p.cnt} →</div>
              </div>
            ))}
          </div>
        </div>

        {/* 추천 가이드 */}
        <div style={{ padding: '0 16px', marginBottom: 24 }}>
          <SectionHead eyebrow="POPULAR" title="많이 보는 가이드" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { n: '01', t: '영재고 vs 과학고 — 어떻게 다른가요?', read: '5분', tag: '특목고' },
              { n: '02', t: '수시 학종, 고1부터 무엇을 준비하나', read: '7분', tag: '대학입시' },
              { n: '03', t: '초등학생 영어, 어디서부터 시작할까', read: '4분', tag: '로드맵' },
              { n: '04', t: '자사고 면접 — 기출 질문 유형 정리', read: '6분', tag: '특목고' },
            ].map((g, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 14px', background: '#fff', borderRadius: 12,
                border: `1px solid ${T.lineSoft}`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: T.gold, letterSpacing: '0.02em', width: 24 }}>{g.n}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4, wordBreak: 'keep-all', lineHeight: 1.4 }}>{g.t}</div>
                  <div style={{ fontSize: 10, color: T.ink3 }}>{g.tag} · {g.read} 읽기</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.ink3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '0 16px' }}>
          <div style={{
            background: T.navy, color: '#fff', borderRadius: 18,
            padding: '20px 20px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.gold, letterSpacing: '0.06em', marginBottom: 6 }}>
              CONSULT
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.4 }}>
              가이드만으론 부족하셨다면,<br/>KNS 전문가에게 물어보세요
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.72)', marginBottom: 14, lineHeight: 1.6 }}>
              학년과 현재 상황에 맞춘 맞춤 상담을 무료로 제공합니다.
            </div>
            <div style={{
              padding: '11px 14px', background: T.gold, color: T.navy,
              borderRadius: 10, fontSize: 13, fontWeight: 800, textAlign: 'center',
              letterSpacing: '-0.02em',
            }}>무료 학습 상담 신청 →</div>
          </div>
        </div>
      </div>

      <TabBar active="guide" />
    </div>
  );
}

Object.assign(window, { ScreenGuideIndex });
