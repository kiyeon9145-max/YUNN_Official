# REFACTOR_SPEC.md — YUNN 코드 분리 최종 명세

> 목적: `pages/survey.html` 단일 파일 (6,645줄) → 28개 파일 분리
> 작업 원칙: 기존 동작 100% 유지, 구조만 분리
> 각 파일은 별도의 페이지 명세 md를 함께 가진다

---

## 0. 절대 원칙

1. **기존 로직을 수정하지 않는다.** 변수명·함수명·동작을 그대로 유지한다.
2. **파일당 목표 줄 수**: 200~250줄. 불가피한 경우 최대 400줄.
3. **1 파일 = 1 화면 = 1 역할.** HTML은 마크업만, CSS는 스타일만, JS는 로직만.
4. **JS에 HTML 문자열 없음.** 동적 HTML은 `js/ui/templates/`에서만 생성한다.
5. **inline onclick 제거.** HTML의 `onclick=` 속성을 모두 제거하고 JS에서 `addEventListener`로 대체한다.
6. **의존 방향 단방향**: `UI → Service → Repository → Domain`. 역방향 import 금지.
7. **분리 순서**: `domain → repository → service → ui/templates → ui → styles → html` 순서로 작업.

---

## 1. 최종 디렉토리 구조

```
yunn/
├── pages/
│   ├── intro.html              ← 인트로 화면 마크업만
│   ├── survey.html             ← 서베이 10스텝 마크업만
│   ├── result.html             ← 결과/분석 화면 마크업만
│   └── modals.html             ← 사이드바·베타·피드백 모달만
│
├── styles/
│   ├── base.css                ← CSS 변수·리셋·전역
│   ├── components.css          ← 버튼·공통 헤더·사이드바
│   ├── intro.css               ← 인트로 화면 전용
│   ├── survey.css              ← 서베이 화면 전용
│   ├── result.css              ← 결과 화면 전용
│   └── modals.css              ← 모달 전용 (베타·피드백)
│
├── js/
│   ├── domain/
│   │   ├── AppConfig.js        ← URL·상수·스토리지 키
│   │   ├── SkinType.js         ← 피부 타입 정의·추론 규칙
│   │   ├── SurveyAnswer.js     ← 선택지 목록·유효성 상수
│   │   ├── RoutineDatabase.js  ← 성별·고민·피부타입별 상세 루틴 스텝 (ROUTINE_DATABASE)
│   │   └── RoutineConfig.js    ← 결과 화면 에셋·카피·추천 설정·상품 데이터
│   │
│   ├── repository/
│   │   ├── SessionRepository.js  ← localStorage·세션 ID
│   │   ├── SurveyRepository.js   ← 설문 응답 임시저장
│   │   └── SheetRepository.js    ← Google Sheets 전송
│   │
│   ├── service/
│   │   ├── SurveyService.js      ← 유효성·스텝 판단·피부 추론
│   │   ├── ResultService.js      ← 점수 계산·루틴 조합
│   │   ├── AnalyticsService.js   ← GTM 이벤트·스크롤 추적
│   │   └── FeedbackService.js    ← 잠금 해제 흐름
│   │
│   └── ui/
│       ├── templates/
│       │   ├── RoutineCardTemplate.js   ← 루틴 카드 HTML 생성
│       │   ├── ProductCardTemplate.js   ← 상품 카드 HTML 생성
│       │   └── BalanceRowTemplate.js    ← 밸런스 행 HTML 생성
│       ├── IntroScreen.js        ← 인트로 화면 이벤트·DOM
│       ├── SurveyScreen.js       ← 서베이 스텝 이동·DOM
│       ├── ResultScreen.js       ← 결과 화면 렌더·DOM
│       └── ModalManager.js       ← 모달 열기·닫기·DOM
│
├── assets/
│   └── image/                  ← 이미지 (파일명 오타 수정 포함)
│
└── docs/
    ├── REFACTOR_SPEC.md        ← 이 파일
    ├── intro.page.md
    ├── survey.page.md
    ├── result.page.md
    ├── modals.page.md
    └── data.page.md
```

---

## 2. domain 레이어 (의존성 없음, 함수 없음)

### `js/domain/AppConfig.js` — 목표 80줄

원본 위치: `survey.html` 3917~3925줄, 4069~4075줄

```js
export const YUNN_FEEDBACK_FORM_URL = 'https://docs.google.com/forms/...';
export const YUNN_FEEDBACK_SESSION_ENTRY_ID = '';
export const YUNN_FEEDBACK_VERIFY_URL = '';
export const YUNN_FEEDBACK_RETURN_PARAM = 'returnFromSurvey';
export const YUNN_SHEET_ENDPOINT = 'https://script.google.com/macros/s/.../exec';
export const YUNN_GTM_ID = 'GTM-P2NX3N5K';
export const YUNN_ANALYTICS_STORAGE_KEY = 'yunn_analytics_events';
export const YUNN_ANALYTICS_MAX_EVENTS = 1000;
export const YUNN_ANALYTICS_ENDPOINT = '';
export const YUNN_SCROLL_THRESHOLDS = [25, 50, 75, 100];
export const YUNN_LONG_STAY_SECONDS = 45;
export const STORAGE_KEYS = {
  SESSION_ID:        'yunn_session_id',
  FEEDBACK_VERIFIED: 'yunn_feedback_verified',
  PENDING_RESULT:    'yunn_pending_result_data',
  ANALYTICS_EVENTS:  'yunn_analytics_events',
  CART_EVENTS:       'yunn_cart_events',
  BETA_EVENTS:       'yunn_beta_events',
};
```

