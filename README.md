# YUNN - K-뷰티 맞춤형 스킨케어 MVP
인도 델리 2030 여성을 위한 AI 피부 진단 및 루틴 관리 웹앱입니다.

## 프로젝트 개요
인도인들의 여드름 문제와 색소침착을 K-뷰티 제품으로 해결하고, 화장품 추천을 넘어 **올바른 스킨케어 루틴**을 제공하는 서비스입니다. 매일 접속하여 루틴을 따라 할 수 있도록 설계되었습니다.

## 실행 방법
1. 이 프로젝트 폴더를 로컬 컴퓨터에 다운로드합니다.
2. `index.html` 파일을 크롬 등 최신 웹 브라우저에 드래그 앤 드롭해서 엽니다.
3. (추천) VS Code를 사용 중이라면, **Live Server** 익스텐션을 설치하여 실행하면 더 원활한 테스트가 가능합니다.

## 사용 기술 (Tech Stack)
- HTML5 (시맨틱 마크업)
- Vanilla CSS (순수 CSS, 외부 프레임워크 미사용)
- Vanilla JavaScript (순수 JS, 로컬 스토리지 활용)

## 문서 안내
- [PRD (제품 요구사항 정의서)](docs/PRD.md)
- [API (내부 로직 명세서)](docs/API.md)
- [TROUBLESHOOTING (문제 해결)](docs/TROUBLESHOOTING.md)
- [DESIGN SYSTEM (디자인 시스템 규칙)](docs/DESIGN-SYSTEM.md)
- [IMPLEMENTATION LOG (작업 변경 기록)](docs/IMPLEMENTATION-LOG.md)
- [BACKUP POLICY (백업 규칙)](docs/BACKUP-POLICY.md)
- [GITHUB COLLABORATION WORKFLOW (협업/버전관리 규칙)](docs/GITHUB-COLLABORATION-WORKFLOW.md)
- [AI WORK RULES (AI 작업 규칙)](docs/AI-WORK-RULES.md)

## 폴더 구조 (Directory Structure)
```
YUNN_Mobile/
├── index.html            # 홈 화면 진입 파일
├── pages/                # 세부 HTML 화면
│   ├── survey.html       # 피부 진단/설문 화면
│   ├── login.html        # 로그인 화면
│   └── landing.html      # 브랜드/랜딩 화면
├── docs/                 # 프로젝트 관련 명세서 및 가이드라인
│   ├── DESIGN-SYSTEM.md  # 컬러, 폰트, 공통 컴포넌트 규칙
│   ├── PRD.md            # 제품 기획서
│   ├── API.md            # 로컬 스토리지/외부 API 연동 문서
│   └── TROUBLESHOOTING.md
└── assets/image/         # 이미지 에셋 폴더
```

# YUNN Mobile — Claude Code 가이드

이 파일은 Claude Code가 YUNN 프로젝트를 작업할 때 참조하는 컨텍스트 문서입니다.

---

## 프로젝트 개요

인도 델리 2030 상위층 여성을 타깃으로 한 K-뷰티 맞춤 스킨케어 MVP 웹 서비스.
피부 진단 설문 → 루틴 추천 → 14일 루틴 트래킹 → Before/After 비교가 핵심 플로우.

**타깃 KPI**
- KPI 1: 설문 완료율 70% 이상
- KPI 2: 루틴 실행 의향 및 재방문 (알림 확인율 50% 이상)
- KPI 3: 추천 의향 및 성과 체감 (2주 재방문율 30% 이상)

**MVP 핵심 질문 4가지**
1. 사용자가 루틴을 시작하는가?
2. 사용자가 매일 다시 방문하는가?
3. 사용자가 루틴을 실제 수행하는가?
4. 사용자가 개선 체감을 기록하는가?

---

## 기술 스택

- 순수 HTML / CSS / Vanilla JS (프레임워크 없음)
- ES Module 원본 → `scripts/` 번들로 배포 (ES Module은 `file://` 미지원)
- localStorage 기반 데이터 저장 (백엔드 DB 없음, MVP)
- Google Sheets (Apps Script) — 리드 수집
- Google Tag Manager / GA4 — 행동 분석

