// KNS Magazine — Screen 4: 특목고 가이드 상세 (Guide detail)

function ScreenGuideDetail() {
  const T = window.KNS_TOKENS;
  const accent = '#E5A500';
  const accentBg = '#FFF4D6';

  return (
    <div style={{
      width: '100%', height: '100%', background: T.ivory,
      position: 'relative', overflow: 'hidden',
      fontFamily: T.font, color: T.ink,
    }}>
      <PhoneStatusBar />
      {/* Sticky top */}
      <div style={{
        padding: '6px 16px 10px', display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(250,248,245,0.94)', backdropFilter: 'blur(12px)',
        position: 'relative', zIndex: 10,
        borderBottom: `1px solid ${T.lineSoft}`,
      }}>
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div style={{ flex: 1, fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em', textAlign: 'center' }}>특목고 입시 가이드</div>
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
        </div>
      </div>

      <div style={{ overflow: 'auto', height: 'calc(100% - 44px - 54px - 78px)', paddingBottom: 24 }}>
        {/* Cover */}
        <div style={{
          background: `linear-gradient(135deg, ${accentBg} 0%, #FFFAEE 100%)`,
          padding: '24px 20px 30px',
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: accent, letterSpacing: '0.08em', marginBottom: 8 }}>
            PART 01 · 특목고 입시 개요
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.3, marginBottom: 10, wordBreak: 'keep-all' }}>
            영재고·과학고·외고,<br/>어떻게 다른가요?
          </div>
          <div style={{ fontSize: 12, color: T.ink2, lineHeight: 1.7, marginBottom: 16 }}>
            5종류 특목고의 전형·일정·선발 방식을 한눈에 비교해 드려요.
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: T.ink2, fontWeight: 600 }}>
            <span>⏱ 8분 읽기</span>
            <span>·</span>
            <span>2026.04.18 기준</span>
          </div>
        </div>

        {/* TOC */}
        <div style={{ padding: '18px 16px 0' }}>
          <div style={{
            background: '#fff', borderRadius: 14, padding: '14px 16px',
            border: `1px solid ${T.lineSoft}`, marginBottom: 22,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: T.ink2, letterSpacing: '0.04em', marginBottom: 10 }}>목차</div>
            {[
              '1. 특목고의 5가지 유형',
              '2. 전형별 선발 방식 비교',
              '3. 언제부터 준비해야 할까',
              '4. 우리 아이에게 맞는 유형 찾기',
            ].map((t, i) => (
              <div key={i} style={{
                fontSize: 12, padding: '8px 0',
                borderBottom: i < 3 ? `1px solid ${T.lineSoft}` : 'none',
                color: i === 0 ? T.ink : T.ink2,
                fontWeight: i === 0 ? 700 : 500,
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span>{t}</span>
                {i === 0 ? <span style={{ color: accent, fontSize: 10, fontWeight: 700 }}>● 읽는 중</span> : null}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '0 20px' }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12, marginTop: 0 }}>
            1. 특목고의 5가지 유형
          </h2>
          <p style={{ fontSize: 13, color: T.ink2, lineHeight: 1.8, marginBottom: 18, wordBreak: 'keep-all' }}>
            특목고는 크게 영재학교, 과학고, 외국어고, 국제고, 자율형사립고(자사고)로 나뉩니다. 각 유형마다 선발 시기와 방식, 중점 과목이 다릅니다.
          </p>

          {/* Comparison table */}
          <div style={{
            background: '#fff', borderRadius: 14, overflow: 'hidden',
            border: `1px solid ${T.lineSoft}`, marginBottom: 20,
          }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '80px 1fr 1fr',
              background: accentBg, padding: '10px 12px',
              fontSize: 11, fontWeight: 800, color: '#6B4B00',
            }}>
              <div>유형</div><div>선발 시기</div><div>중점</div>
            </div>
            {[
              { t: '영재학교', when: '중3 3~5월', focus: '수학·과학 심화' },
              { t: '과학고',   when: '중3 8~11월', focus: '수학·과학' },
              { t: '외국어고', when: '중3 10~12월', focus: '영어·제2외국어' },
              { t: '국제고',   when: '중3 10~12월', focus: '국제 소양' },
              { t: '자사고',   when: '중3 10~12월', focus: '전 과목 균형' },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '80px 1fr 1fr',
                padding: '12px 12px', fontSize: 11.5,
                borderTop: `1px solid ${T.lineSoft}`,
                alignItems: 'center',
              }}>
                <div style={{ fontWeight: 800, color: T.ink }}>{r.t}</div>
                <div style={{ color: T.ink2 }}>{r.when}</div>
                <div style={{ color: T.ink2 }}>{r.focus}</div>
              </div>
            ))}
          </div>

          {/* Callout */}
          <div style={{
            background: accentBg, borderLeft: `3px solid ${accent}`,
            padding: '12px 14px', borderRadius: 8, marginBottom: 20,
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: accent, letterSpacing: '0.04em', marginBottom: 4 }}>KNS 입시연구소 TIP</div>
            <div style={{ fontSize: 12, color: '#6B4B00', lineHeight: 1.65, wordBreak: 'keep-all' }}>
              영재학교는 중3 상반기에 선발이 끝나기 때문에, 준비 시작 시점이 다른 학교보다 1년 이상 빠릅니다.
            </div>
          </div>

          {/* Related — magazine articles */}
          <div style={{ marginTop: 26 }}>
            <SectionHead eyebrow="RELATED MAGAZINE" title="이어서 읽을 기사" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { g: '중등', tp: '특목고', t: '외고 준비, 중1이면 늦을까요?' },
                { g: '중등', tp: '특목고', t: '자사고 면접 기출 질문 유형' },
              ].map((it, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: 10,
                  background: '#fff', borderRadius: 12,
                  border: `1px solid ${T.lineSoft}`,
                }}>
                  <div style={{ width: 56, flexShrink: 0 }}>
                    <Thumb grade={it.g} topic={it.tp} aspect="1/1" radius={8}/>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                      <GradeBadge grade={it.g}/>
                      <TopicBadge topic={it.tp}/>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '-0.02em', wordBreak: 'keep-all', lineHeight: 1.4 }}>{it.t}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TabBar active="guide" />
    </div>
  );
}

Object.assign(window, { ScreenGuideDetail });
