# YUNN Mobile — 프로젝트 구조

> 인도 사용자 대상 모바일 피부 분석 설문 + 맞춤 루틴 결과 서비스  
> 순수 HTML/CSS/JS (빌드 도구 없음). 단일 페이지 앱(SPA) 구조.

---

## 디렉토리 트리

```
YUNN_Mobile/
├── index.html                  ← 홈/랜딩 페이지 (로그인 상태별 분기)
│
├── pages/
│   ├── survey.html             ← 핵심 앱 진입점 (인트로·설문·분석·결과 4화면 내장)
│   ├── landing.html            ← 마케팅 랜딩 페이지
│   ├── login.html              ← 로그인 UI (데모)
│   └── admin.html              ← 어드민 대시보드 (Google Sheets 연동)
│
├── js/
│   ├── domain/                 ← 순수 상수·데이터. 의존성 없음, 함수 없음
│   │   ├── AppConfig.js
│   │   ├── SkinType.js
│   │   ├── SurveyAnswer.js
│   │   ├── RoutineConfig.js
│   │   └── RoutineDatabase.js
│   │
│   ├── repository/             ← 외부 I/O 추상화. domain만 참조
│   │   ├── SessionRepository.js
│   │   ├── SurveyRepository.js
│   │   └── SheetRepository.js
│   │
│   ├── service/                ← 비즈니스 로직. domain·repository 참조
│   │   ├── SurveyService.js
│   │   ├── ResultService.js
│   │   ├── AnalyticsService.js
│   │   └── FeedbackService.js
│   │
│   └── ui/                     ← DOM 조작·이벤트. 마크업·계산 없음
│       ├── IntroScreen.js
│       ├── SurveyScreen.js
│       ├── ResultScreen.js
│       ├── ModalManager.js
│       └── templates/          ← <template> 태그 클론 + 데이터 주입만
│           ├── BalanceRowTemplate.js
│           ├── RoutineCardTemplate.js
│           └── ProductCardTemplate.js
│
├── styles/
│   ├── base.css                ← CSS 변수·리셋·전역 body
│   ├── components.css          ← 버튼·헤더·사이드바·모달 공통
│   ├── survey.css              ← 인트로·설문 전용 스타일
│   └── result.css              ← 결과 화면 전용 스타일
│
├── assets/
│   └── image/                  ← 제품·모델·스킨타입·로고 이미지
│
├── scripts/                    ← 개발용 Python 자동화 스크립트 (운영 무관)
│   ├── admin.js
│   ├── fix_buttons.py
│   ├── fix_ui_bugs.py
│   ├── modify_survey_ui.py
│   ├── remove_bg.py
│   ├── remove_bg_single.py
│   ├── remove_status_bar.py
│   └── update_intro.py
│
├── generators/                 ← HTML 생성기 (레거시, 현재 미사용)
│   ├── generate_survey_v2.py
│   ├── survey_gen.py
│   └── survey_gen_fixed.py
│
├── docs/                       ← 기획·설계·운영 문서
│   ├── PROJECT_STRUCTURE.md    ← 이 파일
│   ├── PRD.md
│   ├── DESIGN-SYSTEM.md
│   ├── ANALYTICS-LOGGING.md
│   ├── GTM-GA4-SETUP.md
│   ├── FEEDBACK-GATE-SETUP.md
│   ├── YUNN-SKIN-TYPE-MATRIX.md
│   ├── SURVEY-QUESTIONS.md
│   ├── API.md
│   ├── ADMIN.md
│   ├── IMPLEMENTATION-LOG.md
│   ├── TROUBLESHOOTING.md
│   ├── AI-WORK-RULES.md
│   ├── BACKUP-POLICY.md
│   ├── GITHUB-COLLABORATION-WORKFLOW.md
│   ├── files/                  ← 코드 분리 작업 명세
│   │   ├── REFACTOR_SPEC.md
│   │   ├── data.page.md
│   │   ├── intro.page.md
│   │   ├── survey.page.md
│   │   ├── result.page.md
│   │   └── modals.page.md
│   ├── survey/                 ← 초기 설계 문서 (레거시)
│   └── code-backups/           ← 날짜별 HTML 스냅샷 백업
│
└── archive/                    ← 미사용 파일 보관
```

