// KNS Magazine — Screen 6: 용어 사전 (Glossary)
// Screen 7: 매거진 인덱스 (Magazine index)

function ScreenGlossary() {
  const T = window.KNS_TOKENS;
  const accent = '#D75F3C';
  const accentBg = '#FFE1D6';

  const terms = [
    { ko: '학종', en: '학생부종합전형', d: '학교생활기록부를 종합 평가', cat: '대학' },
    { ko: '수시', en: '수시모집',       d: '정시 이전에 원서 접수',      cat: '대학' },
    { ko: '정시', en: '정시모집',       d: '수능 성적 중심 선발',        cat: '대학' },
    { ko: '내신', en: '학교 내신 성적',   d: '학교 시험 기반 등급',        cat: '고교' },
    { ko: '자사고', en: '자율형 사립고', d: '커리큘럼 자율성 높은 사립',  cat: '특목' },
    { ko: 'CSAT', en: '대학수학능력시험', d: '수능의 영문명',              cat: '대학' },
  ];

  return (
    <div style={{
      width: '100%', height: '100%', background: T.ivory,
      position: 'relative', overflow: 'hidden',
      fontFamily: T.font, color: T.ink,
    }}>
      <PhoneStatusBar />
      <div style={{ padding: '6px 16px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em' }}>입시 용어 사전</div>
      </div>

      <div style={{ padding: '6px 20px 18px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.3, marginBottom: 6 }}>
          모르는 입시 용어,<br/>쉽게 풀어드려요
        </div>
        <div style={{ fontSize: 12, color: T.ink2 }}>총 86개 용어 · 초성·카테고리로 빠르게 찾기</div>
      </div>

      {/* Search */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', borderRadius: 12, padding: '11px 14px',
          border: `1px solid ${T.lineSoft}`,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.ink3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <div style={{ fontSize: 13, color: T.ink3 }}>예: 학종, 자사고, 정시</div>
        </div>
      </div>

      {/* Category chips */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {[
          { t: '전체', a: true },
          { t: '대학 입시' }, { t: '고교 유형' }, { t: '특목고' }, { t: '내신·수능' },
        ].map((c, i) => (
          <div key={i} style={{
            padding: '7px 13px', borderRadius: 999,
            background: c.a ? accent : '#fff', color: c.a ? '#fff' : T.ink,
            fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
            border: `1px solid ${c.a ? accent : T.line}`,
          }}>{c.t}</div>
        ))}
      </div>

      {/* Glossary grid */}
      <div style={{ padding: '0 16px', overflow: 'auto', height: 'calc(100% - 44px - 48px - 82px - 54px - 48px - 78px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {terms.map((t, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 14, padding: '14px 14px',
              border: `1px solid ${T.lineSoft}`, minHeight: 108,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 3 }}>{t.ko}</div>
                <div style={{ fontSize: 10, color: T.ink3, fontWeight: 600, marginBottom: 8 }}>{t.en}</div>
                <div style={{ fontSize: 11, color: T.ink2, lineHeight: 1.55, wordBreak: 'keep-all' }}>{t.d}</div>
              </div>
              <div style={{ marginTop: 8 }}>
                <span style={{
                  fontSize: 9, fontWeight: 800, padding: '3px 7px',
                  background: accentBg, color: '#6E2B15', borderRadius: 999,
                }}>{t.cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="guide" />
    </div>
  );
}

function ScreenMagazineIndex() {
  const T = window.KNS_TOKENS;

  return (
    <div style={{
      width: '100%', height: '100%', background: T.ivory,
      position: 'relative', overflow: 'hidden',
      fontFamily: T.font, color: T.ink,
    }}>
      <PhoneStatusBar />
      <div style={{ padding: '6px 16px 6px', display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>
          매거진
        </div>
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </div>

      {/* Filter rail */}
      <div style={{ padding: '8px 16px 14px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {[
          { t: '전체', a: true }, { t: '내신' }, { t: '수능' }, { t: '특목고' }, { t: '학습법' }, { t: '입시정보' },
        ].map((c, i) => (
          <div key={i} style={{
            padding: '7px 13px', borderRadius: 999,
            background: c.a ? T.navy : '#fff', color: c.a ? '#fff' : T.ink,
            fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
            border: `1px solid ${c.a ? T.navy : T.line}`,
          }}>{c.t}</div>
        ))}
      </div>

      <div style={{ overflow: 'auto', height: 'calc(100% - 44px - 46px - 50px - 78px)', padding: '0 16px 20px' }}>
        {/* Featured hero card */}
        <div style={{
          background: '#fff', borderRadius: 18, overflow: 'hidden',
          border: `1px solid ${T.lineSoft}`, marginBottom: 18,
        }}>
          <div style={{ padding: 4 }}>
            <Thumb grade="중등" topic="특목고" label="커버 스토리" aspect="16/10" radius={14}/>
          </div>
          <div style={{ padding: '14px 16px 18px' }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              <GradeBadge grade="중등"/>
              <TopicBadge topic="특목고"/>
              <Badge bg="#F7EFD8" ink="#715924">커버</Badge>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.4, marginBottom: 8, wordBreak: 'keep-all' }}>
              외고 준비, 중1이면 늦을까요? 학년별 단계 로드맵
            </div>
            <div style={{ fontSize: 12, color: T.ink2, lineHeight: 1.65, wordBreak: 'keep-all' }}>
              "중2부터 시작해도 늦지 않다"는 오해와 진실. KNS 입시연구소가 짚어드립니다.
            </div>
          </div>
        </div>

        {/* List */}
        {[
          { g: '고등',    tp: '수능',    t: '2026 수능 영어 — 킬러 문항 유형 총정리', d: '최근 3년 출제 경향을 분석해 대비 전략을 정리했습니다.', date: '4일 전', l: '수능' },
          { g: '초등',    tp: '학습법',  t: '초등 영어책 읽기, 수준별 도서 추천 40선',  d: '영어 독서를 이제 막 시작한 초등 학부모를 위해.',       date: '1주 전', l: '독서' },
          { g: '예비고1', tp: '내신',    t: '예비 고1 겨울방학 영어 학습 플랜 6주 전략', d: '고1 첫 내신을 이기는 6주 커리큘럼.',                   date: '2주 전', l: '내신' },
        ].map((it, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, padding: '14px 0',
            borderBottom: i < 2 ? `1px solid ${T.lineSoft}` : 'none',
          }}>
            <div style={{ width: 92, flexShrink: 0 }}>
              <Thumb grade={it.g} topic={it.tp} label={it.l} aspect="1/1" radius={12}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <GradeBadge grade={it.g}/>
                <TopicBadge topic={it.tp}/>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4, letterSpacing: '-0.02em', marginBottom: 4, wordBreak: 'keep-all' }}>{it.t}</div>
              <div style={{ fontSize: 11, color: T.ink2, lineHeight: 1.55, wordBreak: 'keep-all', marginBottom: 6 }}>{it.d}</div>
              <div style={{ fontSize: 10, color: T.ink3 }}>KNS 입시연구소 · {it.date}</div>
            </div>
          </div>
        ))}
      </div>

      <TabBar active="mag" />
    </div>
  );
}

Object.assign(window, { ScreenGlossary, ScreenMagazineIndex });
