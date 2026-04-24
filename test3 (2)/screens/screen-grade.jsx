// KNS Magazine — Screen 2: Grade Hub (중등 example)

function ScreenGradeHub() {
  const T = window.KNS_TOKENS;
  const grade = '중등';
  const c = T.grade[grade];

  return (
    <div style={{
      width: '100%', height: '100%', background: T.ivory,
      position: 'relative', overflow: 'hidden',
      fontFamily: T.font, color: T.ink,
    }}>
      <PhoneStatusBar />
      {/* Top nav */}
      <div style={{
        padding: '6px 16px 10px', display: 'flex', alignItems: 'center', gap: 8,
        background: T.ivory,
      }}>
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em' }}>학년별</div>
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </div>

      <div style={{ overflow: 'auto', height: 'calc(100% - 44px - 46px - 78px)', paddingBottom: 20 }}>
        {/* Grade tabs */}
        <div style={{ padding: '0 16px', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 6, background: T.ivoryWarm, padding: 4, borderRadius: 12 }}>
            {['초등', '중등', '예비고1', '고등'].map(g => {
              const active = g === grade;
              const gc = T.grade[g];
              return (
                <div key={g} style={{
                  flex: 1, padding: '9px 0', borderRadius: 9,
                  background: active ? '#fff' : 'transparent',
                  textAlign: 'center',
                  fontSize: 12, fontWeight: active ? 800 : 600,
                  color: active ? gc.ink : T.ink2,
                  letterSpacing: '-0.02em',
                  boxShadow: active ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
                }}>{g}</div>
              );
            })}
          </div>
        </div>

        {/* Grade hero card */}
        <div style={{ padding: '0 16px 18px' }}>
          <div style={{
            background: `linear-gradient(135deg, ${c.bg} 0%, ${c.bgSoft} 100%)`,
            borderRadius: 20, padding: '20px 20px',
            border: `1px solid ${c.ring}40`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
                color: c.accent, textTransform: 'uppercase',
              }}>Middle · 중등</span>
              <div style={{ width: 6, height: 6, borderRadius: 999, background: c.accent }}/>
              <span style={{ fontSize: 10, color: c.ink, opacity: 0.7 }}>총 42개 콘텐츠</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: c.ink, lineHeight: 1.3, marginBottom: 8, wordBreak: 'keep-all' }}>
              내신과 방향 설정,<br/>둘 다 놓치면 안 되는 시기
            </div>
            <div style={{ fontSize: 12, color: c.ink, opacity: 0.75, lineHeight: 1.65, marginBottom: 14 }}>
              내신 성적 관리와 함께 특목고·자사고 선택, 고교 방향을 함께 준비해야 하는 학년이에요.
            </div>

            {/* Roadmap mini */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px 14px', border: `1px solid ${c.ring}30` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: c.accent, marginBottom: 8, letterSpacing: '0.02em' }}>
                중등 3년 로드맵 →
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { y: '중1', t: '기초·내신' },
                  { y: '중2', t: '진로 탐색' },
                  { y: '중3', t: '고입 결정' },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{
                      fontSize: 11, fontWeight: 800, color: c.ink,
                      padding: '6px 0', background: c.bgSoft, borderRadius: 8, marginBottom: 4,
                    }}>{s.y}</div>
                    <div style={{ fontSize: 10, color: T.ink2, fontWeight: 600 }}>{s.t}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Topic filter */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
            {[
              { t: '전체', active: true },
              { t: '내신' }, { t: '특목고' }, { t: '학습법' }, { t: '입시정보' },
            ].map((it, i) => (
              <div key={i} style={{
                padding: '8px 14px', borderRadius: 999,
                background: it.active ? c.accent : '#fff',
                color: it.active ? '#fff' : T.ink,
                fontSize: 12, fontWeight: 700, letterSpacing: '-0.01em',
                border: `1px solid ${it.active ? c.accent : T.line}`,
                whiteSpace: 'nowrap',
              }}>{it.t}</div>
            ))}
          </div>
        </div>

        {/* Featured guide */}
        <div style={{ padding: '0 16px 20px' }}>
          <SectionHead eyebrow="GUIDE" title="중등 기본 입시 가이드" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { ic: '🎯', t: '특목고 입시 한눈에', s: '영재고·과학고·외고·국제고·자사고' },
              { ic: '📚', t: '중등 내신 완전 정복', s: '학년별 시험 대비 로드맵' },
              { ic: '🔤', t: '입시 용어 사전', s: '학종·수시·정시 한 번에' },
            ].map((g, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 14px', background: '#fff', borderRadius: 14,
                border: `1px solid ${T.lineSoft}`,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: c.bgSoft, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>{g.ic}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 2 }}>{g.t}</div>
                  <div style={{ fontSize: 11, color: T.ink2 }}>{g.s}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.ink3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            ))}
          </div>
        </div>

        {/* Magazine for this grade */}
        <div style={{ padding: '0 16px' }}>
          <SectionHead eyebrow="MAGAZINE" title="중등 학부모가 많이 읽은" more="전체보기" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { topic: '특목고', title: '외고 준비, 중1이면 늦을까요? 단계별 로드맵', label: '특목고' },
              { topic: '내신',   title: '중2 1학기 영어 내신, 이 3가지만 잡으면 된다', label: '내신' },
            ].map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 96, flexShrink: 0 }}>
                  <Thumb grade={grade} topic={it.topic} label={it.label} aspect="1/1" radius={12}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                    <GradeBadge grade={grade} />
                    <TopicBadge topic={it.topic} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, letterSpacing: '-0.02em', marginBottom: 6, wordBreak: 'keep-all' }}>
                    {it.title}
                  </div>
                  <div style={{ fontSize: 11, color: T.ink3 }}>KNS 입시연구소 · 3일 전</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TabBar active="grade" grade={grade} />
    </div>
  );
}

Object.assign(window, { ScreenGradeHub });
