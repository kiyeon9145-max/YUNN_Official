# DATA_LAYER.md — Google Sheets & Analytics 명세

> 관련 JS: `js/repository/SheetRepository.js`, `js/service/AnalyticsService.js`
> 관련 Domain: `js/domain/AppConfig.js`

---

## 1. Google Sheets 연동

### 엔드포인트

```js
// js/domain/AppConfig.js
YUNN_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyVf7nkwjveU5rWg3iE363zg8wsWhXdba47-C0HKSfpjZYMJ62-p4tetm4RADGT11MNfQ/exec'
```

### 전송 방식

```
GET + URLSearchParams → new Image().src = url
```

Google Apps Script의 CORS 정책으로 인해 POST JSON 불가.
이미지 픽셀 트릭으로 CORS 우회. 전송 성공/실패 확인 불가.

**향후 개선**: Apps Script `doPost` + `Access-Control-Allow-Origin` 설정 후 fetch POST로 교체.

### 전송 시점

Step 10에서 결과 화면으로 넘어가는 버튼을 누르는 순간 전송된다.

```
[Complete Analysis 클릭]  ──┐
                            ├─→ nextStep() → startAnalysis() → sendToSheet()
[Skip for now 클릭]       ──┘
```

두 버튼 모두 `onclick="nextStep()"` 으로 연결되어 있어 전송 경로가 동일하다.
`photo_uploaded` 필드만 Skip(`false`) / Complete(`Boolean(uploadedSkinPhotoData)`)에 따라 달라진다.

### 전송 스키마

| 필드 | 타입 | 소스 | 설명 |
|------|------|------|------|
| `name` | string | `#userName` | 사용자 이름 |
| `email` | string | `#userEmail` | 이메일 |
| `phone` | string | `#userWhatsApp` | WhatsApp 번호 (인도) |
| `gender` | string | `input[name="gender"]:checked` | `Female` \| `Male` |
| `age` | string | `input[name="age"]:checked` | 나이대 |
| `skinType` | string | `input[name="skinType"]:checked` | 피부 타입 |
| `concerns` | string | 복수 체크박스, 콤마 구분 | 피부 고민 |
| `triggers` | string | 복수 체크박스, 콤마 구분 | 악화 트리거 |
| `sensitivity` | string | 라디오 | 민감도 |
| `outdoor` | string | 라디오 | 야외 활동 시간 |
| `sunscreen` | string | 라디오 | 선크림 빈도 |
| `sleep` | string | 라디오 | 수면 시간 |
| `stress` | string | 라디오 | 스트레스 레벨 |
| `routineLevel` | string | 라디오 | 현재 루틴 수준 |
| `photo_uploaded` | boolean | `Boolean(uploadedSkinPhotoData)` | 사진 업로드 여부 |
| `session_id` | string | `getYunnSessionId()` | 세션 식별자 |

---

## 2. 로컬 스토리지 (`yunnStorage`)

### 초기화

```js
// localStorage 사용 불가 시 메모리 폴백
const yunnStorage = (() => {
    try {
        if (window.localStorage) return window.localStorage;
    } catch { /* privacy mode 등 */ }
    return yunnMemoryStorage; // 인메모리 객체
})();
```

### 저장 키 목록

| 키 | 설명 | 설정 위치 |
|----|------|----------|
| `yunn_session_id` | UUID 세션 ID | `getYunnSessionId()` |
| `yunn_feedback_verified` | 피드백 검증 완료 여부 (`'true'`) | `markFeedbackVerified()` |
| `yunn_pending_result` | 결과 화면 재진입용 임시 데이터 (JSON) | `savePendingResultData()` |
| `yunn_analytics_events` | 이벤트 로그 배열 (최대 1,000건, JSON) | `persistAnalyticsEvent()` |
| `yunn_cart_events` | 장바구니 클릭 이벤트 배열 (JSON) | `recordCartEvent()` |
| `yunn_beta_events` | Beta 모달 인터랙션 이벤트 배열 (JSON) | `recordBetaIntent()` |

### 세션 ID 생성

```js
function getYunnSessionId() {
    let sessionId = yunnStorage.getItem('yunn_session_id');
    if (!sessionId) {
        sessionId = 'yunn_' + Date.now() + '_' + Math.random().toString(36).slice(2);
        yunnStorage.setItem('yunn_session_id', sessionId);
    }
    return sessionId;
}
```

---

## 3. GTM / Analytics 이벤트

### GTM 설정

```js
window.YUNN_GTM_ID = 'GTM-P2NX3N5K'
```

### 이벤트 발화 진입점

모든 이벤트는 `trackYunnEvent(eventName, properties)` 를 통해 발화됨.

```js
// dataLayer push + 로컬 persist 동시 실행
window.dataLayer.push({ event: eventName, ...properties, session_id, timestamp, ... })
persistAnalyticsEvent({ event: eventName, ...properties })
```

