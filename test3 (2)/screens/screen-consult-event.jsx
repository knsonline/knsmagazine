// KNS Magazine — Screen 10: 상담 신청 폼 / Screen 11: 설명회 상세

function ScreenConsult() {
  const T = window.KNS_TOKENS;
  return (
    <div style={{ width: '100%', height: '100%', background: T.ivory, position: 'relative', overflow: 'hidden', fontFamily: T.font, color: T.ink }}>
      <PhoneStatusBar />
      <div style={{ padding: '6px 16px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </div>
        <div style={{ flex: 1 }}/>
      </div>

      <div style={{ overflow: 'auto', height: 'calc(100% - 44px - 46px - 78px)', paddingBottom: 24 }}>
        <div style={{ padding: '4px 20px 20px' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: T.gold, letterSpacing: '0.08em', marginBottom: 8 }}>FREE CONSULTATION</div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.25, marginBottom: 10, wordBreak: 'keep-all' }}>
            우리 아이에게 맞는 학습,<br/>무료 상담으로 시작하세요
          </div>
          <div style={{ fontSize: 12, color: T.ink2, lineHeight: 1.7, wordBreak: 'keep-all' }}>
            KNS 전문가가 학년·현재 상황에 맞춰 다음에 무엇을 해야 할지 안내해 드립니다.
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '0 16px' }}>
          {/* Step */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ flex: 1, height: 3, borderRadius: 999, background: s === 1 ? T.navy : T.lineSoft }}/>
            ))}
          </div>

          <div style={{ fontSize: 11, fontWeight: 800, color: T.navy, letterSpacing: '0.04em', marginBottom: 14 }}>STEP 1 · 기본 정보</div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 7, color: T.ink }}>자녀 학년 <span style={{ color: '#dc2626' }}>*</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {['초등', '중등', '예비고1', '고등'].map(g => {
                const c = T.grade[g];
                const active = g === '중등';
                return (
                  <div key={g} style={{
                    padding: '12px 14px', borderRadius: 12,
                    background: active ? c.bg : '#fff',
                    border: `1.5px solid ${active ? c.accent : T.line}`,
                    fontSize: 13, fontWeight: 800,
                    color: active ? c.ink : T.ink,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    letterSpacing: '-0.02em',
                  }}>
                    <span>{g}</span>
                    {active ? (
                      <div style={{ width: 18, height: 18, borderRadius: 999, background: c.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 7 }}>학부모 성함 <span style={{ color: '#dc2626' }}>*</span></div>
            <div style={{
              background: '#fff', borderRadius: 10, padding: '13px 14px',
              border: `1px solid ${T.line}`, fontSize: 13, color: T.ink,
            }}>김○○</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 7 }}>연락처 <span style={{ color: '#dc2626' }}>*</span></div>
            <div style={{
              background: '#fff', borderRadius: 10, padding: '13px 14px',
              border: `1px solid ${T.navy}`, fontSize: 13, color: T.ink,
              display: 'flex', alignItems: 'center',
            }}>
              010-
              <div style={{ width: 1, height: 14, background: T.navy, marginLeft: 2, animation: 'blink 1s step-end infinite' }}/>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 7 }}>관심 주제 (복수 선택)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                { t: '특목고 입시', a: true },
                { t: '내신 대비', a: true },
                { t: '수능 영어' },
                { t: '초등 영어' },
                { t: '유학·국제' },
              ].map((c, i) => (
                <div key={i} style={{
                  padding: '8px 13px', borderRadius: 999,
                  background: c.a ? T.navy : '#fff',
                  color: c.a ? '#fff' : T.ink,
                  fontSize: 12, fontWeight: 700,
                  border: `1px solid ${c.a ? T.navy : T.line}`,
                }}>{c.a ? '✓ ' : ''}{c.t}</div>
              ))}
            </div>
          </div>

          {/* Consent */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '12px 14px', border: `1px solid ${T.lineSoft}`, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div style={{ fontSize: 11, color: T.ink2, lineHeight: 1.5, flex: 1 }}>개인정보 수집·이용에 동의합니다 <span style={{ textDecoration: 'underline', color: T.ink }}>보기</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        position: 'absolute', bottom: 78, left: 0, right: 0,
        padding: '12px 16px 14px', background: 'rgba(250,248,245,0.95)',
        backdropFilter: 'blur(12px)', borderTop: `1px solid ${T.lineSoft}`,
      }}>
        <div style={{
          background: T.navy, color: '#fff', padding: '14px 0',
          borderRadius: 12, textAlign: 'center',
          fontSize: 14, fontWeight: 800, letterSpacing: '-0.02em',
        }}>다음 단계 →</div>
      </div>

      <TabBar active="my" />
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

