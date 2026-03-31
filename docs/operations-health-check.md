# Health Check 운영 가이드

## 목적

- 운영자가 서비스 기본 응답 상태를 가장 간단하게 확인할 수 있도록 합니다.
- 외부 모니터링 툴에서 가볍게 ping할 수 있는 경로를 제공합니다.
- DB나 Storage를 불필요하게 조회하지 않아 무료 플랜 비용을 최대한 아낍니다.

## 확인 경로

- 브라우저 수동 확인: `/api/health`
- 예시: `https://kns-magazine.com/api/health`

## 응답 형식

`/api/health`는 JSON으로 응답합니다.

```json
{
  "status": "ok",
  "service": "kns-magazine",
  "mode": "lightweight",
  "timestamp": "2026-03-31T12:00:00.000Z",
  "checks": {
    "app": "ok",
    "supabaseEnv": "configured",
    "database": "skipped",
    "storage": "skipped"
  }
}
```

## 상태 해석

- `status: ok`
  - 앱이 정상 응답 중입니다.
  - health endpoint는 가볍게 살아 있습니다.
- `status: degraded`
  - 프로덕션에서 필수 Supabase 환경변수가 빠졌을 가능성이 큽니다.
  - 운영자가 Vercel 환경변수를 먼저 확인해야 합니다.

## UptimeRobot 등록 방법

1. UptimeRobot에서 `Add New Monitor`를 선택합니다.
2. Monitor Type은 `HTTP(s)`를 선택합니다.
3. URL에는 `https://실서비스도메인/api/health`를 입력합니다.
4. Friendly Name은 `KNS Magazine Health`처럼 알아보기 쉽게 적습니다.
5. 체크 주기는 `30분`을 권장합니다.

## 권장 ping 주기

- 기본 권장: `30분`
- 더 자주 확인이 꼭 필요할 때만 `15분`
- `5분` 같은 과도한 ping은 무료 플랜 기준에서는 권장하지 않습니다.

## 운영자 수동 점검 체크리스트

1. 브라우저에서 `/api/health` 접속
2. `status`가 `ok`인지 확인
3. `checks.supabaseEnv`가 `configured`인지 확인
4. 홈페이지 `/`가 정상 열리는지 확인
5. 관리자 로그인 `/admin/login`이 정상 열리는지 확인

## 주의사항

- 이 endpoint는 intentionally lightweight입니다.
- DB/Storage를 직접 조회하지 않으므로, 깊은 장애 진단용이 아니라 기본 생존 확인용입니다.
- 실제 운영 이슈가 의심되면 `/api/health` 확인 후 퍼블릭 홈과 관리자 로그인 화면까지 같이 확인하는 것이 가장 단순하고 안전합니다.