---

### `js/domain/SkinType.js` — 목표 60줄

원본 위치: `survey.html` 5356~5392줄

```js
export const SKIN_HELPER_STEPS = ['3-1', '3-2', '3-3', '3-4'];
export const REQUIRED_STEP_INPUT_GROUPS = {
  '3': ['skinType'], '3-1': ['skinHelperCleanse'],
  '3-2': ['skinHelperAfterHours'], '3-3': ['skinHelperDay'],
  '3-4': ['skinHelperTexture'], '4': ['concerns'],
  '5': ['trigger'], '6': ['sensitivity'],
  '7': ['outdoor', 'sunscreen'], '8': ['sleep', 'stress'],
  '9': ['routineLevel'],
};
export const SKIN_INFERENCE_RULES = {
  DRY_MAX: 1.8, OILY_MIN: 4.2,
  COMBINATION_MIN: 2.6, T_ZONE_VALUE: 3,
};
```

---

### `js/domain/SurveyAnswer.js` — 목표 80줄

원본 위치: `survey.html` 5726~5735줄 (이메일), HTML 마크업 value 값들

선택지 상수 전체 export:
`ALLOWED_INDIAN_EMAIL_DOMAINS`, `PHONE_REGEX`, `GENDER_OPTIONS`,
`AGE_OPTIONS`, `SKIN_TYPE_OPTIONS`, `CONCERN_OPTIONS`, `TRIGGER_OPTIONS`,
`SENSITIVITY_OPTIONS`, `OUTDOOR_OPTIONS`, `SUNSCREEN_OPTIONS`,
`SLEEP_OPTIONS`, `STRESS_OPTIONS`, `ROUTINE_LEVEL_OPTIONS`

---

### `js/domain/RoutineDatabase.js` — 목표 275줄

원본 위치: `survey.html` 4758~5032줄

**수정 이유**: 루틴 내용(제품명·사용법)이 바뀔 때만 이 파일을 열면 된다.
결과 화면 UI·카피 변경과 무관하게 독립적으로 관리된다.

```js
// 성별(F/M) × 고민타입(A/P) × 피부타입(O/D/N/C) = 16개 조합
// 각 키: { title, morning[], out[], home[], evening[] }
export const ROUTINE_DATABASE = {
    "F-A-O": { ... },  // Female · Acne · Oily
    "F-A-D": { ... },  // Female · Acne · Dry
    "F-A-N": { ... },  // Female · Acne · Normal
    "F-A-C": { ... },  // Female · Acne · Combination
    "F-P-O": { ... },  // Female · Hyperpigmentation · Oily
    "F-P-D": { ... },  // Female · Hyperpigmentation · Dry
    "F-P-N": { ... },  // Female · Hyperpigmentation · Normal
    "F-P-C": { ... },  // Female · Hyperpigmentation · Combination
    "M-A-O": { ... },  // Male · Acne · Oily
    "M-A-D": { ... },  // Male · Acne · Dry
    "M-A-N": { ... },  // Male · Acne · Normal
    "M-A-C": { ... },  // Male · Acne · Combination
    "M-P-O": { ... },  // Male · Hyperpigmentation · Oily
    "M-P-D": { ... },  // Male · Hyperpigmentation · Dry
    "M-P-N": { ... },  // Male · Hyperpigmentation · Normal
    "M-P-C": { ... },  // Male · Hyperpigmentation · Combination
};
// 원본 코드 그대로 붙여넣기
```

**참고**: 현재 결과 렌더링에서 미사용. 향후 성별 파라미터를 결과 조회에 포함할 때 사용 예정.

---

### `js/domain/RoutineConfig.js` — 목표 440줄

원본 위치: `survey.html` 5034~5347줄

**수정 이유**: 결과 화면 카피·에셋·추천 로직이 바뀔 때만 이 파일을 열면 된다.
`ROUTINE_DATABASE`의 상세 루틴 스텝과 완전히 독립적으로 관리된다.

**`RoutineDatabase.js`를 import하지 않는다.** 두 파일은 서로 의존 없이 독립적이다.

```js
// 이 파일만 import하면 결과 화면에 필요한 모든 데이터를 얻을 수 있다.
// import { RoutineDatabase } from './RoutineDatabase.js'; ← 하지 않음
```

다음 5개 객체를 원본 그대로 export:

