# 운영/배포 런북

## 1. 처음 세팅하는 사람용 순서

1. Supabase 프로젝트 준비
2. Auth에 관리자 계정 생성
3. Storage 버킷 `thumbnails`, `banners` 생성
4. Vercel 환경변수 등록
5. 첫 배포 실행
6. `/api/health` 확인
7. 관리자 로그인 확인
8. 콘텐츠/배너 테스트 등록

## 2. Supabase 설정

### Auth

- 관리자 계정은 Supabase Auth 이메일/비밀번호 방식으로 생성합니다.
- 별도 멀티 권한 체계는 현재 MVP 범위 밖입니다.

### Storage

- `thumbnails`: public
- `banners`: public

운영 원칙:

- 콘텐츠 썸네일은 `thumbnails`
- 이벤트/설명회 배너는 `banners`
- 업로드 전 브라우저 압축 사용
- 민감 정보가 담긴 이미지는 업로드 금지

## 3. Vercel 환경변수

필수:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

배포 후 확인:

1. `/api/health`
2. `/`
3. `/admin/login`

## 4. 배포 전 점검 루틴

개발자가 배포 전에 실행할 것:

1. `npm run check`
2. 필요 시 `npm run seed:supabase`
3. 최종적으로 `npm run check:prod`

권장 기준:

- `check` 실패 시 배포 보류
- `check:prod` 실패 시 배포 금지

## 5. 운영 중 수동 점검 루틴

마케팅팀이 확인할 경로:

1. `/api/health`
2. `/`
3. `/admin/login`
4. 관리자 콘텐츠 목록
5. 관리자 배너 목록

확인 포인트:

- health status가 `ok`
- 홈이 정상 노출
- 대표 콘텐츠/최신 콘텐츠 노출
- 배너 이미지 깨짐 없음
- 관리자 로그인 가능

## 6. 이미지 관련 운영 포인트

- 새 콘텐츠 업로드 후 이미지가 홈과 상세에 노출되는지 확인
- 새 배너 업로드 후 상단 프로모션/배너 섹션에서 노출되는지 확인
- 이미지 업로드 후 저장 실패가 반복되면 Supabase Storage 버킷과 권한부터 확인

## 7. 문제가 생겼을 때 가장 먼저 볼 것

1. Vercel 환경변수 누락 여부
2. `/api/health` 응답 상태
3. Supabase 프로젝트 일시중지 여부
4. Storage 버킷 존재 여부
5. 관리자 계정 로그인 가능 여부

## 8. 현재 구조상 솔직한 한계

- health endpoint는 lightweight라 DB 실조회 장애까지는 잡지 않습니다.
- 관리자 업로드 중 저장 없이 이탈하면 임시 파일이 남을 수 있습니다.
- 운영자가 실수로 잘못된 외부 링크를 넣으면 자동 검수는 현재 없습니다.
