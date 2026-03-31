# KNS 매거진

대치동 KNS어학원의 학부모 대상 교육 콘텐츠 큐레이션 매거진입니다.  
현재 목적은 “데모 사이트”가 아니라, 마케팅팀이 실제로 운영할 수 있는 모바일 우선 매거진과 단일 운영자용 관리자 도구를 유지하는 것입니다.

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

## 이 저장소에서 바로 해야 하는 일

### 개발자

1. `.env.example`을 참고해 `.env.local`을 채웁니다.
2. 의존성이 없으면 `npm install`을 실행합니다.
3. `npm run dev`로 로컬 서버를 실행합니다.
4. 작업 전후에는 `npm run check`를 실행합니다.
5. 배포 직전에는 `npm run check:prod`를 실행합니다.

### 운영자

1. Supabase에 `thumbnails`, `banners` public 버킷이 있는지 확인합니다.
2. 관리자 로그인 계정이 Supabase Auth에 생성되어 있는지 확인합니다.
3. 배포 도메인에서 `/api/health`가 `status: ok`로 응답하는지 확인합니다.
4. 관리자에서 콘텐츠/배너 등록 및 수정이 실제로 되는지 확인합니다.

## 필수 환경변수

아래 3개는 현재 실서비스 기준 필수입니다.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

설명:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 브라우저와 세션 기반 서버 클라이언트에서 사용하는 공개 키
- `SUPABASE_SERVICE_ROLE_KEY`: 관리자 액션, 업로드 API, 이벤트 저장 등에 사용하는 서버 전용 키

## 주요 스크립트

- `npm run dev`: 로컬 개발 서버 실행
- `npm run build`: 프로덕션 빌드 생성
- `npm run start`: 빌드 결과 실행
- `npm run lint`: ESLint 검사
- `npm run typecheck`: TypeScript 타입 검사
- `npm run check`: lint + typecheck
- `npm run check:prod`: lint + typecheck + build
- `npm run seed:supabase`: 시드 데이터 입력

## 로컬 실행 절차

1. `.env.local` 생성
2. Supabase 프로젝트 값 입력
3. `npm install`
4. `npm run dev`
5. 브라우저에서 `/`, `/admin/login`, `/api/health` 확인

## 배포 절차

기본 배포 대상은 Vercel입니다.

1. Vercel 프로젝트에 저장소 연결
2. 환경변수 3종 등록
3. Supabase Storage 버킷 생성
4. 배포 후 `/api/health` 확인
5. 관리자 로그인 확인
6. 콘텐츠 1건, 배너 1건 테스트 등록

## 운영 문서

- [이미지 업로드 가이드](c:/Users/USER/Desktop/KNS_Magazine/docs/admin-thumbnail-upload.md)
- [Health Check 운영 가이드](c:/Users/USER/Desktop/KNS_Magazine/docs/operations-health-check.md)
- [운영/배포 런북](c:/Users/USER/Desktop/KNS_Magazine/docs/operations-runbook.md)
- [마케팅팀 실사용 체크리스트](c:/Users/USER/Desktop/KNS_Magazine/docs/marketing-go-live-checklist.md)

## 현재 운영 원칙

- 무료 플랜 친화적으로 운영합니다.
- 이미지 업로드는 브라우저에서 먼저 압축합니다.
- 퍼블릭 원격 이미지는 브라우저 기본 렌더링을 우선 사용해 Vercel 이미지 최적화 비용을 줄입니다.
- `SUPABASE_SERVICE_ROLE_KEY`는 서버에서만 사용합니다.

## 알려진 리스크

- 관리자 화면에서 이미지를 업로드만 하고 저장 없이 이탈하면 임시 파일이 남을 수 있습니다.
- health endpoint는 lightweight 모드이므로 DB/Storage 깊은 진단은 하지 않습니다.
- seed/fallback 데이터와 일부 운영 문구는 이후 세션에서 더 다듬을 여지가 있습니다.

## 실사용 투입 전 최소 확인

1. `npm run check:prod`
2. `/api/health`
3. `/admin/login`
4. 콘텐츠 등록/수정
5. 배너 등록/수정
6. 홈/상세 페이지 이미지 노출
