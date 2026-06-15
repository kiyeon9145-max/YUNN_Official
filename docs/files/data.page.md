# data.page.md — 데이터 레이어 명세

> 담당 파일:
> - `js/domain/AppConfig.js` · `SkinType.js` · `SurveyAnswer.js` · `RoutineDatabase.js` · `RoutineConfig.js`
> - `js/repository/SessionRepository.js` · `SurveyRepository.js` · `SheetRepository.js`
> - `js/service/AnalyticsService.js` · `FeedbackService.js`

---

## 1. 레이어 개요

```
domain/       → 순수 상수·데이터. 의존성 없음. 함수 없음.
repository/   → 외부 I/O 추상화. domain만 참조.
service/      → 비즈니스 로직. domain·repository 참조.
```

---

## 2. domain 레이어

### `AppConfig.js`

모든 URL·스토리지 키·애널리틱스 상수의 단일 진실 공급원(Single Source of Truth).

| 상수 | 값 | 설명 |
|------|-----|------|
| `YUNN_SHEET_ENDPOINT` | `https://script.google.com/macros/s/.../exec` | Google Sheets 전송 URL |
| `YUNN_FEEDBACK_FORM_URL` | `https://docs.google.com/forms/...` | 피드백 Google Form URL |
| `YUNN_FEEDBACK_VERIFY_URL` | `''` | 검증 API URL (현재 미설정) |
| `YUNN_FEEDBACK_SESSION_ENTRY_ID` | `''` | Form entry 파라미터 ID (현재 미설정) |
| `YUNN_FEEDBACK_RETURN_PARAM` | `'returnFromSurvey'` | 복귀 URL 파라미터명 |
| `YUNN_GTM_ID` | `'GTM-P2NX3N5K'` | Google Tag Manager ID |
| `YUNN_ANALYTICS_MAX_EVENTS` | `1000` | 로컬 이벤트 최대 저장 수 |
| `YUNN_SCROLL_THRESHOLDS` | `[25, 50, 75, 100]` | 스크롤 깊이 임계값 (%) |
| `YUNN_LONG_STAY_SECONDS` | `45` | 마찰 감지 기준 체류 시간 |
| `STORAGE_KEYS` | 객체 | localStorage 키 모음 |

### `SkinType.js`

피부 타입 정의와 헬퍼 서브플로우 추론 규칙.

**피부 타입 추론 규칙** (4개 헬퍼 스텝 평균값 기준):

```
avg ≤ 1.8                                → Dry
avg ≥ 4.2                                → Oily
values.includes(3) OR 2.6 < avg < 4.2   → Combination
나머지                                    → Normal
```

### `SurveyAnswer.js`

각 스텝의 선택지 값 목록과 유효성 검사 상수.

**허용 이메일 도메인**:
`gmail.com`, `outlook.com`, `yahoo.com`, `yahoo.in`, `hotmail.com`, `rediffmail.com`, `icloud.com`

**전화번호 정규식**: `/^[6-9]\d{9}$/` (인도 10자리)

### `RoutineDatabase.js` — 275줄

성별·고민·피부타입별 상세 루틴 스텝 데이터.

**수정 이유**: 루틴 내용(제품명·사용법)이 바뀔 때만 이 파일을 열면 된다.
결과 화면 UI·카피 변경과 무관하게 독립적으로 관리된다.

```
키 형식: "성별-고민타입-피부타입"
F = Female, M = Male
A = Acne, P = Hyperpigmentation
O = Oily, D = Dry, N = Normal, C = Combination

16개 키: F-A-O, F-A-D, F-A-N, F-A-C,
         F-P-O, F-P-D, F-P-N, F-P-C,
         M-A-O, M-A-D, M-A-N, M-A-C,
         M-P-O, M-P-D, M-P-N, M-P-C
```

각 키의 구조:
```js
{
  title: "Female · Acne · Oily Skin",
  morning: [{ name, desc }, ...],   // 아침 루틴 스텝
  out: [{ name, desc }, ...],       // 외출 시
  home: [{ name, desc }, ...],      // 귀가 시
  evening: [{ name, desc }, ...]    // 저녁 루틴 스텝
}
```

**현재 결과 렌더링에서 미사용.** 향후 성별 파라미터를 결과 조회 키에 포함할 때 사용 예정.

---

### `RoutineConfig.js` — 440줄

결과 화면에 필요한 모든 데이터 정의.
`RoutineDatabase.js`를 import하지 않는다. 두 파일은 서로 독립적이다.

**수정 이유**: 결과 화면 카피·에셋·추천 로직이 바뀔 때만 이 파일을 열면 된다.

#### RESULT_ASSETS (오타 수정 적용)