**1. RESULT_ASSETS** — 오타 수정 적용
```js
export const RESULT_ASSETS = {
    userFallbackFemale: '../assets/image/Woman_model_YUNN.png', // 수정: 공백 제거
    userFallbackMale:   '../assets/image/Man_model_YUNN.png',   // 수정: 공백 제거
    cleanser:           '../assets/image/Facewash_YUNN.png',
    serum:              '../assets/image/Serum_YUNN.png',       // 수정: YUMM → YUNN
    sunscreen:          '../assets/image/Sunscreen_YUNN.png',
    moisturiser:        '../assets/image/Moisturiser_YUNN.png', // 수정: Moisturies → Moisturiser
    cleanserCard:       '../assets/image/Facewash_top_selling.png',
    serumCard:          '../assets/image/Serum_top_selling.png',
    sunscreenCard:      '../assets/image/Sunscreen_YUNN.png',
    creamCard:          '../assets/image/Moisturiser_top_selling.png', // 수정: Moisturies → Moisturiser
};
```

**2. RESULT_COPY_VARIANTS** — 고민타입별 카피 (Acne / Marks / Pigmentation / Tone)
원본 5047~5089줄 그대로 export.

**3. RESULT_SKIN_VARIANTS** — 피부타입별 설정 (Oily / Dry / Combination / Normal)
원본 5090~5124줄 그대로 export.

**4. RESULT_RECOMMENDATION_CONFIG** — 4×4=16개 조합 빌드
원본 5125~5304줄 빌드 로직 그대로. `RESULT_TYPE_PROFILES` 병합까지 포함.

**5. RESULT_PRODUCTS** — 추천 상품 4종
원본 배열 그대로 export.

---

## 3. repository 레이어

### `js/repository/SessionRepository.js` — 목표 80줄

원본 위치: `survey.html` 3957~3980줄, 6421~6437줄

```js
import { STORAGE_KEYS } from '../domain/AppConfig.js';

// yunnMemoryStorage + yunnStorage 폴백 로직 (원본 그대로, 모듈 내부)
const yunnStorage = (() => { ... })();

export const getItem    = (key) => yunnStorage.getItem(key);
export const setItem    = (key, val) => yunnStorage.setItem(key, String(val));
export const removeItem = (key) => yunnStorage.removeItem(key);

export function getSessionId() {
  // 원본 getYunnSessionId() 로직 그대로
}
```

---

### `js/repository/SurveyRepository.js` — 목표 60줄

원본 위치: `survey.html` 6049~6065줄

```js
import { STORAGE_KEYS } from '../domain/AppConfig.js';
import { getItem, setItem } from './SessionRepository.js';

export function readPendingResult() { ... }
export function savePendingResult(data) { ... }
```

---

### `js/repository/SheetRepository.js` — 목표 50줄

원본 위치: `survey.html` 3926~3956줄

```js
import { YUNN_SHEET_ENDPOINT } from '../domain/AppConfig.js';

// collectSurveyPayload는 DOM을 읽으므로 SurveyService로 이동
export function sendToSheet(payload) {
  // 원본 GET + new Image().src CORS 우회 로직 그대로
}
```

---

## 4. service 레이어

### `js/service/SurveyService.js` — 목표 220줄

원본 위치: `survey.html` 5370~5480줄 (유효성), 5600~5650줄 (헬퍼 추론)

```js
import { REQUIRED_STEP_INPUT_GROUPS, SKIN_INFERENCE_RULES } from '../domain/SkinType.js';
import { ALLOWED_INDIAN_EMAIL_DOMAINS, PHONE_REGEX } from '../domain/SurveyAnswer.js';

// DOM 읽기 허용 (값 읽기), DOM 조작 금지
export function normalizeEmail(value) { ... }
export function isValidIndianMvpEmail(value) { ... }
export function hasAnsweredInputGroup(groupName) { ... }
export function isStepComplete(step) { ... }
export function isStepTwoComplete() { ... }
export function isStepSevenComplete() { ... }
export function isStepEightComplete() { ... }
export function isSkinHelperStep(step) { ... }
export function isCurrentSkinHelperStepComplete(step) { ... }

// helperValues: 숫자 배열 [cleanse, afterHours, day, texture]
export function inferSkinType(helperValues) {
  // 원본 inferSkinTypeFromHelper() 계산 로직만 추출
  // DOM 조작(라디오 체크)은 SurveyScreen.js에서 처리
}

// collectSurveyPayload: DOM 읽기만 수행
export function collectSurveyPayload(sessionId) { ... }
```

---

### `js/service/ResultService.js` — 목표 200줄

원본 위치: `survey.html` 5947~6110줄

```js
import { RESULT_RECOMMENDATION_CONFIG, RESULT_SKIN_VARIANTS } from '../domain/RoutineConfig.js';
// ROUTINE_DATABASE는 현재 미사용 — 필요 시 RoutineDatabase.js에서 import
import { readPendingResult } from '../repository/SurveyRepository.js';

export function escapeHTML(value) { ... }
export function getPrimaryConcernType(checkedValues) { ... }
export function getResultSurveyData() { ... }   // DOM 읽기 허용
export function getResultConfig(data) { ... }
export function getBalanceStatus(value) { ... }
export function computeSkinBalance(data, config) { ... }
export function formatResultSummary(config) { ... }
```

