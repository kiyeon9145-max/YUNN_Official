# modals.page.md — 모달·사이드바 명세

> 담당 파일: `pages/modals.html` · `styles/modals.css` · `js/ui/ModalManager.js`

---

## 1. 화면 목적

앱 전체에서 공통으로 사용하는 오버레이 UI 모음.
- **사이드바**: 전체 화면 네비게이션 메뉴
- **Beta Service Modal**: 장바구니·결제 기능 미구현 안내 + 얼리 액세스 유도
- **Feedback Gate Modal**: 루틴 잠금 해제 전 피드백 폼 안내

---

## 2. 구성 요소

```
pages/modals.html
├── .sidebar-overlay        ← 반투명 딤 레이어
├── .sidebar-menu           ← 사이드바 메뉴 (슬라이드 인)
├── #beta-service-modal     ← 베타 서비스 모달 (바텀 시트)
└── #feedback-gate-modal    ← 피드백 게이트 모달 (바텀 시트)
```

---

## 3. HTML 구조 (`pages/modals.html`)

### 사이드바

```html
<div class="sidebar-overlay" id="sidebar-overlay"></div>
<div class="sidebar-menu" id="sidebar-menu">
  <i class="ph ph-x" id="btn-sidebar-close" style="font-size:24px; cursor:pointer;"></i>
  <ul>
    <li><a href="../index.html">Home</a></li>
    <li><a href="../index.html#categories">Skin</a></li>
    <li><a href="survey.html?survey=1">Routine Program</a></li>
    <li><a href="survey.html?survey=1">Treatment Finder</a></li>
    <li><a href="landing.html">About Us</a></li>
  </ul>
</div>
```

### Beta Service Modal

```html
<div class="beta-modal-overlay" id="beta-service-modal" aria-hidden="true">
  <section class="beta-modal-sheet" role="dialog" aria-modal="true" aria-labelledby="beta-modal-title">

    <div class="beta-modal-handle" aria-hidden="true"></div>
    <button type="button" class="beta-modal-close" id="btn-beta-modal-close" aria-label="Close">
      <i class="ph ph-x"></i>
    </button>

    <div class="beta-modal-hero">
      <h2 class="beta-modal-title" id="beta-modal-title">Thank you for trying YUNN 💚</h2>
      <p class="beta-modal-intro">You're one of our early users — and we're really glad you're here.</p>
    </div>

    <div class="beta-benefit-card">
      <div class="beta-benefit-head">
        <div class="beta-benefit-icon"><i class="ph ph-gift"></i></div>
        <div>As an early beta user, you'll get:</div>
      </div>
      <div class="beta-benefit-list">
        <div class="beta-benefit-item">
          <div class="beta-check"><i class="ph-bold ph-check"></i></div>
          <span>Early access at launch</span>
        </div>
        <div class="beta-benefit-item">
          <div class="beta-check"><i class="ph-bold ph-check"></i></div>
          <span>An exclusive launch discount</span>
        </div>
      </div>
    </div>

    <div class="beta-feedback-block">
      <div class="beta-time-icon"><i class="ph ph-clock"></i></div>
      <div>
        <div class="beta-feedback-title">Got 2 minutes?</div>
        <p class="beta-feedback-copy">Your honest thoughts will help us make YUNN better for everyone.</p>
      </div>
    </div>

    <button type="button" class="beta-feedback-cta" id="btn-beta-feedback">
      <span>Share Your Thoughts</span>
      <i class="ph ph-arrow-right"></i>
    </button>

    <div class="beta-modal-divider"><i class="ph-fill ph-heart"></i></div>
    <p class="beta-thanks-note">Beta users who share feedback receive an additional launch discount.</p>

  </section>
</div>
```

### Feedback Gate Modal