---

## 파일 구조

```
YUNN_Mobile/
├── index.html                  홈 화면 (쇼핑 + 히어로)
├── pages/
│   ├── survey.html             피부 진단 + 결과 화면 (SPA)
│   ├── routine.html            루틴 트래킹 화면 (SPA) ← 미구현
│   ├── login.html              로그인
│   └── landing.html            마케팅 랜딩
├── scripts/
│   ├── home.js                 index.html 전용 번들
│   ├── survey.js               survey.html 전용 번들 (21개 모듈 통합)
│   └── routine.js              routine.html 전용 번들 ← 미구현
├── js/
│   ├── app.js                  survey.html 진입점
│   ├── routine.js              routine.html 진입점 ← 미구현
│   ├── domain/
│   │   ├── AppConfig.js        상수·키·엔드포인트·정책값 (모든 Config 이 파일에서 관리)
│   │   ├── SurveyAnswer.js     허용 이메일 도메인 등
│   │   ├── SkinType.js         피부타입 상수·스텝 매핑
│   │   ├── RoutineConfig.js    결과 화면 에셋·카피·추천 설정·상품 데이터
│   │   ├── RoutineDatabase.js  성별·고민·피부타입별 상세 루틴 스텝 (routine.html에서 사용)
│   │   └── RoutineDomain.js    루틴 비즈니스 로직 ← 미구현
│   ├── repository/
│   │   ├── SessionRepository.js  localStorage 추상화 계층 (in-memory fallback)
│   │   ├── SheetRepository.js    Google Sheets 전송
│   │   ├── SurveyRepository.js   설문 결과 임시 저장
│   │   └── RoutineRepository.js  루틴 데이터 접근 계층 ← 미구현
│   ├── service/
│   │   ├── AnalyticsService.js   GTM 이벤트 추적 (루틴 이벤트 추가 예정)
│   │   ├── SurveyService.js      설문 유효성 검사
│   │   ├── ResultService.js      피부 진단 결과 계산
│   │   └── FeedbackService.js    피드백 게이트 로직
│   ├── ui/
│   │   ├── IntroScreen.js        인트로 화면
│   │   ├── SurveyScreen.js       설문 10스텝 흐름
│   │   ├── ResultScreen.js       결과 렌더링
│   │   ├── ModalManager.js       베타/피드백 모달
│   │   ├── RoutineScreen.js      루틴 메인 화면 ← 미구현
│   │   ├── ReminderModal.js      시간 기반 알림 모달 ← 미구현
│   │   ├── PhotoManager.js       사진 업로드·비교 ← 미구현
│   │   └── templates/            결과 카드 템플릿 3종
│   └── controller/
│       └── AppController.js      루틴 앱 초기화·라우팅 ← 미구현
├── styles/
│   ├── home.css
│   ├── survey.css
│   └── routine.css              ← 미구현
├── assets/image/               제품·모델 이미지
└── docs/
    ├── PRD.md
    ├── IMPLEMENTATION-LOG.md   작업 기록 (변경 시 반드시 업데이트)
    └── code-backups/           핵심 파일 수정 전 백업
```

---

## 번들링 규칙

- `js/` 하위 ES Module은 직접 `<script type="module">`로 사용하지 않는다.
- 새 화면을 만들 때: 관련 모듈을 의존성 순서대로 단일 파일로 연결 → `scripts/` 에 저장.
- 번들 생성 시 `import` / `export` 키워드 제거, `node --check`로 문법 검사 필수.
- 새로운 빌드 시스템 도입 금지. 기존 Node.js 번들 스크립트 방식 유지.
- 이유: `file://` 프로토콜 및 일부 정적 배포 환경에서 ES Module CORS 차단 발생.

---

## localStorage 키 목록