### 주요 이벤트 목록

#### 랜딩 화면

| 이벤트 | 트리거 |
|--------|-------|
| `landing_view` | 페이지 최초 로드 |
| `landing_load_time` | DOM 로드 완료 후 |
| `landing_first_interaction` | 첫 번째 인터랙션 |
| `landing_cta_click` | "Start My Skin Analysis" 클릭 |
| `landing_time_spent` | 화면 이탈 시 |
| `landing_exit` | beforeunload (랜딩 중) |

#### 서베이 스텝

| 이벤트 | 트리거 |
|--------|-------|
| `{step}_page_view` | 스텝 진입 (예: `user_info_page_view`) |
| `{step}_time_spent` | 스텝 이탈 시 체류 시간 |
| `next_button_click` | 다음 버튼 클릭 |
| `back_button_click` | 뒤로 버튼 클릭 |
| `next_button_disabled_click` | 비활성화된 다음 버튼 클릭 |
| `validation_error` | 유효성 검사 실패 |
| `page_abandon` | 스텝 중 페이지 이탈 |

#### 입력 필드

| 이벤트 | 트리거 |
|--------|-------|
| `name_input_focus` | 이름 필드 포커스 |
| `name_input_complete` | 이름 입력 완료 |
| `email_input_focus` | 이메일 포커스 |
| `email_input_complete` | 이메일 입력 완료 |
| `phone_input_focus` | 전화번호 포커스 |
| `phone_input_complete` | 전화번호 입력 완료 |

#### 사진 업로드 (Step 10)

| 이벤트 | 트리거 |
|--------|-------|
| `skin_photo_upload_click` | 업로드 영역 클릭 |
| `photo_upload_started` | 파일 선택 시작 |
| `photo_upload_conversion` | `startAnalysis()` 시점 |
| `skip_photo_click` | Skip 클릭 |
| `complete_analysis_click` | Complete Analysis 클릭 |

#### 결과 화면

| 이벤트 | 트리거 |
|--------|-------|
| `result_view` | 결과 화면 진입 |
| `analysis_completion_success` | 분석 완료 |
| `survey_complete` | 서베이 최종 완료 |
| `result_section_view` | 섹션 가시성 (IntersectionObserver) |
| `routine_tab_switch` | 아침/저녁 탭 전환 |
| `unlock_cta_click` | "Unlock My Full Routine" 클릭 |
| `unlock_conversion` | 잠금 해제 성공 |
| `unlock_dropoff` | 잠금 해제 모달 이탈 |
| `result_time_spent` | 결과 화면 체류 시간 |
| `result_exit` | beforeunload (결과 화면) |

### 스크롤 깊이 트래킹

임계값: `[25, 50, 75, 100]%`
화면별로 이미 발화된 임계값은 재발화하지 않음 (`emittedScrollByScreen`).

### 마찰 감지 (Friction)

45초 이상 같은 스텝에 머물면 `friction` 이벤트 발화.

```js
YUNN_LONG_STAY_SECONDS = 45
```

---

## 4. 피드백 검증 서비스

```js
// 현재 미설정 (빈 문자열)
YUNN_FEEDBACK_VERIFY_URL = ''
YUNN_FEEDBACK_SESSION_ENTRY_ID = ''   // Google Form entry 파라미터
YUNN_FEEDBACK_RETURN_PARAM = 'returnFromSurvey'
```

### 검증 요청 방식

JSONP 방식 (`<script>` 태그 동적 삽입):

```js
const callbackName = `yunnFeedbackVerify_${Date.now()}_${random}`;
const url = new URL(YUNN_FEEDBACK_VERIFY_URL);
url.searchParams.set('session_id', getYunnSessionId());
url.searchParams.set('callback', callbackName);
// <script src=url> 동적 삽입 → 서버에서 callbackName(result) 호출
```

### 검증 결과 상태값

| 상태 | 의미 |
|------|------|
| `'verified'` | 검증 성공 → 잠금 해제 |
| `'not_found'` | 제출 미확인 |
| `'verification_not_configured'` | URL 미설정 (현재) |
| `'error'` | 네트워크 오류 |

---

## 5. STEP_ANALYTICS_CONFIG 요약

각 스텝별 이벤트 이름을 중앙에서 관리하는 설정 객체.
분리 후 `js/domain/AppConfig.js` 또는 `js/service/AnalyticsService.js` 상단에 위치.

```js
STEP_ANALYTICS_CONFIG = {
    '1': { pageView, timeSpent, abandon, optionView, nextClick, backClick },
    '2': { pageView, timeSpent, abandon, optionViewEvents: [...], ... },
    // ...
    'landing': { pageView, timeSpent, abandon, scroll, friction, cta },
    'analysis': { pageView, timeSpent },
    'result': { pageView, timeSpent, abandon, scroll, friction }
}
```
