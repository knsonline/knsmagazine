# AGENTS.md — KNS 매거진 프로젝트 규칙

이 파일은 이 프로젝트에서 작업하는 모든 AI 에이전트가 반드시 먼저 읽고 따라야 하는 규칙입니다.

## 이 제품은 무엇인가

KNS 매거진은 학부모를 위한 모바일 우선 교육 큐레이션 매거진입니다.

학부모가 하는 일:
- 홈에서 학년별·주제별로 큐레이션된 글과 영상을 탐색한다
- 관심 있는 콘텐츠를 읽거나 본다
- 자연스럽게 상담·설명회·학습진단 안내로 이어진다

운영자(1인)가 하는 일:
- 어드민에서 콘텐츠를 등록하고 태깅한다
- 홈에 어떤 콘텐츠를 보여줄지 선택한다
- CTA와 배너를 관리한다
- 대시보드에서 어떤 콘텐츠가 빛나는지 확인한다

콘텐츠 본문은 외부(유튜브, 블로그, 카페)에 있다.
매거진은 그 콘텐츠를 학부모 관점으로 재배열하는 큐레이션 레이어다.

## 이 제품이 아닌 것

- 위키가 아니다
- 위키하우가 아니다
- 문서 사이트가 아니다
- SaaS 대시보드가 아니다
- 기업용 CMS가 아니다
- 애니메이션이 가득한 미디어 사이트가 아니다
- 무한스크롤 피드가 아니다

## 기술 스택 (확정)

- **프레임워크**: Next.js 14+ (App Router)
- **스타일링**: Tailwind CSS
- **데이터베이스**: Supabase (PostgreSQL + Auth + Realtime)
- **배포**: Vercel
- **언어**: TypeScript

이 스택은 확정이다. 다른 대안을 논의하지 마라.
단, 프로젝트 구조와 컴포넌트 설계는 자유롭게 제안할 수 있다.

## 디자인 토큰 (확정)
```css
/* 브랜드 색상 */
--color-navy: #1B2A4A;          /* 구조적 앵커. 헤더, 사이드바, 강조 배경 */
--color-navy-light: #2A3F6A;    /* 네비게이션 호버, 서브 헤더 */
--color-ivory: #FAF8F5;         /* 메인 배경 */
--color-ivory-warm: #F5F0EB;    /* 카드 배경, 섹션 구분 */
--color-gold: #C8A951;          /* 선택적 악센트 전용 */
--color-gold-light: #E8D5A0;    /* 배지 배경, 하이라이트 */

/* 텍스트 */
--color-text-primary: #1D1D1F;  /* 본문 */
--color-text-secondary: #6B7280; /* 보조 텍스트, 메타 정보 */
--color-text-muted: #9CA3AF;    /* 플레이스홀더, 비활성 */

/* 기능 색상 */
--color-success: #059669;       /* 공개, 활성 */
--color-warning: #D97706;       /* 주의, 대기 */
--color-error: #DC2626;         /* 오류, 비공개 */

/* CTA */
--color-cta-primary: #1B2A4A;   /* 주요 버튼 (네이비) */
--color-cta-accent: #C8A951;    /* 강조 버튼, 배지 (골드 — 아껴 쓸 것) */
```

### 골드 사용 규칙
골드(--color-gold)는 다음에만 쓴다:
- "추천", "인기" 같은 작은 배지
- 포커스 인디케이터
- 특별한 CTA 하나 (예: 설명회 신청)
- 중요 알림 점

골드를 쓰면 안 되는 곳:
- 일반 버튼 전체
- 배경 전체
- 헤더나 푸터
- 카드 테두리 전체

### 타이포그래피
- 한글: "Pretendard" (웹폰트)
- 영문/숫자: "Inter" 또는 시스템 산세리프
- 본문: 16px / line-height 1.7
- 카드 제목: 18px semibold
- 섹션 헤더: 24px bold
- 페이지 타이틀: 32px bold

### 간격
- 섹션 간: 48px ~ 64px
- 카드 간: 16px ~ 20px
- 카드 내부 패딩: 16px ~ 20px
- 모바일 좌우 여백: 16px ~ 20px

## 한국어 UI 규칙

사용자에게 보이는 모든 텍스트는 자연스러운 한국어로 작성한다.
이것은 선택이 아니라 필수다.

포함 범위:
- 페이지 제목, 내비게이션 라벨
- 섹션 헤더, 버튼 라벨
- 폼 라벨, 플레이스홀더
- 배지, 상태 표시
- 빈 상태 메시지, 에러 메시지
- 대시보드 라벨, 필터 라벨

개발자용 주석과 변수명은 영어 가능.

## 퍼블릭 매거진 규칙

모바일 퍼스트. 데스크톱은 보조.

### 홈페이지 섹션 구조 (이 순서를 따를 것)

히어로 영역

