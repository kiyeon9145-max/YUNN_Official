# survey.page.md — 서베이 화면 명세

> 담당 파일: `pages/survey.html` · `styles/survey.css` · `js/ui/SurveyScreen.js`
> 관련 서비스: `js/service/SurveyService.js`

---

## 1. 화면 목적

사용자의 피부 타입·고민·라이프스타일을 10단계 질문으로 수집한다.
완료 시 Google Sheets로 데이터를 전송하고 결과 화면으로 이동한다.

---

## 2. 화면 구성

```
┌──────────────────────────────┐
│ 상태바 (시간·신호·배터리)        │
│ 헤더 (로고·유저·카트)           │
│ 진행 바 + "Page N of 10"      │  ← id: progress-bar, step-indicator
│──────────────────────────────│
│ [활성 스텝 콘텐츠]              │  ← .survey-step.active
│──────────────────────────────│
│ [Back] [Next / Complete]      │  ← data-action="back" / data-action="next"
└──────────────────────────────┘
```

분석 로딩 화면 (`#analysis-screen`)은 Step 10 완료 후 ~2.4초 동안 표시된다.

---

## 3. 스텝 구조

| Step | data-step | 입력 타입 | 자동 진행 |
|------|-----------|----------|----------|
| 1 | `"1"` | 텍스트 3개 (이름·이메일·전화) | 없음 |
| 2 | `"2"` | 라디오 2그룹 (성별·나이) | ✓ 300ms |
| 3 | `"3"` | 라디오 (피부 타입) | 없음 |
| 3-1 | `"3-1"` | 라디오 (세안 후 느낌) | 없음 |
| 3-2 | `"3-2"` | 라디오 (오후 유분) | 없음 |
| 3-3 | `"3-3"` | 라디오 (하루 중 변화) | 없음 |
| 3-4 | `"3-4"` | 라디오 (피부 결) | 없음 |
| 4 | `"4"` | 체크박스 (피부 고민) | 없음 |
| 5 | `"5"` | 체크박스 (트리거) | 없음 |
| 6 | `"6"` | 라디오 (민감도) | 없음 |
| 7 | `"7"` | 라디오 2그룹 (야외·선크림) | ✓ 300ms |
| 8 | `"8"` | 라디오 2그룹 (수면·스트레스) | ✓ 300ms |
| 9 | `"9"` | 라디오 (루틴 수준) | 없음 |
| 10 | `"10"` | 파일 업로드 (선택) | 없음 |

---

## 4. HTML 구조 (`pages/survey.html`)

### 전체 골격

```html
<!-- SURVEY CORE -->
<div id="survey-screen">
  <div class="survey-app-shell">

    <!-- 상태바 -->
    <div class="survey-status-bar">
      <span id="survey-current-time">--:--</span>
      <div class="survey-status-icons">
        <span class="survey-signal-bars"><span></span><span></span><span></span><span></span></span>
        <span class="survey-network-slot" id="survey-network-slot">
          <i class="ph-fill ph-wifi-high survey-wifi-mark"></i>
        </span>
        <span class="survey-battery-shell">
          <span class="survey-battery-level" id="survey-battery-level"></span>
        </span>
      </div>
    </div>

    <!-- 헤더 -->
    <div class="survey-top-header">
      <i class="ph ph-list header-icon" id="survey-sidebar-toggle" aria-label="Open menu"></i>
      <div class="survey-logo-mark" id="survey-btn-logo" aria-label="YUNN home">
        <img src="../assets/image/yunn_logo.png" alt="YUNN">
      </div>
      <div class="survey-header-actions">
        <i class="ph ph-user header-icon" id="survey-btn-user" aria-label="Account"></i>
        <div class="cart-wrapper" id="survey-btn-cart" aria-label="Cart">
          <i class="ph ph-shopping-bag header-icon"></i>
          <div class="cart-badge" id="survey-cart-badge" style="display:none;">2</div>
        </div>
      </div>
    </div>

    <!-- 진행 바 -->
    <div class="survey-header">
      <div class="progress-wrapper">
        <div class="progress-bar" id="progress-bar"></div>
      </div>
      <div class="step-indicator" id="step-indicator">Page 1 of 10</div>
    </div>

    <!-- 스텝 컨테이너 -->
    <div class="survey-steps-container">
      <!-- Step 1 ~ Step 10 + 헬퍼 스텝 (아래 참조) -->
    </div>

  </div>
</div>

<!-- ANALYSIS SCREEN -->
<div id="analysis-screen">
  <div class="container">
    <div class="spinner"></div>
    <h2 class="question-title">Building your routine.</h2>
    <p class="question-subtitle">We're cross-referencing your skin profile...</p>
    <div id="cycling-status" style="font-weight:600; color:var(--primary);">
      Analysing skin concern patterns...
    </div>
  </div>
</div>
```

