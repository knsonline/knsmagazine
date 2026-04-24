// KNS Magazine — Screen 8: 검색 / Screen 9: 마이

function ScreenSearch() {
  const T = window.KNS_TOKENS;
  return (
    <div style={{ width: '100%', height: '100%', background: T.ivory, position: 'relative', overflow: 'hidden', fontFamily: T.font, color: T.ink }}>
      <PhoneStatusBar />
      <div style={{ padding: '6px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', borderRadius: 12, padding: '10px 14px',
          border: `1px solid ${T.lineSoft}`,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.ink2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>외고</div>
          <div style={{ width: 2, height: 14, background: T.ink, animation: 'blink 1s step-end infinite' }}/>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.ink2 }}>취소</div>
      </div>

      <div style={{ overflow: 'auto', height: 'calc(100% - 44px - 62px - 78px)', paddingBottom: 20 }}>
        {/* Filter row */}
        <div style={{ padding: '0 16px 14px', display: 'flex', gap: 6, overflowX: 'auto' }}>
          {[{ t: '전체', a: true }, { t: '가이드' }, { t: '매거진' }, { t: '용어' }].map((c, i) => (
            <div key={i} style={{
              padding: '7px 13px', borderRadius: 999,
              background: c.a ? T.navy : '#fff', color: c.a ? '#fff' : T.ink,
              fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
              border: `1px solid ${c.a ? T.navy : T.line}`,
            }}>{c.t}</div>
          ))}
        </div>

        {/* Guide result cluster */}
        <div style={{ padding: '0 16px 20px' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: T.gold, letterSpacing: '0.08em', marginBottom: 10 }}>KNS 가이드 · 2건</div>
          {[
            { ic: '🎯', t: '영재고·과학고·외고, 어떻게 다른가요?', tag: '특목고 입시', hi: '외고' },
            { ic: '🗺️', t: '중등 3년 로드맵 — 외고 준비 시점', tag: '학년별 로드맵', hi: '외고' },
          ].map((g, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, padding: 12, background: '#fff',
              borderRadius: 12, marginBottom: 8, border: `1px solid ${T.lineSoft}`,
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#FFF4D6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{g.ic}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.ink3, marginBottom: 3 }}>{g.tag}</div>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.4, wordBreak: 'keep-all' }}>
                  영재고·과학고·<mark style={{ background: '#FFF4D6', color: '#6B4B00', padding: '0 2px', borderRadius: 3 }}>외고</mark>, 어떻게 다른가요?
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Magazine result cluster */}
        <div style={{ padding: '0 16px 20px' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: T.gold, letterSpacing: '0.08em', marginBottom: 10 }}>매거진 · 8건</div>
          {[
            { g: '중등', tp: '특목고', t: '외고 준비, 중1이면 늦을까요? 단계별 로드맵', d: '6일 전', l: '외고' },
            { g: '중등', tp: '특목고', t: '외고 지원 시 유리한 내신 과목은?', d: '2주 전', l: '외고' },
          ].map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 1 ? `1px solid ${T.lineSoft}` : 'none' }}>
              <div style={{ width: 72, flexShrink: 0 }}>
                <Thumb grade={it.g} topic={it.tp} label={it.l} aspect="1/1" radius={10}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                  <GradeBadge grade={it.g}/><TopicBadge topic={it.tp}/>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.45, letterSpacing: '-0.02em', wordBreak: 'keep-all' }}>{it.t}</div>
                <div style={{ fontSize: 10, color: T.ink3, marginTop: 4 }}>KNS 입시연구소 · {it.d}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Glossary inline */}
        <div style={{ padding: '0 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: T.gold, letterSpacing: '0.08em', marginBottom: 10 }}>입시 용어 · 1건</div>
          <div style={{ background: '#fff', borderRadius: 12, padding: '14px 14px', border: `1px solid ${T.lineSoft}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>외고</div>
              <div style={{ fontSize: 10, color: T.ink3, fontWeight: 600 }}>외국어고등학교</div>
            </div>
            <div style={{ fontSize: 12, color: T.ink2, lineHeight: 1.6, wordBreak: 'keep-all' }}>
              외국어 교육을 중점으로 하는 특수목적고등학교. 영어와 제2외국어 학과로 구분됩니다.
            </div>
          </div>
        </div>
      </div>

      <TabBar active="home" />
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

function ScreenMyPage() {
  const T = window.KNS_TOKENS;
  return (
    <div style={{ width: '100%', height: '100%', background: T.ivory, position: 'relative', overflow: 'hidden', fontFamily: T.font, color: T.ink }}>
      <PhoneStatusBar />
      <div style={{ padding: '6px 16px 0', fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>마이</div>

      <div style={{ overflow: 'auto', height: 'calc(100% - 44px - 38px - 78px)', paddingBottom: 20 }}>
        {/* Profile */}
        <div style={{ padding: '16px 16px 8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1B2A4A 0%, #2A3F6A 100%)',
            borderRadius: 18, padding: '20px 18px', color: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 999, background: T.gold,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800, color: T.navy,
              }}>김</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>김○○ 학부모님</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>자녀 학년: 중등 2학년</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
              <div style={{ flex: 1, padding: '10px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800 }}>12</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>읽은 콘텐츠</div>
              </div>
              <div style={{ flex: 1, padding: '10px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800 }}>4</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>북마크</div>
              </div>
              <div style={{ flex: 1, padding: '10px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800 }}>2</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>상담 이력</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent reads */}
        <div style={{ padding: '18px 16px 10px' }}>
          <SectionHead eyebrow="RECENT" title="최근 본 콘텐츠" more="전체"/>
          {[
            { g: '중등', tp: '특목고', t: '외고 준비, 중1이면 늦을까요?', time: '오늘 2시간 전' },
            { g: '중등', tp: '내신',   t: '중2 영어 내신, 이 3가지만 잡으면', time: '어제' },
          ].map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < 1 ? `1px solid ${T.lineSoft}` : 'none' }}>
              <div style={{ width: 54, flexShrink: 0 }}>
                <Thumb grade={it.g} topic={it.tp} aspect="1/1" radius={8}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 5, marginBottom: 4 }}>
                  <GradeBadge grade={it.g}/><TopicBadge topic={it.tp}/>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '-0.02em', wordBreak: 'keep-all', lineHeight: 1.4 }}>{it.t}</div>
                <div style={{ fontSize: 10, color: T.ink3, marginTop: 3 }}>{it.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div style={{ padding: '14px 16px 0' }}>
          <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${T.lineSoft}`, overflow: 'hidden' }}>
            {[
              { ic: '🔖', t: '북마크', s: '4개 저장' },
              { ic: '💬', t: '상담 이력', s: '2건 진행 중' },
              { ic: '🔔', t: '알림 설정', s: '새 콘텐츠 · 설명회' },
              { ic: '⚙️', t: '환경 설정', s: null },
            ].map((m, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 14px',
                borderBottom: i < 3 ? `1px solid ${T.lineSoft}` : 'none',
              }}>
                <div style={{ fontSize: 18 }}>{m.ic}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em' }}>{m.t}</div>
                  {m.s ? <div style={{ fontSize: 10, color: T.ink3, marginTop: 2 }}>{m.s}</div> : null}
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.ink3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TabBar active="my" />
    </div>
  );
}

Object.assign(window, { ScreenSearch, ScreenMyPage });