```html
<div class="feedback-gate-overlay" id="feedback-gate-modal" aria-hidden="true">
  <section class="feedback-gate-sheet" role="dialog" aria-modal="true" aria-labelledby="feedback-gate-title">

    <div class="feedback-gate-handle" aria-hidden="true"></div>
    <button type="button" class="feedback-gate-close" id="btn-feedback-gate-close" aria-label="Close">
      <i class="ph ph-x"></i>
    </button>

    <div class="feedback-gate-lock"><i class="ph ph-lock-key"></i> Full routine locked</div>
    <h2 class="feedback-gate-title" id="feedback-gate-title">Before unlocking your full routine</h2>
    <p class="feedback-gate-copy">We'd love to understand how this result felt for you.</p>

    <div class="feedback-gate-card">
      <div class="feedback-gate-card-title">
        <i class="ph ph-clipboard-text"></i>
        <span>Less than 1 minute</span>
      </div>
      <div class="feedback-gate-steps">
        <div class="feedback-gate-step">
          <span>1</span><div>Complete the short Google Form.</div>
        </div>
        <div class="feedback-gate-step">
          <span>2</span><div>Tap the return link on the confirmation screen.</div>
        </div>
        <div class="feedback-gate-step">
          <span>3</span><div>Your morning, evening, and product routine will unlock here.</div>
        </div>
      </div>
    </div>

    <button type="button" class="feedback-gate-primary" id="btn-open-feedback-survey">
      <span>Continue to Unlock</span>
      <i class="ph ph-arrow-square-out"></i>
    </button>

    <div class="feedback-gate-status" id="feedback-gate-status">
      <i class="ph ph-clock"></i>
      <div>
        <strong>Your full routine stays saved here</strong>
        <span>Close this sheet anytime. The routine unlocks after the feedback step.</span>
      </div>
    </div>

    <div class="feedback-gate-actions">
      <button type="button" class="feedback-gate-link" id="btn-verify-feedback">Check submission</button>
      <button type="button" class="feedback-gate-link" id="btn-feedback-not-now">Not now</button>
    </div>

  </section>
</div>
```

**변경 사항** (원본 대비):
- 모든 `onclick=` 제거 → 고유 `id` 부여 후 JS에서 `addEventListener`
- 배경 클릭 닫기: JS에서 overlay 요소에 직접 click 이벤트 등록

---

## 4. Beta Service Modal 동작

### 열기

```js
openBetaServiceModal(source, productId)
// source: 'single' | 'all' | 'header_cart'
// productId: 상품 id 또는 빈 문자열
```

트리거:
- 상품 카드 "Add to Cart" 클릭
- "Add All to Cart" 클릭
- 헤더 카트 아이콘 클릭 (로그인 상태)

### 닫기

- X 버튼 클릭 (`btn-beta-modal-close`)
- 배경 클릭 (`beta-service-modal` overlay)
- **10초 자동 닫힘** (`betaModalCloseTimer`)

### "Share Your Thoughts" 클릭

→ `handleBetaFeedbackClick()` → `YUNN_FEEDBACK_FORM_URL`로 이동

---

## 5. Feedback Gate Modal 동작

### 열기 모드

```js
openFeedbackGateModal(mode)
// mode: 'ready' | 'pending' | 'error'
```

| mode | 표시 상태 |
|------|---------|
| `'ready'` | 기본 안내 텍스트, "Continue to Unlock" 버튼 활성 |
| `'pending'` | "Checking your submission..." 상태 표시 |
| `'error'` | "Couldn't verify submission" 에러 표시 |

### 닫기

- X 버튼 클릭 (`btn-feedback-gate-close`)
- 배경 클릭 (`feedback-gate-modal` overlay)
- "Not now" 클릭 (`btn-feedback-not-now`)

### "Continue to Unlock" 클릭

→ `openFeedbackSurvey()` → `buildFeedbackSurveyUrl()` → Google Form으로 이동
→ Form 완료 후 `?returnFromSurvey` 파라미터로 복귀

### "Check submission" 클릭

→ `verifyFeedbackAndUnlock()` → `YUNN_FEEDBACK_VERIFY_URL` 호출
→ 현재 미설정 → `'verification_not_configured'` 상태 반환