---

### `js/service/AnalyticsService.js` — 목표 350줄 (이벤트 설정 데이터 포함 불가피)

원본 위치: `survey.html` 4069~4726줄 (657줄)

**분리 기준**: 설정 데이터(STEP_ANALYTICS_CONFIG 156줄, INPUT_ANALYTICS_CONFIG 73줄)는
파일 상단에 위치시키되 export하지 않고 내부에서만 사용.

```js
import { YUNN_ANALYTICS_STORAGE_KEY, YUNN_ANALYTICS_MAX_EVENTS,
         YUNN_SCROLL_THRESHOLDS, YUNN_LONG_STAY_SECONDS } from '../domain/AppConfig.js';
import { getItem, setItem, getSessionId } from '../repository/SessionRepository.js';

// 내부 상수 (export 불필요)
const STEP_ANALYTICS_CONFIG = { ... };    // 원본 그대로 (156줄)
const INPUT_ANALYTICS_CONFIG = { ... };   // 원본 그대로 (73줄)

// 내부 상태
export const yunnAnalyticsState = { ... };

// 모두 export
export function getTrafficSource() { ... }
export function getDeviceType() { ... }
export function getNetworkType() { ... }
export function readAnalyticsEvents() { ... }
export function persistAnalyticsEvent(payload) { ... }
export function trackYunnEvent(eventName, properties) { ... }
export function getScreenKey(step) { ... }
export function getScrollPercent() { ... }
export function getCurrentStepSelectedValues(step) { ... }
export function getStepOptionList(step) { ... }
export function getStepCompletionStatus(step) { ... }
export function emitStepOptionView(step) { ... }
export function markAnalyticsScreen(screen, step) { ... }
export function emitCurrentScreenTime(reason) { ... }
export function emitPageAbandon(reason) { ... }
export function emitFrictionIfNeeded() { ... }
export function emitScrollDepth() { ... }
export function trackLandingView() { ... }
export function trackFirstInteraction(type) { ... }
export function trackSurveyStepView(step) { ... }
export function trackInputSelection(input, prev, next, isSelected) { ... }
export function trackStepNextClick(step) { ... }
export function trackStepBackClick(step) { ... }
export function setupAnalyticsObservers() { ... }
export function setupFieldAnalytics() { ... }
export function getSurveyUser() { ... }

// 전역 노출 (인라인 이벤트 제거 후에도 GTM 연동용)
window.trackYunnEvent = trackYunnEvent;
```

---

### `js/service/FeedbackService.js` — 목표 150줄

원본 위치: `survey.html` 6439~6588줄

```js
import { YUNN_FEEDBACK_VERIFY_URL, YUNN_FEEDBACK_FORM_URL,
         YUNN_FEEDBACK_SESSION_ENTRY_ID, STORAGE_KEYS } from '../domain/AppConfig.js';
import { getItem, setItem, getSessionId } from '../repository/SessionRepository.js';

export function isFeedbackVerifiedLocally() { ... }
export function markFeedbackVerified() { ... }
export function buildFeedbackSurveyUrl() { ... }
export function requestFeedbackVerification() { ... }  // JSONP 로직 그대로
export async function verifyFeedbackAndUnlock() { ... }
```

---

## 5. ui/templates 레이어 (HTML 문자열 생성만, 로직 없음)

### `js/ui/templates/RoutineCardTemplate.js` — 목표 80줄

원본 위치: `survey.html` 6182~6234줄 renderRoutine() 내부 템플릿 문자열

```js
import { escapeHTML } from '../../service/ResultService.js';

// renderRoutine()에서 추출한 HTML 생성 함수
export function routineCardHTML(step, index) {
  return `
    <article class="routine-card">
      <div class="routine-step-label">STEP ${index + 1}</div>
      <div class="routine-product-image">
        <img src="${escapeHTML(step.image)}" alt="${escapeHTML(step.name)}">
      </div>
      <div>
        <div class="routine-product-title">${escapeHTML(step.name)}</div>
        <div class="routine-tag">${escapeHTML(step.tag)}</div>
        <div class="routine-product-desc">${escapeHTML(step.description)}</div>
        <div class="routine-detail">
          <div class="routine-detail-icon">?</div>
          <div>
            <div class="routine-detail-title">Why it's recommended</div>
            <div class="routine-detail-copy">${escapeHTML(step.why)}</div>
          </div>
        </div>
        <div class="routine-detail">
          <div class="routine-detail-icon">?</div>
          <div>
            <div class="routine-detail-title">How to use</div>
            <div class="routine-detail-copy">${escapeHTML(step.how)}</div>
          </div>
        </div>
        <div class="routine-detail routine-tip">
          <div class="routine-detail-icon"><i class="ph ph-lightbulb"></i></div>
          <div>
            <div class="routine-detail-title">YUNN TIP</div>
            <div class="routine-detail-copy">${escapeHTML(step.tip)}</div>
          </div>
        </div>
      </div>
    </article>
  `;
}
```