```js
{
  userFallbackFemale: '../assets/image/Woman_model_YUNN.png',
  userFallbackMale:   '../assets/image/Man_model_YUNN.png',
  cleanser:           '../assets/image/Facewash_YUNN.png',
  serum:              '../assets/image/Serum_YUNN.png',        // 수정: YUMM→YUNN
  sunscreen:          '../assets/image/Sunscreen_YUNN.png',
  moisturiser:        '../assets/image/Moisturiser_YUNN.png',  // 수정: Moisturies→Moisturiser
  cleanserCard:       '../assets/image/Facewash_top_selling.png',
  serumCard:          '../assets/image/Serum_top_selling.png',
  sunscreenCard:      '../assets/image/Sunscreen_YUNN.png',
  creamCard:          '../assets/image/Moisturiser_top_selling.png', // 수정
}
```

#### RESULT_PRODUCTS (고정 4종)

| id | 상품명 | 가격 | 할인 |
|----|-------|------|------|
| `cleanser-foam` | Anua Heartleaf Pore Deep Cleansing Foam | ₹1,500 | 15% |
| `niacin-essence` | Nacific Phyto Niacin Whitening Essence | ₹1,350 | 20% |
| `relief-sun` | Beauty of Joseon Relief Sun SPF50+ PA++++ | ₹1,500 | 15% |
| `ceramide-cream` | ILLIYOON Ceramide Ato Concentrate Cream | ₹1,500 | 15% |

#### RESULT_COPY_VARIANTS

고민타입별 카피 데이터 (Acne / Marks / Pigmentation / Tone).
각 키에 `focus`, `typeSuffix`, `concernKeyword`, `summary`, `serumName` 등 포함.

#### RESULT_SKIN_VARIANTS

피부타입별 설정 데이터 (Oily / Dry / Combination / Normal).
각 키에 `typePrefix`, `keyword`, `balanceAdjust`, `cleanserDesc`, `moisturiserName` 등 포함.

#### RESULT_RECOMMENDATION_CONFIG

`RESULT_SKIN_VARIANTS` × `RESULT_COPY_VARIANTS` 4×4=16개 조합을 자동 빌드.
`RESULT_TYPE_PROFILES`로 `skinTypeName`·`summary`·`keywords` 덮어씀.

---

## 3. repository 레이어

### `SessionRepository.js`

#### localStorage 래퍼

`localStorage` 접근 실패 시 인메모리 객체(`yunnMemoryStorage`)로 폴백.

```js
export const getItem    = (key) => yunnStorage.getItem(key);
export const setItem    = (key, value) => yunnStorage.setItem(key, String(value));
export const removeItem = (key) => yunnStorage.removeItem(key);
```

#### 세션 ID

형식: `yunn_{timestamp}_{random}`
최초 접속 시 생성 → `STORAGE_KEYS.SESSION_ID`로 저장 → 이후 재사용.

#### 저장 키 목록

| 키 상수 | 실제 키 | 설명 |
|--------|--------|------|
| `SESSION_ID` | `yunn_session_id` | 세션 식별자 |
| `FEEDBACK_VERIFIED` | `yunn_feedback_verified` | 피드백 검증 완료 여부 |
| `PENDING_RESULT` | `yunn_pending_result_data` | 결과 재진입용 임시 데이터 |
| `ANALYTICS_EVENTS` | `yunn_analytics_events` | 이벤트 로그 (최대 1,000건) |
| `CART_EVENTS` | `yunn_cart_events` | 장바구니 클릭 이벤트 |
| `BETA_EVENTS` | `yunn_beta_events` | Beta 모달 인터랙션 이벤트 |

### `SurveyRepository.js`

결과 화면 재진입 시 서베이 데이터를 복원하기 위한 임시 저장소.

```js
export function readPendingResult()      // JSON.parse(localStorage) or {}
export function savePendingResult(data)  // JSON.stringify → localStorage
```

### `SheetRepository.js`

#### 전송 방식

```
GET + URLSearchParams → new Image().src = url
```

CORS 우회를 위해 이미지 픽셀 트릭 사용. 전송 성공/실패 확인 불가.

#### 전송 시점

```
Step 10: [Complete Analysis 클릭] ──┐
                                    ├─→ nextStep() → startAnalysis() → sendToSheet()
         [Skip for now 클릭]      ──┘
```

#### 전송 스키마

