// KNS Magazine — design tokens & shared UI bits
// Grade color system + brand palette from existing globals.css + reference.md

window.KNS_TOKENS = {
  // Brand base
  navy: '#1B2A4A',
  navyLight: '#2A3F6A',
  navyDeep: '#162744',
  ivory: '#FAF8F5',
  ivoryWarm: '#F5F0EB',
  gold: '#C8A951',
  goldLight: '#E8D5A0',
  white: '#FFFFFF',
  ink: '#1D1D1F',
  ink2: '#6B7280',
  ink3: '#9CA3AF',
  line: 'rgba(27,42,74,0.10)',
  lineSoft: 'rgba(27,42,74,0.06)',

  // Grade color system — warm & distinct
  grade: {
    '초등':   { bg: '#FFF4D6', bgSoft: '#FFFAEE', accent: '#E5A500', ink: '#6B4B00', ring: '#F4C85A' },
    '중등':   { bg: '#D8F1E4', bgSoft: '#EDF8F2', accent: '#1F9E6A', ink: '#0F5237', ring: '#6CCBA0' },
    '예비고1': { bg: '#FFE1D6', bgSoft: '#FFEFE8', accent: '#D75F3C', ink: '#6E2B15', ring: '#F4A081' },
    '고등':   { bg: '#DCE6FA', bgSoft: '#EEF2FC', accent: '#3758C5', ink: '#1B2A4A', ring: '#889FE0' },
  },

  // Topic colors (from existing Badge.tsx, slightly refined)
  topic: {
    '내신':   { bg: '#DDEAFE', ink: '#224C78' },
    '수능':   { bg: '#E3EAF4', ink: '#344964' },
    '특목고': { bg: '#F1E2DB', ink: '#74473B' },
    '학습법': { bg: '#E0EFE6', ink: '#244B39' },
    '입시정보': { bg: '#F4E6C6', ink: '#6F531F' },
    '기타':   { bg: '#ECE5E1', ink: '#594F4C' },
  },

  font: `"Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`,
};

// Inject Pretendard once
if (typeof document !== 'undefined' && !document.getElementById('kns-fonts')) {
  const l = document.createElement('link');
  l.id = 'kns-fonts';
  l.rel = 'stylesheet';
  l.href = 'https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/pretendard.css';
  document.head.appendChild(l);
}

// ─── Small shared components ──────────────────────────────────

const T = window.KNS_TOKENS;

function Badge({ children, bg, ink, border, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 22, padding: '0 9px', borderRadius: 999,
      background: bg, color: ink,
      border: border ? `1px solid ${border}` : 'none',
      fontSize: 11, fontWeight: 700, letterSpacing: '-0.01em',
      whiteSpace: 'nowrap',
      ...style,
    }}>{children}</span>
  );
}

function GradeBadge({ grade, size = 'sm' }) {
  const c = T.grade[grade] || T.grade['중등'];
  const h = size === 'lg' ? 28 : 22;
  const fs = size === 'lg' ? 12 : 11;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: h, padding: `0 ${size === 'lg' ? 12 : 9}px`, borderRadius: 999,
      background: c.bg, color: c.ink,
      fontSize: fs, fontWeight: 700, letterSpacing: '-0.01em',
    }}>{grade}</span>
  );
}

function TopicBadge({ topic }) {
  const c = T.topic[topic] || T.topic['기타'];
  return <Badge bg={c.bg} ink={c.ink}>{topic}</Badge>;
}