| 키 | 타입 | 내용 |
|---|---|---|
| `yunn_session_id` | string | UUID 세션 ID |
| `yunn_pending_result_data` | JSON | 설문 결과 `{ skinType, concernType, gender, name, email }` |
| `yunn_feedback_verified` | string | 피드백 게이트 검증 여부 |
| `yunn_analytics_events` | JSON array | 분석 이벤트 최대 1000건 |
| `yunn_routine_start` | string | 루틴 시작일 `"YYYY-MM-DD"` ← 미구현 |
| `yunn_routine_checks` | JSON | 일자별 스텝 체크 (아래 데이터 구조 참조) ← 미구현 |
| `yunn_photo_before` | JSON | `{ dataUrl: "data:image/jpeg;base64,...", date: "YYYY-MM-DD" }` ← 미구현 |
| `yunn_photo_after` | JSON | `{ dataUrl: "data:image/jpeg;base64,...", date: "YYYY-MM-DD" }` ← 미구현 |
| `yunnUser` | JSON | `{ nickname }` 로그인 사용자 정보 |

---

## routine.html 아키텍처 설계

> 상태: **미구현** — 설계 확정, 구현 대기
> 마지막 설계 검토: 2026-06-23

---

### 핵심 설계 원칙

1. **기존 구조 유지** — `src/` 신규 생성 금지. 기존 `js/` 폴더 구조 그대로 확장.
2. **중복 계층 금지** — `SessionRepository`를 저장소 추상화로 재사용. `StorageService` 신규 생성 금지.
3. **단일 책임 원칙** — 각 클래스는 하나의 역할만 가진다.
4. **Config 중앙화** — 모든 정책값은 `AppConfig.js`에서 관리. 하드코딩 금지.
5. **Analytics 중앙화** — GTM 코드 분산 금지. `AnalyticsService` 확장 사용. `AnalyticsManager` 신규 생성 금지.
6. **의존성 방향 고정** — `Screen → Domain → Repository → SessionRepository → localStorage`. 하위 계층이 상위를 참조하면 안 된다.

---

### MVP 범위

**포함**
- RoutineDomain (날짜·데이터 로직)
- RoutineScreen (체크리스트 + 진행률 + Daily Streak)
- ReminderModal (접속 시간 기반 알림)
- PhotoManager (Before/After 사진 + 비교 화면)
- Analytics Event Tracking (AnalyticsService 확장)

**제외 (MVP 이후)**
- Web Push / Service Worker / PushManager
  - 이유: iOS Safari 16.4 미만 미지원, 권한 허용률 10~15%, 구현 비용 대비 검증 가치 낮음
  - 대안: ReminderModal (접속 시 시간 체크) + WhatsApp 수동 리마인더
  - WhatsApp: 설문에서 번호 이미 수집 중, 인도 사용자 사용률 90%+

---

### 의존성 계층

```
AppController
 ↓
RoutineScreen / ReminderModal / PhotoManager
 ↓
RoutineDomain
 ↓
RoutineRepository
 ↓
SessionRepository
 ↓
localStorage
```

---

### 화면 구조 (4개 스크린, SPA)

```
routine.html
│
├── #guard-screen      진단 미완료 → "Take the quiz" CTA
├── #start-screen      루틴 첫 시작 → Before 사진 촬영
├── #routine-screen    메인 루틴 화면 (Day 카운터 + 체크리스트 + Streak)
└── #compare-screen    Day 14+ After 사진 완료 → Before/After 나란히 비교
```

**화면 전환 조건 (AppController 책임)**

```
접속
 │
 ├─ 진단 결과 없음 ────────────────────────── #guard-screen
 ├─ 루틴 시작일 없음 ──────────────────────── #start-screen
 ├─ Day 1~13 ──────────────────────────────── #routine-screen
 └─ Day 14+
      ├─ After 사진 있음 ─────────────────── #compare-screen
      └─ After 사진 없음 ─────────────────── #routine-screen (After 업로드 배너 표시)
```

---

### 클래스 책임

**AppController** — 앱 초기화 및 화면 라우팅만 담당
```
역할
- 앱 시작
- 의존 객체 생성 및 연결 (setDeps 패턴, 기존 app.js 방식 동일)
- 사용자 상태 확인
- 표시할 화면 결정
- 화면 전환

비역할
❌ 날짜 계산
❌ localStorage 저장
❌ GTM 전송
❌ 루틴 생성
❌ 사진 저장
```