---

### `js/ui/templates/ProductCardTemplate.js` — 목표 60줄

원본 위치: `survey.html` 6236~6266줄 renderProducts() 내부 템플릿 문자열

```js
import { escapeHTML } from '../../service/ResultService.js';

export function productCardHTML(product) {
  return `
    <article class="product-card" data-product-id="${escapeHTML(product.id)}">
      ...원본 HTML 그대로...
    </article>
  `;
}
```

---

### `js/ui/templates/BalanceRowTemplate.js` — 목표 40줄

원본 위치: `survey.html` renderBalance() 내부 템플릿 문자열

```js
import { escapeHTML } from '../../service/ResultService.js';

export function balanceRowHTML(metric) {
  return `
    <div class="balance-row" data-metric-name="${escapeHTML(metric.label)}">
      <div class="balance-label">${escapeHTML(metric.label)}</div>
      <div class="balance-track">
        <div class="balance-fill" style="width:${metric.value}%"></div>
      </div>
      <div class="balance-score">${metric.value}%</div>
      <div class="balance-status">${escapeHTML(metric.status)}</div>
    </div>
  `;
}
```

---

## 6. ui 레이어 (DOM 조작·이벤트만)

### `js/ui/IntroScreen.js` — 목표 120줄

원본 위치: `survey.html` 4727~4758줄, 5575~5597줄, 3981~4068줄(initMobileChrome)

**담당**: 인트로 화면 이벤트, 사이드바, 네비게이션 버튼, 모바일 상태바 초기화

```js
import { trackYunnEvent, trackLandingView, markAnalyticsScreen,
         setupAnalyticsObservers, setupFieldAnalytics,
         getSurveyUser } from '../service/AnalyticsService.js';

// 모듈 로드 시 자동 실행
initMobileChrome();       // 원본 그대로
trackLandingView();
setupAnalyticsObservers();
setupFieldAnalytics();

let isLoggedIn = Boolean(getSurveyUser());

// inline onclick 제거 → addEventListener로 교체
// HTML의 data-action 속성으로 버튼 식별
function bindIntroEvents() {
  document.getElementById('btn-start-survey')
    ?.addEventListener('click', startSurvey);
  document.getElementById('sidebar-toggle')
    ?.addEventListener('click', toggleSidebar);
  document.getElementById('sidebar-overlay')
    ?.addEventListener('click', toggleSidebar);
  document.getElementById('btn-logo')
    ?.addEventListener('click', goHome);
  document.getElementById('btn-user')
    ?.addEventListener('click', handleUserClick);
  document.getElementById('btn-cart')
    ?.addEventListener('click', handleCartClick);
}

function toggleSidebar() { ... }
function goHome() { ... }
function handleUserClick() { ... }
function handleCartClick() { ... }
function startSurvey() { ... }
function initMobileChrome() { ... }  // 원본 그대로

// window 노출 (다른 화면에서 호출 필요한 것만)
window.toggleSidebar = toggleSidebar;
window.goHome = goHome;

document.addEventListener('DOMContentLoaded', bindIntroEvents);
```

---

### `js/ui/SurveyScreen.js` — 목표 280줄 (스텝 수가 많아 불가피)

원본 위치: `survey.html` 5348~5911줄

**담당**: 스텝 이동, 진행 바 업데이트, 유효성 UI 반영, 사진 업로드, Sheets 전송 트리거

```js
import { SKIN_HELPER_STEPS } from '../domain/SkinType.js';
import { isStepComplete, isStepTwoComplete, isStepSevenComplete,
         isStepEightComplete, isSkinHelperStep,
         inferSkinType, isValidIndianMvpEmail, normalizeEmail,
         collectSurveyPayload } from '../service/SurveyService.js';
import { trackSurveyStepView, trackStepNextClick,
         trackStepBackClick, emitCurrentScreenTime,
         markAnalyticsScreen } from '../service/AnalyticsService.js';
import { sendToSheet } from '../repository/SheetRepository.js';
import { getSessionId } from '../repository/SessionRepository.js';

// 상태
let currentStep = '1';
let skinHelperCompleted = false;
export let uploadedSkinPhotoData = '';

// inline onclick 제거 → data-action 기반 이벤트 위임
// <button data-action="next">, <button data-action="back">
function bindSurveyEvents() {
  document.querySelectorAll('[data-action="next"]')
    .forEach(btn => btn.addEventListener('click', nextStep));
  document.querySelectorAll('[data-action="back"]')
    .forEach(btn => btn.addEventListener('click', goBack));
  // 라디오/체크박스 변경 이벤트
  // 사진 업로드 이벤트
}

function goToStep(step) { ... }   // 원본 그대로
function nextStep() { ... }       // 원본 그대로, startAnalysis 호출 포함
function goBack() { ... }         // 원본 그대로
function updateProgress() { ... }
function updateStepActionState(step) { ... }
function updateStepTwoState() { ... }
function updateStepSevenState() { ... }
function updateStepEightState() { ... }
function setFieldState(input, state) { ... }
function validateStepOne(options) { ... }
function previewPhoto(event) { ... }
function startAnalysis() { ... }   // sendToSheet 호출 포함

// window 노출 (ResultScreen에서 goToStep 참조)
window.nextStep = nextStep;
window.goBack = goBack;
window.goToStep = goToStep;

// URL 파라미터 처리
document.addEventListener('DOMContentLoaded', () => {
  bindSurveyEvents();
  const p = new URLSearchParams(window.location.search);
  if (p.has('survey')) {
    startSurvey();
    if (p.get('step')) goToStep(p.get('step'));
  }
  validateStepOne();
  updateStepTwoState();
  updateStepSevenState();
  updateStepEightState();
});
```

