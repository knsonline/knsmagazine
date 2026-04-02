# KNS 매거진 UTM 운영 가이드

이 문서는 운영자가 KNS 매거진 유입을 실무에서 바로 관리할 수 있도록 만든 간단한 기준서입니다.

## 먼저 알아둘 점

- 외부 채널에 공유할 때는 가능하면 UTM이 붙은 링크를 사용합니다.
- 콘텐츠, CTA, 배너의 원본 URL은 관리자에 그대로 입력해도 됩니다.
- KNS 매거진 안에서 외부 링크를 누를 때는 시스템이 자동으로 기본 UTM을 보강합니다.
- 관리자 브라우저는 기본적으로 통계 수집에서 제외됩니다.

## 각 항목의 의미

- `utm_source`
  - 어디서 들어왔는지
  - 예: `naver_cafe`, `youtube`, `qr`, `newsletter`
- `utm_medium`
  - 어떤 방식의 유입인지
  - 예: `community`, `video`, `offline`, `banner`, `cta`
- `utm_campaign`
  - 어떤 캠페인 묶음인지
  - 예: `2026_spring_open`, `middle_school_expo`, `april_parenting_push`
- `utm_content`
  - 같은 캠페인 안에서 어떤 위치나 소재인지
  - 예: `card_a`, `intro_link`, `shorts_desc`, `poster_qr_1`

## 추천 네이밍 규칙

- 전부 소문자 사용
- 공백 대신 `_` 사용
- 너무 길게 쓰지 말고 한눈에 이해되는 단어만 사용
- 날짜가 필요하면 앞에 붙입니다
  - 예: `2026_april_naver_cafe`

## 채널별 권장 예시

### 네이버 카페

- source: `naver_cafe`
- medium: `community`
- campaign: `2026_april_midterm_push`
- content: `post_main`

예시:

`https://kns-magazine.com/contents?utm_source=naver_cafe&utm_medium=community&utm_campaign=2026_april_midterm_push&utm_content=post_main`

### 유튜브 설명란

- source: `youtube`
- medium: `video`
- campaign: `2026_april_parent_guide`
- content: `description_link`

예시:

`https://kns-magazine.com/?utm_source=youtube&utm_medium=video&utm_campaign=2026_april_parent_guide&utm_content=description_link`

### 오프라인 QR 카드

- source: `qr`
- medium: `offline`
- campaign: `2026_middle_school_fair`
- content: `booth_card_a`

예시:

`https://kns-magazine.com/?utm_source=qr&utm_medium=offline&utm_campaign=2026_middle_school_fair&utm_content=booth_card_a`

### KNS 매거진 내부 CTA

- 원본 링크만 넣어도 됩니다.
- 시스템이 클릭 시점에 아래 값을 자동으로 붙입니다.
  - `utm_source=kns_magazine`
  - `utm_medium=cta`
- `utm_campaign`, `utm_content`는 현재 페이지와 버튼 위치 기준으로 자동 보강됩니다.

## 콘텐츠 / CTA / 배너 자동 부착 규칙

- 콘텐츠 외부 링크
  - `utm_source=kns_magazine`
  - `utm_medium=content`
- CTA 링크
  - `utm_source=kns_magazine`
  - `utm_medium=cta`
- 배너 링크
  - `utm_source=kns_magazine`
  - `utm_medium=banner`

기존 링크에 이미 UTM이 들어 있으면, 시스템은 없는 값만 채우고 기존 값은 유지합니다.

## 내부 테스트 트래픽 제외 방법

- 관리자 페이지에 한 번 접속하면 그 브라우저는 기본적으로 통계 수집에서 제외됩니다.
- 관리자 화면 오른쪽 아래의 분석 수집 설정에서 필요할 때만 테스트 수집을 다시 켤 수 있습니다.
- 운영 숫자를 최대한 깔끔하게 보려면, 평소 테스트는 제외 상태를 유지하는 것을 권장합니다.

## 운영 팁

- source는 채널명, medium은 방식, campaign은 묶음 이름, content는 상세 위치라고 생각하면 가장 쉽습니다.
- 같은 캠페인을 여러 곳에 올릴 때는 `utm_campaign`은 같게 두고 `utm_content`만 바꾸면 비교가 쉬워집니다.
- 너무 많은 규칙보다, 팀 안에서 같은 이름을 반복해서 쓰는 것이 더 중요합니다.