운영자가 지정한 대표 콘텐츠 1개
큰 썸네일 + 제목 + 한줄 요약
대표 콘텐츠가 없으면: 브랜드 메시지 + 학년 진입 버튼


학년 빠른 진입

초등 / 중등 / 예비고1 / 고등
가로 스크롤 또는 그리드
항상 표시 (데이터 없어도 진입점 역할)


지금 많이 보는 콘텐츠

조회수 기준 상위 4~6개
가로 스크롤 카드
데이터 부족 시: "운영자 추천" 콘텐츠로 대체


주제 컬렉션

"내신 대비 전략", "수능 영어 가이드" 같은 주제 묶음
각 컬렉션에 3~4개 콘텐츠 미리보기
운영자가 어드민에서 컬렉션을 직접 구성


설명회·이벤트 배너

운영자가 등록한 배너 1~2개
이미지 + 링크
배너 없으면: 이 섹션 자체를 숨김 (빈 공간 남기지 않음)


최신 콘텐츠

최근 등록순 6~8개
세로 카드 리스트
"더보기"로 전체 목록 진입


하단 소프트 CTA

"우리 아이에게 맞는 학습, 무료 상담으로 시작하세요"
부드러운 톤, 공격적이지 않게




### 카드 디자인 규칙
- 썸네일 + 제목 + 학년 배지 + 주제 태그 + 콘텐츠 타입(글/영상) 아이콘
- 둥근 모서리 (8px)
- 그림자 미세하게
- 탭하면 상세 페이지로 이동

### 상세 페이지
- 콘텐츠 정보 (제목, 요약, 학년, 주제, 타입)
- 외부 링크로 이동하는 메인 CTA 버튼 ("원문 보기", "영상 보기")
- 연관 콘텐츠 3~4개
- 맥락형 CTA ("이 주제가 궁금하시다면 → 무료 학습 상담 신청")

### 절대 하지 말 것
- 매이슨리 레이아웃
- 자동 재생 슬라이더
- 팝업 CTA
- 무한 스크롤 (메인 탐색에서)
- 과도한 애니메이션

## 어드민 규칙

데스크톱 퍼스트. 모바일 대응은 불필요.

### 어드민의 본질
구글 시트를 대체하는 "깔끔한 큐레이션 도구"이다.
에디터 팀용 편집실이 아니다.

### 어드민 페이지 구조

로그인

Supabase Auth (이메일/비밀번호)
단일 운영자 계정


대시보드 (홈)

오늘의 숫자: 총 공개 콘텐츠, 오늘 조회수, 주간 CTA 클릭
이번 주 인기 콘텐츠 Top 5
최근 등록한 콘텐츠 5개
운영 알림 (예: "배너 노출 기간 만료 예정")


콘텐츠 관리

테이블 형태 목록
각 행: 썸네일 미니 | 제목 | 학년 | 주제 | 타입 | 공개여부 | 홈추천 | 등록일
필터: 학년, 공개/비공개 (이 두 개만)
검색: 제목 기준
"새 콘텐츠 등록" 버튼


콘텐츠 등록/수정 폼

제목 (필수)
요약 (1~2줄)
외부 링크 URL (필수)
썸네일 이미지 URL
학년 선택 (초등/중등/예비고1/고등/공통)
주제 선택 (내신/수능/특목고/학습법/입시정보/기타)
콘텐츠 타입 (글/영상)
공개 여부 토글
홈 추천 토글
CTA 연결 (선택): 드롭다운으로 등록된 CTA 중 하나 선택


CTA 관리

CTA 목록 (문구 | 링크 | 사용 중인 콘텐츠 수)
CTA 등록/수정 (문구, 링크 URL)
예시: "무료 학습 상담 신청하기" → https://상담링크


배너 관리

배너 목록 (이미지 미리보기 | 링크 | 시작일 | 종료일 | 활성여부)
배너 등록/수정 (이미지 URL, 링크, 노출 기간)


주제 컬렉션 관리

컬렉션 목록 (컬렉션명 | 포함 콘텐츠 수 | 홈 노출 여부)
컬렉션 생성: 이름 입력 → 콘텐츠 검색해서 추가
홈에 어떤 컬렉션을 보여줄지 토글




### 어드민 디자인
- 퍼블릭 매거진과 같은 네이비/아이보리 톤을 사용하되, 실용적으로
- 좌측 사이드바 네비게이션 (네이비 배경)
- 메인 영역은 밝은 배경
- 상태 배지: 공개=초록, 비공개=회색, 홈추천=골드 작은 점
- 폼은 깔끔하고 여백 넉넉하게

### 어드민에서 하지 않는 것
- 리치 텍스트 편집 (콘텐츠 본문은 외부 링크)
- 초안→검토→승인 워크플로우
- 멀티 유저 권한 관리
- 드래그앤드롭 순서 정렬 (MVP에서는 불필요)

## 데이터 수집 규칙