function ScreenEventDetail() {
  const T = window.KNS_TOKENS;
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', position: 'relative', overflow: 'hidden', fontFamily: T.font, color: T.ink }}>
      <PhoneStatusBar dark={true}/>
      <div style={{
        padding: '6px 16px 10px', display: 'flex', alignItems: 'center', gap: 8,
        position: 'absolute', top: 44, left: 0, right: 0, zIndex: 20,
      }}>
        <div style={{ width: 36, height: 36, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ width: 36, height: 36, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>
        </div>
      </div>

      <div style={{ overflow: 'auto', height: 'calc(100% - 44px - 78px - 76px)', paddingBottom: 20 }}>
        {/* Hero */}
        <div style={{
          height: 280, background: 'linear-gradient(180deg, #162744 0%, #1B2A4A 50%, #2A3F6A 100%)',
          position: 'relative', padding: '80px 24px 24px', color: '#fff',
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: T.gold, letterSpacing: '0.1em', marginBottom: 10 }}>KNS 설명회 · LIVE</div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.25, marginBottom: 12, wordBreak: 'keep-all' }}>
            2026 특목고 입시 전략<br/>학부모 설명회
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 11, padding: '5px 10px', background: 'rgba(255,255,255,0.12)', borderRadius: 999, fontWeight: 700 }}>중등 학부모</div>
            <div style={{ fontSize: 11, padding: '5px 10px', background: 'rgba(255,255,255,0.12)', borderRadius: 999, fontWeight: 700 }}>예비 중1·중2·중3</div>
          </div>
        </div>

        {/* Info card */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{
            background: T.ivoryWarm, borderRadius: 14, padding: '16px 16px',
            border: `1px solid ${T.line}`,
          }}>
            {[
              { ic: '📅', l: '일시', v: '2026년 5월 18일 (토) 오전 10:00' },
              { ic: '📍', l: '장소', v: 'KNS 대치 본원 3F 설명회실' },
              { ic: '👥', l: '정원', v: '50석 · 현재 32명 신청' },
              { ic: '🎤', l: '강연자', v: 'KNS 입시연구소 박○○ 소장' },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '10px 0',
                borderBottom: i < 3 ? `1px solid ${T.line}` : 'none',
              }}>
                <div style={{ fontSize: 14, width: 20 }}>{r.ic}</div>
                <div style={{ width: 42, fontSize: 11, color: T.ink2, fontWeight: 700, paddingTop: 1 }}>{r.l}</div>
                <div style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: T.ink, letterSpacing: '-0.01em' }}>{r.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '22px 20px 0' }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 10 }}>이 설명회에서는</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              '2026학년도 특목고 전형의 핵심 변화',
              '영재고·과학고·외고 학습 로드맵 비교',
              '최근 3년 합격생 사례 분석',
              '현장 Q&A · 개별 상담 연결',
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 999, background: T.gold,
                  color: T.navy, fontSize: 10, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 1,
                }}>{i + 1}</div>
                <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.55, wordBreak: 'keep-all', fontWeight: 500 }}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'absolute', bottom: 78, left: 0, right: 0,
        padding: '12px 16px 14px', background: '#fff',
        borderTop: `1px solid ${T.lineSoft}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: T.ivoryWarm, display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.5-1.4 3-3.3 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.2 1.5 4.1 3 5.5l7 7 7-7z"/></svg>
        </div>
        <div style={{
          flex: 1, padding: '14px 0', background: T.gold,
          borderRadius: 12, textAlign: 'center',
          fontSize: 14, fontWeight: 800, color: T.navy, letterSpacing: '-0.02em',
        }}>무료 신청 · 남은 자리 18석</div>
      </div>

      <TabBar active="home" />
    </div>
  );
}

Object.assign(window, { ScreenConsult, ScreenEventDetail });