---

### `js/ui/ResultScreen.js` — 목표 200줄

원본 위치: `survey.html` 5947~6110줄 (render 함수), 6590~6645줄 (showResults 등)

**담당**: 결과 화면 DOM 조작. 계산·템플릿 생성 없음.

```js
import { RESULT_ASSETS, RESULT_PRODUCTS } from '../domain/RoutineConfig.js';
import { getResultSurveyData, getResultConfig, computeSkinBalance,
         formatResultSummary, escapeHTML } from '../service/ResultService.js';
import { isFeedbackVerifiedLocally, verifyFeedbackAndUnlock } from '../service/FeedbackService.js';
import { trackYunnEvent, markAnalyticsScreen,
         emitCurrentScreenTime, yunnAnalyticsState } from '../service/AnalyticsService.js';
import { savePendingResult } from '../repository/SurveyRepository.js';
import { getSessionId, getItem, setItem } from '../repository/SessionRepository.js';
import { routineCardHTML } from './templates/RoutineCardTemplate.js';
import { productCardHTML } from './templates/ProductCardTemplate.js';
import { balanceRowHTML } from './templates/BalanceRowTemplate.js';

let currentResultConfig = null;
let activeRoutinePeriod = 'morning';
let resultAnalyticsObserver = null;
let resultAnalyticsSections = new Set();
let unlockConversionTracked = false;

// 각 render 함수는 템플릿을 import해서 사용
function renderResultHeader(data, config) { ... }

function renderBalance(data, config) {
  const balances = computeSkinBalance(data, config);
  document.getElementById('skin-balance-list').innerHTML =
    balances.map(balanceRowHTML).join('');
}

function renderRoutine(period) {
  // ...
  document.getElementById('result-routine-list').innerHTML =
    routineSteps.map((step, i) => routineCardHTML(step, i)).join('');
}

function renderProducts() {
  document.getElementById('result-product-grid').innerHTML =
    RESULT_PRODUCTS.map(productCardHTML).join('');
}

function switchRoutineTab(period) { ... }
function setResultChromeStatus() { ... }
export function setRoutineUnlockState(isUnlocked) { ... }
function renderResultScreen(data, config) { ... }
export function showResults() { ... }
function retakeQuiz() { ... }
function goBackToSurveyFromResult() { ... }
function shareResult() { ... }
async function handleFeedbackReturn() { ... }

// inline onclick 제거 → addEventListener
function bindResultEvents() {
  document.getElementById('btn-back-from-result')
    ?.addEventListener('click', goBackToSurveyFromResult);
  document.getElementById('btn-share-result')
    ?.addEventListener('click', shareResult);
  document.getElementById('morning-tab')
    ?.addEventListener('click', () => switchRoutineTab('morning'));
  document.getElementById('evening-tab')
    ?.addEventListener('click', () => switchRoutineTab('evening'));
  document.getElementById('btn-add-all-cart')
    ?.addEventListener('click', addAllRecommendedToCart);
  document.getElementById('btn-retake-quiz')
    ?.addEventListener('click', retakeQuiz);
  document.getElementById('btn-unlock-routine')
    ?.addEventListener('click', () => openFeedbackGateModal('ready'));
}

window.switchRoutineTab = switchRoutineTab;
window.retakeQuiz = retakeQuiz;
window.goBackToSurveyFromResult = goBackToSurveyFromResult;
window.shareResult = shareResult;
window.showResults = showResults;
window.setRoutineUnlockState = setRoutineUnlockState;

document.addEventListener('DOMContentLoaded', () => {
  bindResultEvents();
  const p = new URLSearchParams(window.location.search);
  if (p.has('returnFromSurvey')) handleFeedbackReturn();
  else if (p.has('resultDemo')) showResults();
});
```

---

### `js/ui/ModalManager.js` — 목표 220줄

원본 위치: `survey.html` 6236~6420줄 (Beta), 6439~6588줄 (Feedback Gate)

**담당**: 두 모달의 열기·닫기·상태 변경. 장바구니 클릭 이벤트.