| 필드 | 소스 | 비고 |
|------|------|------|
| `name` | `#userName` | |
| `email` | `#userEmail` | |
| `phone` | `#userWhatsApp` | |
| `gender` | `input[name="gender"]:checked` | |
| `age` | `input[name="age"]:checked` | |
| `skinType` | `input[name="skinType"]:checked` | |
| `concerns` | `input[name="concerns"]:checked` | 콤마 구분 |
| `triggers` | `input[name="trigger"]:checked` | 콤마 구분 |
| `sensitivity` | `input[name="sensitivity"]:checked` | |
| `outdoor` | `input[name="outdoor"]:checked` | |
| `sunscreen` | `input[name="sunscreen"]:checked` | |
| `sleep` | `input[name="sleep"]:checked` | |
| `stress` | `input[name="stress"]:checked` | |
| `routineLevel` | `input[name="routineLevel"]:checked` | |
| `photo_uploaded` | `Boolean(uploadedSkinPhotoData)` | Skip → false |
| `session_id` | `getSessionId()` | |

---

## 4. AnalyticsService.js

### GTM 연동

```js
window.dataLayer.push({ event: eventName, ...properties, session_id, timestamp })
```

진입점: `trackYunnEvent(eventName, properties)` — 모든 이벤트는 이 함수를 통해 발화.

### 로컬 이벤트 저장

`persistAnalyticsEvent(payload)` → `STORAGE_KEYS.ANALYTICS_EVENTS` → 최대 1,000건

### 주요 이벤트

#### 인트로

| 이벤트 | 트리거 |
|--------|-------|
| `landing_view` | 페이지 로드 |
| `landing_cta_click` | Start My Skin Analysis 클릭 |
| `landing_time_spent` | 화면 이탈 시 체류 시간 |

#### 서베이 스텝

| 이벤트 | 트리거 |
|--------|-------|
| `{step}_page_view` | 스텝 진입 |
| `{step}_time_spent` | 스텝 이탈 시 |
| `next_button_click` | 다음 버튼 클릭 |
| `back_button_click` | 뒤로 버튼 클릭 |
| `validation_error` | 유효성 검사 실패 |

#### 결과 화면

| 이벤트 | 트리거 |
|--------|-------|
| `result_view` | 결과 화면 진입 |
| `routine_tab_switch` | 아침/저녁 탭 전환 |
| `unlock_cta_click` | Unlock My Full Routine 클릭 |
| `unlock_conversion` | 잠금 해제 성공 |
| `product_cart_click` | 상품 카트 클릭 |
| `result_section_view` | 섹션 가시성 (IntersectionObserver) |

### 스크롤 깊이 추적

임계값 `[25, 50, 75, 100]%` — 화면별 독립 추적, 재발화 없음.

### 마찰 감지

45초 이상 같은 스텝에 머물면 `friction` 이벤트 발화.

---

## 5. FeedbackService.js

### 잠금 해제 흐름

```
verifyFeedbackAndUnlock()
  → YUNN_FEEDBACK_VERIFY_URL이 비어있음 → 'verification_not_configured' 반환
  → YUNN_FEEDBACK_VERIFY_URL 설정 시:
      → JSONP 방식으로 검증 요청
      → 응답: 'verified' → markFeedbackVerified() → setRoutineUnlockState(true)
      → 응답: 'not_found' → 에러 표시
```

### Google Form URL 빌드

```js
buildFeedbackSurveyUrl()
// YUNN_FEEDBACK_FORM_URL + ?entry.{YUNN_FEEDBACK_SESSION_ENTRY_ID}={sessionId}
// YUNN_FEEDBACK_SESSION_ENTRY_ID가 빈 문자열이면 파라미터 없이 Form URL만 반환
```

### 로컬 검증 상태

```js
isFeedbackVerifiedLocally()
// → STORAGE_KEYS.FEEDBACK_VERIFIED === 'true'

markFeedbackVerified()
// → STORAGE_KEYS.FEEDBACK_VERIFIED = 'true' 저장
```

---

## 6. 현재 알려진 한계 (MVP)

| 항목 | 상태 | 해결 방향 |
|------|------|---------|
| `YUNN_FEEDBACK_VERIFY_URL` 미설정 | 잠금 자동 해제 불가 | Google Apps Script 검증 엔드포인트 구현 |
| Sheets 전송 방식 (GET+이미지픽셀) | 전송 성공/실패 확인 불가 | Apps Script `doPost` + CORS 설정 후 fetch POST로 교체 |
| 이메일 도메인 제한 | 기업 이메일 불가 | 도메인 화이트리스트 확장 또는 제거 |
| 피부 사진 미분석 | 업로드해도 AI 분석 없음 | Vision API 연동 (v2 계획) |
| 남성 루틴 데이터 미활용 | `RoutineDatabase.js`에 있으나 결과 렌더링 미연결 | gender 파라미터를 결과 조회 키에 포함 |