### 스텝 공통 구조

```html
<div class="survey-step" data-step="N">
  <div class="question-block">
    <div class="question-title">질문 텍스트</div>
    <div class="question-subtitle">보조 텍스트</div>
    <!-- 입력 영역 -->
  </div>
  <div class="step-actions">
    <button type="button" class="btn-outline" data-action="back">Back</button>
    <button type="button" class="btn-primary" id="btn-next-N" data-action="next" disabled>Next</button>
  </div>
</div>
```

### Step 1 (텍스트 입력)

```html
<div class="survey-step active" data-step="1">
  <div class="question-block">
    <div class="question-title">Let's start with you.</div>
    <div class="input-group">
      <input type="text" id="userName" placeholder="Your name" autocomplete="name">
      <div class="field-error" id="name-error"></div>
    </div>
    <div class="input-group">
      <input type="email" id="userEmail" placeholder="Email address" autocomplete="email">
      <div class="field-error" id="email-error"></div>
    </div>
    <div class="input-group">
      <div class="phone-input-wrapper">
        <span class="phone-prefix">+91</span>
        <input type="tel" id="userWhatsApp" placeholder="WhatsApp number" maxlength="10" inputmode="numeric">
      </div>
      <div class="field-error" id="phone-error"></div>
    </div>
  </div>
  <div class="step-actions">
    <button type="button" class="btn-outline" data-action="back">Back</button>
    <button type="button" class="btn-primary" id="btn-next-1" data-action="next" disabled>Next</button>
  </div>
</div>
```

### Step 10 (사진 업로드)

```html
<div class="survey-step" data-step="10">
  <div class="question-block">
    <div class="question-title">Optional: Upload a bare-face photo</div>
    <div class="photo-upload-container">
      <div class="photo-upload-inner" id="photo-upload-area">
        <div class="camera-icon-wrap"><i class="ph ph-camera"></i></div>
        <div class="upload-text">Tap to upload a bare-face photo</div>
        <div class="upload-subtext">No makeup · Good lighting · Front-facing</div>
        <img id="photo-preview" style="display:none;" alt="Preview">
        <input type="file" id="bareFacePhoto" accept="image/*" style="display:none;">
      </div>
    </div>
    <div class="secure-text-wrap">
      <i class="ph ph-lock-simple"></i>
      <span class="secure-copy">Your photo stays private. Used only for analysis.</span>
    </div>
  </div>
  <div class="step10-actions">
    <div class="action-row">
      <button type="button" class="btn-outline" data-action="back">Back</button>
      <button type="button" class="btn-primary" data-action="next">Complete Analysis</button>
    </div>
    <button type="button" class="skip-btn" data-action="next">Skip for now</button>
  </div>
</div>
```

**변경 사항** (원본 대비):
- 모든 `onclick=` 제거 → `data-action` 또는 고유 `id` 부여
- 로고 src 오타 수정
- `Skip for now`도 `data-action="next"` (원본과 동일한 경로)

---

## 5. 스텝 이동 로직

### `nextStep()` 분기

```
currentStep === '1'  → validateStepOne() 실패 시 중단
currentStep === '2'  → isStepTwoComplete() 실패 시 중단
currentStep === '3'  → Not Sure 선택 시 → '3-1', 아니면 → '4'
currentStep === '3-1'~'3-3' → 다음 헬퍼 스텝
currentStep === '3-4' → inferSkinType() → 라디오 자동 선택 → '4'
currentStep === '4'~'9' → isStepComplete() 실패 시 중단
currentStep === '10' → sendToSheet() → startAnalysis()
```

### `goBack()` 분기

```
'3-1' → '3'
'3-2' → '3-1'
'3-3' → '3-2'
'3-4' → '3-3'
'4'   → skinHelperCompleted ? '3-4' : '3'
그 외  → 숫자 -1
```

### 자동 진행 스텝 (300ms 딜레이)