---

## 핵심 파일 상세

### pages/survey.html — 938줄

앱의 단일 진입점. 4개 화면이 하나의 HTML 파일 안에 공존하며 JS로 전환한다.

| 화면 | ID | 전환 조건 |
|------|-----|----------|
| 인트로 | `#intro-screen` | 기본 표시 |
| 설문 (10스텝) | `#survey-screen` | Start 버튼 클릭 |
| 분석 중 | `#analysis-screen` | Step 10 완료 |
| 결과 | `#result-screen` | 분석 완료 |

**`<template>` 태그** 3개 포함 (JS가 클론해서 사용):
- `#tpl-balance-row` — 피부 밸런스 행
- `#tpl-routine-card` — 루틴 카드
- `#tpl-product-card` — 추천 상품 카드

---

## JS 모듈 의존성

```
domain          (의존성 없음)
  ↑
repository      (domain만 참조)
  ↑
service         (domain + repository 참조)
  ↑
ui/templates    (service만 참조)
  ↑
ui              (domain + repository + service + templates 참조)
```

> 역방향 import 금지. UI → Domain 방향만 허용.

---

## JS 파일별 역할

### domain 레이어

| 파일 | 줄 수 | 역할 |
|------|-------|------|
| `AppConfig.js` | 25 | URL·스토리지 키·애널리틱스 상수 |
| `SkinType.js` | 26 | 피부 타입 정의·헬퍼 서브플로우 추론 규칙 |
| `SurveyAnswer.js` | 27 | 각 스텝 선택지 값·이메일/전화 유효성 상수 |
| `RoutineConfig.js` | 317 | 결과 화면 에셋·카피·추천 설정·상품 4종 |
| `RoutineDatabase.js` | 279 | 성별·고민·피부타입 16개 조합 상세 루틴 스텝 (현재 미연결) |

### repository 레이어

| 파일 | 줄 수 | 역할 |
|------|-------|------|
| `SessionRepository.js` | 43 | localStorage 래퍼 + 세션 ID 생성/조회 |
| `SurveyRepository.js` | 18 | 결과 재진입용 설문 데이터 임시 저장 |
| `SheetRepository.js` | 18 | Google Sheets GET 픽셀 트릭 전송 |

### service 레이어

| 파일 | 줄 수 | 역할 |
|------|-------|------|
| `SurveyService.js` | 188 | 스텝 완료 판단·유효성 검사·피부타입 추론·설문 페이로드 수집 |
| `ResultService.js` | 106 | 결과 config 조회·밸런스 점수 계산·요약 포맷 |
| `AnalyticsService.js` | 655 | GTM 이벤트·스크롤 추적·마찰 감지·설문 분석 |
| `FeedbackService.js` | 131 | 피드백 잠금 해제 흐름·Google Form URL 빌드·로컬 검증 상태 |

### ui 레이어

| 파일 | 줄 수 | 역할 |
|------|-------|------|
| `IntroScreen.js` | 192 | 인트로 화면 이벤트·사이드바·모바일 상태바(시간·배터리·네트워크) |
| `SurveyScreen.js` | 442 | 설문 스텝 이동·진행 바·옵션 카드 선택·사진 업로드·Sheets 전송 트리거 |
| `ResultScreen.js` | 252 | 결과 화면 렌더링·루틴 탭 전환·잠금 해제 상태·공유·재시작 |
| `ModalManager.js` | 214 | Beta 서비스 모달·피드백 게이트 모달·장바구니 클릭 이벤트 |

### ui/templates 레이어

`<template>` 태그를 `cloneNode(true)`로 복사해 데이터만 주입. JS에 HTML 태그 문자열 없음.