```js
import { RESULT_PRODUCTS } from '../domain/RoutineConfig.js';
import { buildFeedbackSurveyUrl, verifyFeedbackAndUnlock } from '../service/FeedbackService.js';
import { trackYunnEvent } from '../service/AnalyticsService.js';
import { getItem, setItem } from '../repository/SessionRepository.js';
import { escapeHTML } from '../service/ResultService.js';
import { setRoutineUnlockState } from './ResultScreen.js';

// Beta modal
let betaModalCloseTimer = null;
function recordCartEvent(product, source) { ... }
function recordBetaIntent(source, productId) { ... }
export function openBetaServiceModal(source, productId) { ... }
export function closeBetaServiceModal(event) { ... }
function handleBetaModalBackdrop(event) { ... }
function handleBetaFeedbackClick() { ... }
export function addRecommendedToCart(productId, source) { ... }
export function addAllRecommendedToCart() { ... }

// Feedback gate modal
function setFeedbackGateStatus(iconClass, title, copy) { ... }
export function openFeedbackGateModal(mode) { ... }
export function closeFeedbackGateModal(event) { ... }
function handleFeedbackGateBackdrop(event) { ... }
function openFeedbackSurvey() { ... }

// inline onclick 제거 → addEventListener
function bindModalEvents() {
  document.getElementById('btn-beta-modal-close')
    ?.addEventListener('click', closeBetaServiceModal);
  document.getElementById('beta-service-modal')
    ?.addEventListener('click', handleBetaModalBackdrop);
  document.getElementById('btn-beta-feedback')
    ?.addEventListener('click', handleBetaFeedbackClick);
  document.getElementById('feedback-gate-modal')
    ?.addEventListener('click', handleFeedbackGateBackdrop);
  document.getElementById('btn-feedback-gate-close')
    ?.addEventListener('click', closeFeedbackGateModal);
  document.getElementById('btn-open-feedback-survey')
    ?.addEventListener('click', openFeedbackSurvey);
  document.getElementById('btn-verify-feedback')
    ?.addEventListener('click', verifyFeedbackAndUnlock);
  document.getElementById('btn-feedback-not-now')
    ?.addEventListener('click', closeFeedbackGateModal);
  // 상품 카드 카트 버튼 (동적 생성이므로 이벤트 위임)
  document.getElementById('result-product-grid')
    ?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="add-to-cart"]');
      if (btn) addRecommendedToCart(btn.dataset.productId);
    });
}

window.openBetaServiceModal = openBetaServiceModal;
window.openFeedbackGateModal = openFeedbackGateModal;
window.verifyFeedbackAndUnlock = verifyFeedbackAndUnlock;
window.addRecommendedToCart = addRecommendedToCart;
window.addAllRecommendedToCart = addAllRecommendedToCart;

document.addEventListener('DOMContentLoaded', bindModalEvents);
```

---

## 7. styles 레이어

### `styles/base.css` — 목표 60줄
원본 위치: `survey.html` 31~66줄
내용: `@import` Pretendard, `:root` CSS 변수, `*` 리셋, `body`, `.container`

### `styles/components.css` — 목표 120줄
원본 위치: `survey.html` 67~163줄
내용: `.btn-primary`, `.btn-outline`, `.sidebar-overlay`, `.sidebar-menu`

### `styles/intro.css` — 목표 200줄
원본 위치: `survey.html` 164~553줄 (390줄 → 정리 후 200줄 목표)
내용: `.diagnosis-shell`, `.diagnosis-header`, `.diagnosis-content`, `.diagnosis-hero`,
`.feature-icons`, `.diagnosis-desc`, `.diagnosis-home-indicator`

### `styles/survey.css` — 목표 350줄 (스텝 수가 많아 불가피)
원본 위치: `survey.html` 554~1246줄 + 2481~3076줄 (합계 ~1280줄 → 정리 후 350줄 목표)
내용: `.survey-app-shell`, `.progress-bar`, `.survey-step`, `.option-card`, `.option-list`,
`#analysis-screen`, 스텝별 특수 레이아웃 (skinType grid, concern grid, photo upload 등)

### `styles/result.css` — 목표 250줄
원본 위치: `survey.html` 1247~1929줄
내용: `.result-shell`, `.result-topbar`, `.result-insight`, `.balance-card`,
`.routine-card`, `.product-card`, `.unlock-preview-card`, `.result-bottom-nav`

### `styles/modals.css` — 목표 200줄
원본 위치: `survey.html` 1930~2480줄
내용: `.beta-modal-overlay`, `.beta-modal-sheet`, `.beta-modal-*`,
`.feedback-gate-overlay`, `.feedback-gate-sheet`, `.feedback-gate-*`

---

## 8. HTML 파일 분리

### 공통 원칙
- `onclick=` 속성 전부 제거 → JS에서 `addEventListener`로 교체
- `id` 속성은 유지 (JS가 getElementById로 참조)
- 버튼에 `data-action="..."` 속성 추가 (이벤트 위임용)
- 각 HTML 파일은 완전한 독립 문서가 아닌 `<div>` 조각
- 실제 서비스 진입점: `pages/index.html` (모든 화면 조각을 include)

### `pages/intro.html` — 목표 80줄
원본 위치: `survey.html` 3097~3208줄
내용: `#intro-screen` div 전체. `data-action` 속성 추가:
```html
<button class="btn-primary" data-action="start-survey">Start My Skin Analysis</button>
<i class="ph ph-list header-icon" id="sidebar-toggle"></i>
```