**RoutineDomain** — 순수 비즈니스 로직 (DOM·저장·GTM 없음)
```
역할
- getDay()                  루틴 몇 일차인지 (1-indexed)
- getDayKey()               "YYYY-MM-DD" 오늘 키
- getRoutineSteps()         RoutineDatabase에서 스텝 배열 조회
- isStepChecked(date, period, i)   특정 스텝 완료 여부
- setStepChecked(date, period, i)  완료 처리
- getProgress(date, period)        완료 스텝 수 / 전체 스텝 수
- getStreak()               연속 수행일 (morning 또는 evening 하나라도 완료 = 유지)
- isBeforeAfterUnlocked()   Day >= CONFIG.BEFORE_AFTER_UNLOCK_DAY

비역할
❌ DOM 조작
❌ 저장 (SessionRepository 직접 접근 금지)
❌ GTM 전송
```

**RoutineRepository** — 루틴 전용 데이터 접근 계층 (SessionRepository를 통해서만 저장)
```
역할
- getRoutineStart()     루틴 시작일 조회
- saveRoutineStart()    루틴 시작일 저장
- getChecks()           일자별 체크 상태 전체 조회
- saveChecks()          일자별 체크 상태 저장
- getBeforePhoto()      Before 사진 조회
- saveBeforePhoto()     Before 사진 저장
- getAfterPhoto()       After 사진 조회
- saveAfterPhoto()      After 사진 저장

비역할
❌ Day 계산
❌ 진행률 계산
❌ DOM 렌더링
❌ GTM 이벤트 전송
❌ localStorage 직접 접근 (반드시 SessionRepository 경유)
```

**RoutineScreen** — 화면 렌더링만 담당
```
역할
- init()
- renderDay()               "Day 5 / 14" 표시
- renderStreak()            "🔥 3 Day Streak" Routine Screen 상단 표시
- renderSteps(steps, period) 아침/저녁 스텝 카드 생성
- handleCheck(period, i)    체크 → RoutineDomain.setStepChecked() → Analytics → renderProgress()
- renderProgress()          "3/5 steps done" 진행률 업데이트

비역할
❌ 비즈니스 로직 처리
❌ 직접 데이터 저장
```

**ReminderModal** — 시간 기반 루틴 알림 모달
```
shouldShow()    CONFIG 시간 범위 내이고 sessionStorage 미표시인 경우 true
show(period)    "Good morning ☀️" / "Good evening 🌙" 모달 표시
dismiss()       sessionStorage 플래그로 이 세션 재표시 방지
```

**PhotoManager** — 사진 업로드 및 Before/After 비교
```
captureBefore()   <input type=file> → JPEG 0.5 압축 → RoutineRepository.saveBeforePhoto()
captureAfter()    <input type=file> → JPEG 0.5 압축 → RoutineRepository.saveAfterPhoto()
renderCompare()   두 이미지 나란히 배치 + 날짜 라벨 + 축하 애니메이션
```

---

### Config 정책값 (AppConfig.js에 추가)

```js
// 하드코딩 금지. 아래 상수만 사용할 것.
BEFORE_AFTER_UNLOCK_DAY: 14,   // After 사진 업로드 잠금 해제 기준일
MORNING_START_HOUR: 6,         // 아침 알림 시작 시각
MORNING_END_HOUR: 10,          // 아침 알림 종료 시각
EVENING_START_HOUR: 20,        // 저녁 알림 시작 시각
EVENING_END_HOUR: 23,          // 저녁 알림 종료 시각
```

---

### 데이터 구조

**`yunn_routine_checks` — 스텝별 배열**
```js
// morning/evening 각각 스텝 수만큼 boolean 배열
// → 이탈 지점 분석 가능 (Cleanser 완료율 vs Sunscreen 완료율 등)
{
  "2026-06-23": {
    morning: [true, true, false, true],
    evening: [true, false, false]
  }
}
```

**사진 저장 — JPEG 압축 필수**
```js
// 저장 전 JPEG 0.5 압축 (localStorage ~5MB 제한 대응)
// 원본 5~15MB → 압축 후 약 300KB~1MB
// canvas.toDataURL('image/jpeg', 0.5) 사용
// IndexedDB는 MVP 이후 적용
{ dataUrl: "data:image/jpeg;base64,...", date: "YYYY-MM-DD" }
```