Step 2, 7, 8: 두 라디오 그룹 모두 선택 완료 시 자동으로 다음 스텝 이동

---

## 6. 유효성 검사 (`js/service/SurveyService.js`에서 처리)

### Step 1 이메일

허용 도메인: `gmail.com`, `outlook.com`, `yahoo.com`, `yahoo.in`, `hotmail.com`, `rediffmail.com`, `icloud.com`

```
blur 이벤트 → isValidIndianMvpEmail() → setFieldState(input, 'error' | 'valid')
```

### Step 1 전화번호

정규식: `/^[6-9]\d{9}$/` (인도 10자리, 6~9로 시작)

```
input 이벤트 → 숫자만 허용, 10자리 초과 입력 차단
blur 이벤트 → PHONE_REGEX 검사 → 에러 표시
```

### 다음 버튼 활성화

`updateStepActionState(step)` → `isStepComplete(step)` 반환값에 따라 `disabled` 토글

---

## 7. Google Sheets 전송

**시점**: Step 10에서 `Complete Analysis` 또는 `Skip for now` 클릭 시

```
[Complete Analysis 클릭] ──┐
                           ├─→ nextStep() → startAnalysis() → sendToSheet(collectSurveyPayload())
[Skip for now 클릭]      ──┘
```

`photo_uploaded` 필드: Skip → `false`, 사진 선택 후 Complete → `true`

---

## 8. CSS (`styles/survey.css`)

원본 위치: `survey.html` 554~1246줄 + 2481~3076줄

담당 클래스:
- `.survey-app-shell` — 서베이 화면 컨테이너
- `.survey-status-bar` / `.survey-top-header` — 상단 고정 영역
- `.progress-bar` / `.progress-wrapper` — 진행 바
- `.survey-step` / `.survey-step.active` — 스텝 표시/숨김
- `.question-block` / `.question-title` / `.question-subtitle` — 질문 영역
- `.option-card` / `.option-list` / `.radio-group` — 선택지 카드
- `.input-group` / `.field-error` — 텍스트 입력 + 에러
- `.phone-input-wrapper` / `.phone-prefix` — 전화번호 입력
- `.skin-type-grid` — Step 3 피부 타입 그리드
- `.concern-image-grid` — Step 4 피부 고민 이미지 그리드
- `.photo-upload-container` / `.photo-upload-inner` — Step 10 사진 업로드
- `.step10-actions` / `.skip-btn` — Step 10 버튼
- `#analysis-screen` — 분석 로딩 화면

---

## 9. 상태 변수 (`js/ui/SurveyScreen.js`)

| 변수 | 타입 | 설명 |
|------|------|------|
| `currentStep` | `string` | 현재 활성 스텝 (`'1'`~`'10'`, `'3-1'`~`'3-4'`) |
| `skinHelperCompleted` | `boolean` | 헬퍼 서브플로우 완료 여부 |
| `uploadedSkinPhotoData` | `string` | 사진 데이터 (base64 또는 빈 문자열) |

---

## 10. 이벤트 맵

| 요소 | 이벤트 | 호출 함수 |
|------|-------|---------|
| `[data-action="next"]` (전체) | click | `nextStep()` |
| `[data-action="back"]` (전체) | click | `goBack()` |
| `#userName, #userEmail, #userWhatsApp` | input | `validateStepOne()` |
| `#userEmail` | blur | `validateStepOne({ revealEmailError: true })` |
| `#userWhatsApp` | blur | `validateStepOne({ revealPhoneError: true })` |
| `input[name="gender"], input[name="age"]` | change | `updateStepTwoState()` |
| `input[name="outdoor"], input[name="sunscreen"]` | change | `updateStepSevenState()` |
| `input[name="sleep"], input[name="stress"]` | change | `updateStepEightState()` |
| `.option-card` (전체) | click | `updateStepActionState()` |
| `#photo-upload-area` | click | `photoUploadInput.click()` |
| `#bareFacePhoto` | change | `previewPhoto(event)` |

---

## 11. 의존성

```
SurveyScreen.js
  ├─ domain/SkinType.js (SKIN_HELPER_STEPS)
  ├─ service/SurveyService.js (유효성, 추론, 데이터 수집)
  ├─ service/AnalyticsService.js (이벤트 추적)
  ├─ repository/SheetRepository.js (Sheets 전송)
  └─ repository/SessionRepository.js (세션 ID)
```