### `pages/survey.html` — 목표 250줄
원본 위치: `survey.html` 3208~3703줄
내용: `#survey-screen` + `#analysis-screen` div 전체.
스텝 버튼에 `data-action="next"` / `data-action="back"` 추가.

### `pages/result.html` — 목표 150줄
원본 위치: `survey.html` 3703~3816줄
내용: `#result-screen` div 전체.
버튼에 id 추가: `id="btn-back-from-result"`, `id="btn-share-result"`,
`id="btn-add-all-cart"`, `id="btn-retake-quiz"`, `id="btn-unlock-routine"`

### `pages/modals.html` — 목표 120줄
원본 위치: `survey.html` 3084~3097줄 + 3816~3906줄
내용: `.sidebar-overlay`, `.sidebar-menu`, `#beta-service-modal`, `#feedback-gate-modal`
버튼에 id 추가: `id="btn-beta-modal-close"`, `id="btn-beta-feedback"`,
`id="btn-feedback-gate-close"`, `id="btn-open-feedback-survey"`,
`id="btn-verify-feedback"`, `id="btn-feedback-not-now"`

---

## 9. 오타 수정 체크리스트

분리 작업 중 아래 오타를 동시에 수정한다.

| 위치 | 기존 | 수정 후 |
|------|------|---------|
| `RoutineConfig.js` RESULT_ASSETS | `Serum_YUMM.png` | `Serum_YUNN.png` |
| `RoutineConfig.js` RESULT_ASSETS | `Moisturies_YUNN.png` | `Moisturiser_YUNN.png` |
| `RoutineConfig.js` RESULT_ASSETS | `Moisturies_top selling.png` | `Moisturiser_top_selling.png` |
| `RoutineConfig.js` RESULT_ASSETS | `Woman model_YUNN.png` | `Woman_model_YUNN.png` |
| `RoutineConfig.js` RESULT_ASSETS | `Man model_YUNN.png` | `Man_model_YUNN.png` |
| HTML 로고 `<img>` (3곳) | `yuun_logo png.png` | `yunn_logo.png` |
| HTML `<link rel="icon">` | `yuun_logo png.png` | `yunn_logo.png` |
| HTML concern 이미지 | `Uneven skin tone .png` | `Uneven_skin_tone.png` |
| `assets/image/` 실제 파일명 | 위 목록 전체 | 동일하게 rename |

---

## 10. JS 모듈 로드 순서 (진입점 HTML)

```html
<!-- </body> 직전 -->
<script type="module" src="../js/domain/AppConfig.js"></script>
<script type="module" src="../js/domain/SkinType.js"></script>
<script type="module" src="../js/domain/SurveyAnswer.js"></script>
<script type="module" src="../js/domain/RoutineDatabase.js"></script>
<script type="module" src="../js/domain/RoutineConfig.js"></script>
<script type="module" src="../js/repository/SessionRepository.js"></script>
<script type="module" src="../js/repository/SurveyRepository.js"></script>
<script type="module" src="../js/repository/SheetRepository.js"></script>
<script type="module" src="../js/service/AnalyticsService.js"></script>
<script type="module" src="../js/service/SurveyService.js"></script>
<script type="module" src="../js/service/ResultService.js"></script>
<script type="module" src="../js/service/FeedbackService.js"></script>
<script type="module" src="../js/ui/templates/RoutineCardTemplate.js"></script>
<script type="module" src="../js/ui/templates/ProductCardTemplate.js"></script>
<script type="module" src="../js/ui/templates/BalanceRowTemplate.js"></script>
<script type="module" src="../js/ui/IntroScreen.js"></script>
<script type="module" src="../js/ui/SurveyScreen.js"></script>
<script type="module" src="../js/ui/ResultScreen.js"></script>
<script type="module" src="../js/ui/ModalManager.js"></script>
```

---

## 11. 검증 체크리스트

### 콘솔
- [ ] `SyntaxError` 없음
- [ ] `ReferenceError` (미정의 함수) 없음
- [ ] `Failed to resolve module` (import 경로 오류) 없음

### 기능
- [ ] `?survey` → 서베이 직접 시작
- [ ] `?step=3` → Step 3으로 이동
- [ ] `?resultDemo` → 결과 화면 바로 표시
- [ ] `?returnFromSurvey` → 잠금 해제 시도
- [ ] Step 1 이메일·전화 유효성 검사
- [ ] Step 3 Not Sure → 헬퍼 서브플로우
- [ ] Step 2·7·8 자동 진행 (300ms)
- [ ] Complete Analysis / Skip → Sheets 전송 + 결과 화면
- [ ] 아침/저녁 루틴 탭 전환
- [ ] Beta Modal 열기·닫기
- [ ] Feedback Gate Modal 열기·닫기
- [ ] 상품 카드 카트 버튼 클릭 → Beta Modal
- [ ] 사이드바 열기·닫기
- [ ] `window.dataLayer` 이벤트 발화 확인