**Streak 완료 기준**
```
morning 또는 evening 중 하나라도 완료(배열에 true 1개 이상) = streak 유지
둘 다 미완료 = streak 초기화
```

---

### Analytics 이벤트 (AnalyticsService 확장)

`AnalyticsManager` 신규 생성 금지. 기존 `AnalyticsService.js`에 루틴 이벤트 메서드 추가.

```js
// AnalyticsService.js에 추가할 메서드들
trackYunnEvent('routine_started',        { day: 1, skinType, concernType })
trackYunnEvent('routine_step_checked',   { day, period, step, stepName })   // stepName 필수
trackYunnEvent('morning_completed',      { day })
trackYunnEvent('evening_completed',      { day })
trackYunnEvent('before_photo_uploaded',  { day: 1 })
trackYunnEvent('after_photo_uploaded',   { day })
trackYunnEvent('compare_viewed',         { day, streakDays })
```

> `routine_step_checked`에 `stepName` 필수 포함.
> step 번호만으로는 "클렌저 완료율 vs 선크림 완료율" 비교 분석 불가.

---

### 금지사항

```
❌ src/ 구조 신규 도입
❌ StorageService 신규 생성
❌ AnalyticsManager 신규 생성
❌ AppConfig 중복 생성 (config/ 폴더 생성 금지)
❌ localStorage 직접 접근 (SessionRepository 경유 필수)
❌ AppController에 비즈니스 로직 작성
❌ GTM 코드 분산 배치 (AnalyticsService 경유 필수)
❌ Web Push / Service Worker (MVP 제외)
❌ 정책값 하드코딩 (AppConfig.js 상수 사용)
```

---

### 구현 파일 목록

| 파일 | 역할 | 상태 |
|---|---|---|
| `pages/routine.html` | 4개 스크린 마크업 (SPA) | 미구현 |
| `styles/routine.css` | 루틴 화면 전용 스타일 | 미구현 |
| `js/domain/RoutineDomain.js` | 루틴 비즈니스 로직 | 미구현 |
| `js/repository/RoutineRepository.js` | 루틴 데이터 접근 계층 | 미구현 |
| `js/ui/RoutineScreen.js` | 메인 루틴 화면 | 미구현 |
| `js/ui/ReminderModal.js` | 시간 기반 알림 모달 | 미구현 |
| `js/ui/PhotoManager.js` | 사진 업로드·비교 | 미구현 |
| `js/controller/AppController.js` | 초기화·라우팅 | 미구현 |
| `js/routine.js` | routine.html 진입점 | 미구현 |
| `scripts/routine.js` | 위 파일 전체 번들 | 미구현 |
| `js/domain/AppConfig.js` | Config 정책값 추가 | 수정 필요 |
| `js/service/AnalyticsService.js` | 루틴 이벤트 메서드 추가 | 수정 필요 |

### 구현 우선순위

| 순서 | 기능 | KPI 기여 |
|---|---|---|
| 1 | RoutineDomain + RoutineRepository + RoutineScreen | KPI 2 직결 |
| 2 | Analytics (AnalyticsService 확장 + 이벤트 7개) | KPI 1,2,3 모두 |
| 3 | Daily Streak 표시 | KPI 2 |
| 4 | PhotoManager — Before 사진 업로드 | KPI 3 직결 |
| 5 | PhotoManager — After 사진 + Compare Screen | KPI 3 |

---

## 작업 규칙

- 코드 수정 후 `docs/IMPLEMENTATION-LOG.md`에 반드시 기록한다.
- 핵심 화면 파일 크게 수정 시 `docs/code-backups/YYYY-MM-DD/`에 백업 사본을 남긴다.
- GTM 인라인 스크립트는 항상 `<head>` 최상단에 위치한다 (GTM 공식 권장).
- `<script type="module">`은 사용하지 않는다. 반드시 번들 후 `<script defer>`로 로드한다.
- 이미지 경로는 `assets/image/` 기준, 파일명 공백 없이 사용한다.