// Status bar — custom instead of iOS starter, for brand feel
function PhoneStatusBar({ dark = false, time = '9:41' }) {
  const c = dark ? '#fff' : '#000';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 28px 6px', height: 44, boxSizing: 'border-box',
      fontFamily: '-apple-system, "SF Pro", system-ui',
      position: 'relative', zIndex: 20,
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: c }}>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="17" height="11" viewBox="0 0 17 11">
          <rect x="0" y="7" width="3" height="4" rx="0.5" fill={c}/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill={c}/>
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill={c}/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill={c}/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11">
          <path d="M7.5 2.9C9.5 2.9 11.4 3.7 12.7 5L13.7 4C11.9 2.3 9.8 1.3 7.5 1.3C5.2 1.3 3.1 2.3 1.3 4L2.3 5C3.6 3.7 5.5 2.9 7.5 2.9Z" fill={c}/>
          <path d="M7.5 6C8.7 6 9.8 6.5 10.6 7.2L11.6 6.2C10.5 5.1 9.1 4.4 7.5 4.4C5.9 4.4 4.5 5.1 3.4 6.2L4.4 7.2C5.2 6.5 6.3 6 7.5 6Z" fill={c}/>
          <circle cx="7.5" cy="9.3" r="1.3" fill={c}/>
        </svg>
        <svg width="24" height="11" viewBox="0 0 24 11">
          <rect x="0.5" y="0.5" width="20" height="10" rx="3" stroke={c} strokeOpacity="0.35" fill="none"/>
          <rect x="2" y="2" width="17" height="7" rx="1.5" fill={c}/>
          <path d="M22 3.5V7.5C22.6 7.3 23 6.6 23 6C23 5.4 22.6 4.7 22 4.5Z" fill={c} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// Bottom tab bar — 5 tabs, KNS style
function TabBar({ active = 'home', grade }) {
  const tabs = [
    { id: 'home',   label: '홈',     icon: 'home' },
    { id: 'grade',  label: '학년별',  icon: 'grade' },
    { id: 'guide',  label: '입시가이드', icon: 'guide' },
    { id: 'mag',    label: '매거진',   icon: 'book' },
    { id: 'my',     label: '마이',    icon: 'user' },
  ];
  const accent = grade ? T.grade[grade].accent : T.navy;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height: 78, background: 'rgba(255,255,255,0.94)',
      backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      display: 'flex', paddingBottom: 18, paddingTop: 6,
      zIndex: 50,
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        return (
          <div key={t.id} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 3,
          }}>
            <TabIcon kind={t.icon} color={isActive ? accent : '#9CA3AF'} />
            <span style={{
              fontSize: 10, fontWeight: isActive ? 700 : 500,
              color: isActive ? accent : '#9CA3AF',
              letterSpacing: '-0.02em',
            }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function TabIcon({ kind, color }) {
  const s = 22;
  const sw = 1.8;
  const common = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (kind === 'home') return <svg {...common}><path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2V11z"/></svg>;
  if (kind === 'grade') return <svg {...common}><rect x="3.5" y="4.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="4.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="12.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="12.5" width="7" height="7" rx="1.5"/></svg>;
  if (kind === 'guide') return <svg {...common}><path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14l-4-3H6a2 2 0 0 1-2-2V5z"/><path d="M8 8h8M8 12h5"/></svg>;
  if (kind === 'book') return <svg {...common}><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H12v16H5.5A1.5 1.5 0 0 1 4 17.5v-13z"/><path d="M20 4.5A1.5 1.5 0 0 0 18.5 3H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13z"/></svg>;
  if (kind === 'user') return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>;
  return null;
}

// Lightweight placeholder thumbnail — gradient + glyph
function Thumb({ grade, topic, label, aspect = '16/9', radius = 14 }) {
  const gc = T.grade[grade] || T.grade['중등'];
  const tc = T.topic[topic] || T.topic['기타'];
  return (
    <div style={{
      aspectRatio: aspect,
      borderRadius: radius,
      background: `linear-gradient(135deg, ${gc.bg} 0%, ${tc.bg} 100%)`,
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'flex-end', padding: 12,
    }}>
      <div style={{
        position: 'absolute', top: 10, right: 10,
        width: 28, height: 28, borderRadius: 8,
        background: 'rgba(255,255,255,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 800, color: gc.ink,
        letterSpacing: '-0.02em',
      }}>{grade?.[0] || '공'}</div>
      {label ? (
        <div style={{
          fontSize: 11, fontWeight: 700, color: gc.ink,
          background: 'rgba(255,255,255,0.82)', padding: '3px 8px',
          borderRadius: 999, letterSpacing: '-0.01em',
        }}>{label}</div>
      ) : null}
    </div>
  );
}

Object.assign(window, { Badge, GradeBadge, TopicBadge, PhoneStatusBar, TabBar, Thumb });