| 파일 | 줄 수 | 생성하는 노드 |
|------|-------|------------|
| `BalanceRowTemplate.js` | 11 | `.balance-row` — 피부 밸런스 지표 1행 |
| `RoutineCardTemplate.js` | 16 | `.routine-card` — 루틴 스텝 카드 |
| `ProductCardTemplate.js` | 16 | `.product-card` — 추천 상품 카드 |

---

## CSS 파일별 역할

| 파일 | 줄 수 | 담당 |
|------|-------|------|
| `base.css` | 34 | Pretendard 폰트 import·`:root` 변수·`*` 리셋·`body` |
| `components.css` | 650 | 버튼·공통 헤더·사이드바·Beta 모달·피드백 게이트 모달 |
| `survey.css` | 1,287 | 인트로 화면·설문 진행 바·옵션 카드·10개 스텝 전용 레이아웃 |
| `result.css` | 1,071 | 결과 헤더·밸런스 카드·루틴 카드·상품 카드·잠금 프리뷰·하단 탭 |

---

## 화면 흐름

```
index.html (홈)
    ↓ "Start My Skin Analysis" 클릭
pages/survey.html
    ├── [인트로 화면]
    │       ↓ Start 버튼
    ├── [설문 10스텝]
    │       Step 1: 이름·이메일·WhatsApp
    │       Step 2: 성별·나이  (자동 진행)
    │       Step 3: 피부 타입  → NotSure 선택 시 3-1~3-4 헬퍼 서브플로우
    │       Step 4: 주요 고민 (Acne / Marks / Pigmentation / Tone)
    │       Step 5: 트리거 (복수 선택)
    │       Step 6: 민감도
    │       Step 7: 자외선 노출·선크림 사용  (자동 진행)
    │       Step 8: 수면·스트레스  (자동 진행)
    │       Step 9: 루틴 레벨
    │       Step 10: 피부 사진 업로드 (선택)
    │               ↓ Complete Analysis / Skip
    ├── [분석 중 화면]  (2.4초 메시지 루프)
    │       ↓
    └── [결과 화면]
            ├── 피부 타입명 + 키워드
            ├── 밸런스 지표 4개
            ├── 아침/저녁 루틴 탭
            ├── 추천 상품 4종
            └── 루틴 잠금 해제 (피드백 게이트)
                    ↓ Google Form 작성 후 복귀
                    └── 전체 루틴 공개
```

---

## 외부 연동

| 서비스 | 용도 | 방식 |
|--------|------|------|
| Google Sheets (Apps Script) | 설문 응답 수집 | GET + 이미지 픽셀 트릭 |
| Google Tag Manager (`GTM-P2NX3N5K`) | 이벤트 애널리틱스 | `window.dataLayer.push` |
| Google Form | 피드백 수집 (잠금 해제 조건) | `window.open` 새 탭 |
| Phosphor Icons CDN | 아이콘 라이브러리 | `<script>` 태그 |
| Pretendard CDN | 한국어·영어 폰트 | `@import` CSS |

---

## 주요 URL 파라미터 (survey.html)

| 파라미터 | 동작 |
|----------|------|
| `?survey` | 설문 화면 바로 시작 |
| `?step=N` | 특정 스텝으로 바로 이동 |
| `?resultDemo` | 결과 화면 바로 표시 (데모용) |
| `?returnFromSurvey` | 피드백 Form 복귀 후 잠금 해제 시도 |

---

## 알려진 MVP 한계

| 항목 | 현재 상태 |
|------|---------|
| 피드백 검증 자동화 | `YUNN_FEEDBACK_VERIFY_URL` 미설정 → 수동 해제만 가능 |
| Sheets 전송 확인 | GET 픽셀 방식으로 성공/실패 확인 불가 |
| 피부 사진 AI 분석 | 업로드만 가능, Vision API 미연동 |
| 남성 루틴 데이터 | `RoutineDatabase.js`에 정의됨, 결과 화면 미연결 |
| 이메일 도메인 | 인도 7개 도메인만 허용 (기업 이메일 불가) |
