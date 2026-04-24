// KNS Magazine — Screen 1: Home (First Impression)
// Layout: grade-picker hero + trending + latest magazine + guide teaser

function ScreenHome({ gradeAccent }) {
  const T = window.KNS_TOKENS;
  const heroGrade = gradeAccent || '중등';
  const gc = T.grade[heroGrade];

  return (
    <div style={{
      width: '100%', height: '100%', background: T.ivory,
      overflow: 'hidden', position: 'relative',
      fontFamily: T.font, color: T.ink,
    }}>
      <PhoneStatusBar dark={true} />

      {/* Hero — navy, grade picker is the headline */}
      <div style={{
        background: `linear-gradient(180deg, ${T.navyDeep} 0%, ${T.navy} 50%, ${T.navyLight} 100%)`,
        color: '#fff', padding: '8px 20px 26px',
      }}>
        {/* Top bar: logo + search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.03em' }}>
            KNS <span style={{ color: T.gold }}>매거진</span>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: T.gold, letterSpacing: '0.04em', marginBottom: 8, textTransform: 'uppercase' }}>
          학부모가 먼저 찾는 영어 입시 매거진
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.03em', marginBottom: 18, wordBreak: 'keep-all' }}>
          우리 아이 학년부터<br/>골라보세요
        </div>

        {/* Grade picker — 4 big tiles, color-coded */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {['초등', '중등', '예비고1', '고등'].map(g => {
            const c = T.grade[g];
            const active = g === heroGrade;
            return (
              <div key={g} style={{
                background: active ? c.bg : 'rgba(255,255,255,0.08)',
                border: `1px solid ${active ? c.bg : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 14, padding: '14px 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: active ? c.accent : 'rgba(255,255,255,0.5)', letterSpacing: '0.02em', marginBottom: 2 }}>
                    {g === '초등' ? 'ELEMENTARY' : g === '중등' ? 'MIDDLE' : g === '예비고1' ? 'PRE-HIGH' : 'HIGH'}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: active ? c.ink : '#fff', letterSpacing: '-0.02em' }}>{g}</div>
                </div>
                <div style={{
                  width: 26, height: 26, borderRadius: 999,
                  background: active ? c.accent : 'rgba(255,255,255,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll area */}
      <div style={{ padding: '20px 20px 100px', overflow: 'auto', height: 'calc(100% - 44px - 278px)' }}>
        {/* Trending */}
        <SectionHead eyebrow="TRENDING NOW" title="지금 많이 보는 콘텐츠" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {[
            { rank: 1, grade: '중등', topic: '특목고', title: '외고 준비, 중1이면 늦을까요? 단계별 로드맵', views: '2,847' },
            { rank: 2, grade: '고등',  topic: '수능',    title: '2026 수능 영어 대비 — 킬러 문항 유형 총정리', views: '2,103' },
            { rank: 3, grade: '초등', topic: '학습법',  title: '초등 영어책 읽기, 수준별 도서 추천 40선', views: '1,892' },
          ].map(it => {
            const c = T.grade[it.grade];
            return (
              <div key={it.rank} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '14px 14px', background: '#fff', borderRadius: 14,
                border: `1px solid ${T.lineSoft}`,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: it.rank === 1 ? T.gold : T.ivoryWarm,
                  color: it.rank === 1 ? '#fff' : T.ink2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, flexShrink: 0,
                }}>{it.rank}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                    <GradeBadge grade={it.grade} />
                    <TopicBadge topic={it.topic} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, letterSpacing: '-0.02em', marginBottom: 4, wordBreak: 'keep-all' }}>
                    {it.title}
                  </div>
                  <div style={{ fontSize: 11, color: T.ink3 }}>조회 {it.views}회 · 3일 전</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guide teaser card */}
        <div style={{
          background: `linear-gradient(135deg, ${T.ivoryWarm} 0%, #FBF4E8 100%)`,
          border: `1px solid ${T.lineSoft}`,
          borderRadius: 18, padding: '18px 18px', marginBottom: 28,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.gold, letterSpacing: '0.06em', marginBottom: 6 }}>
            KNS 입시가이드
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6, lineHeight: 1.3 }}>
            특목고부터 대학 입시까지,<br/>학부모가 먼저 알아야 할 기본기
          </div>
          <div style={{ fontSize: 12, color: T.ink2, marginBottom: 14, lineHeight: 1.6 }}>
            영재고·과학고·외고부터 수시·정시 전형 구조까지 차근차근 정리했어요.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['특목고 개요', '학년별 로드맵', '용어 사전'].map((l, i) => (
              <div key={i} style={{
                padding: '7px 11px', background: '#fff',
                borderRadius: 999, fontSize: 11, fontWeight: 700, color: T.navy,
                border: `1px solid ${T.line}`,
              }}>{l} →</div>
            ))}
          </div>
        </div>

        {/* Latest */}
        <SectionHead eyebrow="LATEST" title="최신 콘텐츠" more="전체보기" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { grade: '예비고1', topic: '내신', title: '예비 고1 겨울방학 영어 학습 플랜 — 6주 전략', date: '2일 전', label: '내신 대비' },
            { grade: '고등',    topic: '수능', title: '수능 영어 1등급의 독해 루틴, 이렇게 바뀌었다', date: '4일 전', label: '수능' },
          ].map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 96, flexShrink: 0 }}>
                <Thumb grade={it.grade} topic={it.topic} label={it.label} aspect="1/1" radius={12}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                  <GradeBadge grade={it.grade} />
                  <TopicBadge topic={it.topic} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, letterSpacing: '-0.02em', marginBottom: 6, wordBreak: 'keep-all' }}>
                  {it.title}
                </div>
                <div style={{ fontSize: 11, color: T.ink3 }}>KNS 입시연구소 · {it.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="home" />
    </div>
  );
}

function SectionHead({ eyebrow, title, more }) {
  const T = window.KNS_TOKENS;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.gold, letterSpacing: '0.08em', marginBottom: 4 }}>{eyebrow}</div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: T.ink }}>{title}</div>
        </div>
        {more ? <div style={{ fontSize: 12, fontWeight: 600, color: T.ink2 }}>{more} →</div> : null}
      </div>
    </div>
  );
}

Object.assign(window, { ScreenHome, SectionHead });