---

## 6. CSS (`styles/modals.css`)

원본 위치: `survey.html` 1930~2480줄

### Beta Modal 담당 클래스

- `.beta-modal-overlay` — 배경 딤, 슬라이드 업 애니메이션
- `.beta-modal-overlay.active` — 활성 상태
- `.beta-modal-overlay.closing` — 닫힘 애니메이션
- `.beta-modal-sheet` — 바텀 시트 컨테이너
- `.beta-modal-handle` — 상단 드래그 핸들
- `.beta-modal-close` — X 버튼
- `.beta-modal-hero` — 제목 영역
- `.beta-benefit-card` / `.beta-benefit-item` / `.beta-check` — 혜택 카드
- `.beta-feedback-block` / `.beta-feedback-cta` — 피드백 유도 영역
- `.beta-modal-divider` — 구분선
- `.beta-thanks-note` — 감사 문구

### Feedback Gate 담당 클래스

- `.feedback-gate-overlay` — 배경 딤
- `.feedback-gate-overlay.active` — 활성 상태
- `.feedback-gate-sheet` — 바텀 시트 컨테이너
- `.feedback-gate-handle` — 상단 핸들
- `.feedback-gate-close` — X 버튼
- `.feedback-gate-lock` — 잠금 상태 표시
- `.feedback-gate-title` / `.feedback-gate-copy` — 제목·설명
- `.feedback-gate-card` / `.feedback-gate-steps` / `.feedback-gate-step` — 단계 안내
- `.feedback-gate-primary` — 메인 CTA 버튼
- `.feedback-gate-status` — 상태 메시지
- `.feedback-gate-actions` / `.feedback-gate-link` — 보조 버튼들

### 사이드바 담당 클래스 (components.css에 포함)

- `.sidebar-overlay` / `.sidebar-overlay.active`
- `.sidebar-menu` / `.sidebar-menu.active`

---

## 7. 이벤트 맵

### 사이드바

| 요소 ID | 이벤트 | 호출 함수 |
|---------|-------|---------|
| `sidebar-overlay` | click | `toggleSidebar()` |
| `btn-sidebar-close` | click | `toggleSidebar()` |
| `sidebar-toggle` (intro) | click | `toggleSidebar()` |
| `survey-sidebar-toggle` (survey) | click | `toggleSidebar()` |

### Beta Modal

| 요소 ID | 이벤트 | 호출 함수 |
|---------|-------|---------|
| `beta-service-modal` | click | `handleBetaModalBackdrop(e)` |
| `btn-beta-modal-close` | click | `closeBetaServiceModal(e)` |
| `btn-beta-feedback` | click | `handleBetaFeedbackClick()` |
| `result-product-grid` | click (위임) | `addRecommendedToCart(id)` |
| `btn-add-all-cart` | click | `addAllRecommendedToCart()` |

### Feedback Gate Modal

| 요소 ID | 이벤트 | 호출 함수 |
|---------|-------|---------|
| `feedback-gate-modal` | click | `handleFeedbackGateBackdrop(e)` |
| `btn-feedback-gate-close` | click | `closeFeedbackGateModal(e)` |
| `btn-open-feedback-survey` | click | `openFeedbackSurvey()` |
| `btn-verify-feedback` | click | `verifyFeedbackAndUnlock()` |
| `btn-feedback-not-now` | click | `closeFeedbackGateModal(e)` |

---

## 8. 의존성

```
ModalManager.js
  ├─ domain/RoutineConfig.js (RESULT_PRODUCTS - 카트 이벤트용)
  ├─ service/FeedbackService.js (buildFeedbackSurveyUrl, verifyFeedbackAndUnlock)
  ├─ service/AnalyticsService.js (trackYunnEvent)
  ├─ service/ResultService.js (escapeHTML, getPrimaryConcernType)
  ├─ repository/SessionRepository.js (getItem, setItem)
  └─ ui/ResultScreen.js (setRoutineUnlockState)
```