### 수집하는 이벤트

| 이벤트 | 언제 | 함께 기록하는 것 |
|--------|------|-----------------|
| page_view | 페이지 로드 시 | 페이지 경로, referrer, UTM 파라미터 |
| content_view | 콘텐츠 상세 페이지 진입 시 | 콘텐츠 ID, 학년, 주제, 타입 |
| content_click | "원문 보기"/"영상 보기" 클릭 시 | 콘텐츠 ID, 외부 링크 |
| cta_click | CTA 버튼 클릭 시 | CTA ID, 연결된 콘텐츠 ID, CTA 문구 |
| banner_click | 배너 클릭 시 | 배너 ID |
| grade_select | 학년 필터 선택 시 | 선택한 학년 |
| collection_view | 주제 컬렉션 진입 시 | 컬렉션 ID, 컬렉션명 |

### 모든 이벤트에 공통으로 포함
- 타임스탬프
- 세션 ID (쿠키 기반 익명)
- 기기 타입 (mobile/desktop)
- referrer URL
- UTM 파라미터 (utm_source, utm_medium, utm_campaign)

### UTM/QR 추적
오프라인 설명회 QR 카드에서 유입되는 학부모를 추적할 수 있어야 한다.
예: `kns-magazine.com/?utm_source=qr&utm_campaign=2024_중등_설명회`
이 파라미터를 세션에 기록하여, "이 설명회에서 온 학부모가 어떤 콘텐츠를 봤는가"를 추적한다.

### 대시보드에서 보여주는 것
- 오늘/이번 주/이번 달 총 조회수
- 인기 콘텐츠 Top 10 (조회수 기준)
- 학년별 관심도 비율
- CTA 클릭 순위
- UTM 캠페인별 유입 수 (QR 효과 측정용)
- 최근 7일 일별 추이 (간단한 라인 차트 하나)

### 데이터에서 하지 않는 것
- 개인 식별 정보 수집
- 복잡한 퍼널 분석
- 실시간 대시보드 (새로고침으로 충분)
- 코호트 분석
- A/B 테스트 인프라

## 데이터 모델
```sql
-- 콘텐츠
contents (
  id uuid PK,
  title text NOT NULL,
  summary text,
  external_url text NOT NULL,
  thumbnail_url text,
  grade enum('초등','중등','예비고1','고등','공통'),
  topic enum('내신','수능','특목고','학습법','입시정보','기타'),
  content_type enum('글','영상'),
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,   -- 홈 추천
  is_hero boolean DEFAULT false,       -- 히어로 영역 (최대 1개)
  cta_id uuid FK → ctas,
  created_at timestamptz,
  updated_at timestamptz
)

-- CTA
ctas (
  id uuid PK,
  label text NOT NULL,        -- "무료 학습 상담 신청하기"
  url text NOT NULL,
  created_at timestamptz
)

-- 배너
banners (
  id uuid PK,
  image_url text NOT NULL,
  link_url text,
  starts_at date,
  ends_at date,
  is_active boolean DEFAULT true,
  created_at timestamptz
)

-- 주제 컬렉션
collections (
  id uuid PK,
  name text NOT NULL,          -- "내신 대비 전략 모음"
  is_visible_home boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz
)

-- 컬렉션 ↔ 콘텐츠 연결
collection_items (
  collection_id uuid FK → collections,
  content_id uuid FK → contents,
  sort_order integer DEFAULT 0,
  PRIMARY KEY (collection_id, content_id)
)

-- 이벤트 로그
events (
  id bigint PK auto,
  event_type text NOT NULL,
  session_id text,
  content_id uuid,
  cta_id uuid,
  banner_id uuid,
  collection_id uuid,
  grade text,
  topic text,
  page_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device_type text,
  created_at timestamptz DEFAULT now()
)
```

## 코드 품질 규칙

- 컴포넌트는 작고 단일 목적으로 만든다
- any 타입 사용 금지
- 하드코딩된 문자열 금지 (한국어 텍스트는 상수 또는 config로 관리)
- console.log 남기지 않는다
- 에러 핸들링을 빠뜨리지 않는다
- 로딩 상태와 빈 상태를 반드시 처리한다
- 모바일에서 터치 타겟 최소 44px

## 빈 상태 / 데이터 부족 규칙

데이터가 없거나 적을 때 홈이 비참해 보이면 안 된다.

- 히어로 콘텐츠 없음 → 브랜드 메시지 + 학년 진입 유도
- 인기 콘텐츠 부족 → "운영자 추천" 라벨로 is_featured 콘텐츠 표시
- 컬렉션 없음 → 컬렉션 섹션 숨김
- 배너 없음 → 배너 섹션 숨김
- 최신 콘텐츠 부족 → 있는 만큼만 표시, 빈 카드 없음
- 대시보드 데이터 없음 → "아직 데이터가 쌓이고 있어요" 메시지