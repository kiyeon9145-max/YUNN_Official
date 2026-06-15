# result.page.md — 결과 화면 명세

> 담당 파일: `pages/result.html` · `styles/result.css` · `js/ui/ResultScreen.js`
> 템플릿: `js/ui/templates/RoutineCardTemplate.js` · `ProductCardTemplate.js` · `BalanceRowTemplate.js`
> 관련 서비스: `js/service/ResultService.js`

---

## 1. 화면 목적

서베이 응답을 분석한 결과를 보여주는 화면.
피부 타입 분석 → 밸런스 지표 → 루틴 추천 → 상품 추천 순서로 구성된다.
루틴·상품 섹션은 기본 잠금 상태이며, 피드백 제출 후 해제된다.

---

## 2. 화면 구성

```
┌──────────────────────────────────┐
│ 상태바 (시간·네트워크)              │
│ 헤더 (← 뒤로 · AI Skin Analysis · 공유↑) │
│──────────────────────────────────│
│ [result-insight 섹션]             │
│   YUNN Skin Insight              │
│   Hi! {이름}                      │
│   Your skin type is              │
│   {skinTypeName} type             │
│   [얼굴 이미지]                   │
│──────────────────────────────────│
│ [키워드 태그들]                    │
│ [요약 텍스트]                     │
│──────────────────────────────────│
│ [안내 카드] Check your skin balance│
│──────────────────────────────────│
│ [balance-card 섹션]               │
│   Your Skin Balance              │
│   [6개 지표 행]                   │
│──────────────────────────────────│
│ ▼ 잠금 영역 (locked-result-content)│
│   [Morning / Evening 탭]         │
│   [루틴 카드 목록]                 │
│   [상품 그리드]                   │
│   [Unlock My Full Routine 버튼]   │
│──────────────────────────────────│
│ 하단 네비게이션 바                 │
└──────────────────────────────────┘
```

---

## 3. 결과 데이터 결정 로직

### 피부 타입 + 고민 → 결과 키

```js
// js/service/ResultService.js
concernType = getPrimaryConcernType(checkedConcernValues)
// 우선순위: Pigmentation > Tone > Marks > Acne

key = `${skinType}|${concernType}`
// 예: "Oily|Acne", "Dry|Pigmentation"

config = RESULT_RECOMMENDATION_CONFIG[key] || RESULT_RECOMMENDATION_CONFIG['Oily|Acne']
```

### 16개 조합 → skinTypeName

| 키 | skinTypeName |
|-----|-------------|
| `Oily\|Acne` | Oil Clear |
| `Oily\|Marks` | Glow Restore |
| `Oily\|Pigmentation` | Radiance Shield |
| `Oily\|Tone` | Glow Balance |
| `Dry\|Acne` | Calm Repair |
| `Dry\|Marks` | Barrier Glow |
| `Dry\|Pigmentation` | Soft Glow |
| `Dry\|Tone` | Soft Bright |
| `Combination\|Acne` | Clear Harmony |
| `Combination\|Marks` | Clear Harmony |
| `Combination\|Pigmentation` | Glow Harmony |
| `Combination\|Tone` | Glow Harmony |
| `Normal\|*` | Pure Radiance |

---

## 4. Skin Balance 지표

`js/service/ResultService.js`의 `computeSkinBalance(data, config)` 반환값:

| key | 표시명 | 기준값 범위 |
|-----|-------|-----------|
| `hydration` | Hydration Level | 70 기준 |
| `barrier` | Skin Barrier Resilience | 78 기준 |
| `pigmentation` | Pigmentation Tendency | 42~62 (concern 기준) |
| `calmness` | Skin Calmness | 46~60 (민감도 기준) |
| `oil` | Oil Balance | 58~72 (피부 타입 기준) |
| `environmental` | Environmental Stress | 48~64 (야외 시간 기준) |

**라이프스타일 감점**:
- 수면 < 5시간 → `hydration`, `barrier`, `calmness` -7
- 스트레스 Very high → `barrier`, `calmness`, `environmental` -8
- 선크림 Rarely → `pigmentation`, `environmental` -8

**클램핑**: 최소 28, 최대 92

**상태 레이블**:
- ≥ 78 → `Good`
- ≥ 52 → `Needs Care`
- < 52 → `Focus`

---

## 5. 루틴 구성

### 아침 (3단계)

1. Gentle Cleanser — 피부 타입별 설명
2. Serum — concern 타입별 (Brightening / Tone Repair / Even Tone Essence)
3. Daily Sunscreen — 고정

### 저녁 (3단계)

1. Gentle Cleanser — 저녁 전용 설명
2. Serum — concern 타입별 (tag: Repair)
3. Moisturiser — 피부 타입별:
   - Oily → Light Gel Moisturiser
   - Dry → Ceramide Moisture Cream
   - Combination → Balancing Gel Cream
   - Normal → Daily Balance Lotion

---

## 6. HTML 구조 (`pages/result.html`)

```html
<div id="result-screen">
  <div class="result-shell">

    <!-- 상태바 -->
    <div class="result-status-bar">
      <span id="result-current-time">10:07</span>
      <div class="result-status-icons">
        <i class="ph-fill ph-cell-signal-full"></i>
        <span class="network-label" id="result-network-status">4G</span>
        <i class="ph ph-battery-high"></i>
      </div>
    </div>

    <!-- 상단 헤더 -->
    <header class="result-topbar">
      <button type="button" class="result-icon-button" id="btn-back-from-result" aria-label="Back">
        <i class="ph ph-arrow-left"></i>
      </button>
      <h1>AI Skin Analysis</h1>
      <button type="button" class="result-icon-button" id="btn-share-result" aria-label="Share">
        <i class="ph ph-upload-simple"></i>
      </button>
    </header>

    <main class="result-content">

      <!-- 피부 분석 섹션 -->
      <section class="result-insight">
        <div class="result-eyebrow">YUNN Skin Insight</div>
        <div class="result-greeting">Hi! <span id="result-user-name">Guest</span></div>
        <div class="result-label">Your skin type is</div>
        <div class="result-type-name" id="result-type-name">Sensitive Glow type</div>
        <div class="result-face-card">
          <img id="result-face-image" src="../assets/image/Woman_model_YUNN.png" alt="User skin analysis image">
        </div>
      </section>

      <div class="result-keywords" id="result-keywords"></div>
      <div class="result-summary" id="result-summary"></div>

      <!-- 안내 카드 -->
      <section class="result-info-card">
        <div class="result-info-icon"><i class="ph ph-lightbulb"></i></div>
        <div>
          <div class="result-info-title">Check your current skin balance</div>
          <div class="result-info-copy">The areas with the lowest balance are the top priorities.</div>
        </div>
      </section>

      <!-- 밸런스 카드 -->
      <section class="balance-card">
        <div class="balance-card-header">
          <div class="balance-card-title">Your Skin Balance</div>
          <div class="balance-legend">• Good&nbsp;&nbsp;• Needs Care&nbsp;&nbsp;• Focus</div>
        </div>
        <div id="skin-balance-list"></div>
        <!-- BalanceRowTemplate.js로 동적 생성 -->
        <div class="result-note">＊ Results are based on your answers. Not a medical diagnosis.</div>
      </section>

      <!-- 잠금 영역 -->
      <div class="locked-result-content locked" id="locked-result-content">

        <!-- 루틴 탭 -->
        <section class="routine-tabs" aria-label="Routine tabs">
          <button type="button" class="routine-tab active" id="morning-tab">
            <i class="ph-fill ph-sun"></i>
            <span>
              <span class="routine-tab-title">Morning Routine</span>
              <span class="routine-tab-subtitle">Protect &amp; Glow</span>
            </span>
          </button>
          <button type="button" class="routine-tab" id="evening-tab">
            <i class="ph-fill ph-moon"></i>
            <span>
              <span class="routine-tab-title">Evening Routine</span>
              <span class="routine-tab-subtitle">Repair &amp; Recover</span>
            </span>
          </button>
        </section>

        <!-- 루틴 카드 목록 (RoutineCardTemplate.js로 동적 생성) -->
        <section id="result-routine-list"></section>

        <!-- 상품 섹션 -->
        <section class="products-section">
          <h2 class="products-title">Products selected to reduce<br>trial-and-error</h2>
          <p class="products-copy">Based on your responses, our Skin AI recommends the following.</p>
          <!-- ProductCardTemplate.js로 동적 생성 -->
          <div class="product-grid" id="result-product-grid"></div>
          <button type="button" class="add-all-cart" id="btn-add-all-cart">
            <i class="ph-bold ph-plus"></i> Add All to Cart
          </button>
          <button type="button" class="retake-link" id="btn-retake-quiz">Retake Quiz</button>
        </section>

        <!-- 잠금 해제 CTA -->
        <section class="unlock-preview-card" aria-live="polite">
          <div class="unlock-preview-title">Your 14-day routine plan is ready.</div>
          <p class="unlock-preview-copy">Answer one quick feedback form to unlock the full routine.</p>
          <button type="button" class="unlock-preview-button" id="btn-unlock-routine">
            <span>Unlock My Full Routine</span>
            <i class="ph ph-arrow-right"></i>
          </button>
        </section>

      </div><!-- /locked-result-content -->
    </main>

    <!-- 하단 네비게이션 -->
    <nav class="result-bottom-nav" aria-label="Result bottom navigation">
      <button type="button" class="active"><i class="ph-fill ph-house"></i><span>Home</span></button>
      <button type="button"><i class="ph ph-shopping-cart"></i><span>Shop</span></button>
      <button type="button" id="btn-retake-quiz-nav"><i class="ph ph-magnifying-glass-plus"></i><span>Quiz</span></button>
      <button type="button"><i class="ph ph-tag"></i><span>Offers</span></button>
      <button type="button"><i class="ph ph-user"></i><span>Account</span></button>
    </nav>

  </div>
</div>
```

**변경 사항** (원본 대비):
- 모든 `onclick=` 제거 → 고유 `id` 부여 후 JS에서 `addEventListener`
- 이미지 경로 오타 수정: `Woman model_YUNN.png` → `Woman_model_YUNN.png`

---

## 7. 동적 생성 영역

| 요소 id | 생성 함수 | 템플릿 파일 |
|---------|---------|-----------|
| `#result-keywords` | `renderResultHeader()` | 없음 (span 단순 생성) |
| `#result-summary` | `formatResultSummary()` | `ResultService.js` |
| `#skin-balance-list` | `renderBalance()` | `BalanceRowTemplate.js` |
| `#result-routine-list` | `renderRoutine()` | `RoutineCardTemplate.js` |
| `#result-product-grid` | `renderProducts()` | `ProductCardTemplate.js` |

---

## 8. 잠금 해제 메커니즘

```
[btn-unlock-routine 클릭]
  → openFeedbackGateModal('ready')     // ModalManager.js
  → 사용자가 Google Form 제출
  → ?returnFromSurvey 파라미터로 복귀
  → handleFeedbackReturn()
      → showResults()
      → verifyFeedbackAndUnlock()      // FeedbackService.js
          → YUNN_FEEDBACK_VERIFY_URL 호출 (현재 미설정)
          → 성공 시 setRoutineUnlockState(true)
              → #locked-result-content.locked 클래스 제거
```

**현재 상태**: `YUNN_FEEDBACK_VERIFY_URL = ''` → 자동 해제 불가. 수동 확인만 가능.

---

## 9. CSS (`styles/result.css`)

원본 위치: `survey.html` 1247~1929줄

담당 클래스:
- `.result-shell` — 결과 화면 컨테이너
- `.result-status-bar` / `.result-topbar` — 상단 영역
- `.result-insight` / `.result-type-name` / `.result-face-card` — 분석 섹션
- `.result-keywords` / `.result-keyword` — 키워드 태그
- `.result-summary` — 요약 텍스트
- `.balance-card` / `.balance-row` / `.balance-fill` / `.balance-status` — 밸런스 지표
- `.balance-good` / `.balance-needs-care` / `.balance-focus` — 상태 색상
- `.locked-result-content` / `.locked-result-content.locked` — 잠금 상태
- `.routine-tabs` / `.routine-tab` / `.routine-tab.active` — 루틴 탭
- `.routine-card` / `.routine-detail` / `.routine-tip` — 루틴 카드
- `.product-card` / `.product-image-wrap` / `.cart-action` — 상품 카드
- `.unlock-preview-card` / `.unlock-preview-button` — 잠금 해제 CTA
- `.result-bottom-nav` — 하단 네비게이션

---

## 10. 이벤트 맵

| 요소 ID | 이벤트 | 호출 함수 |
|---------|-------|---------|
| `btn-back-from-result` | click | `goBackToSurveyFromResult()` |
| `btn-share-result` | click | `shareResult()` |
| `morning-tab` | click | `switchRoutineTab('morning')` |
| `evening-tab` | click | `switchRoutineTab('evening')` |
| `btn-add-all-cart` | click | `addAllRecommendedToCart()` |
| `btn-retake-quiz` | click | `retakeQuiz()` |
| `btn-retake-quiz-nav` | click | `retakeQuiz()` |
| `btn-unlock-routine` | click | `openFeedbackGateModal('ready')` |
| `result-product-grid` | click (위임) | `addRecommendedToCart(productId)` |
| `.balance-row` | click | `metric_detail_click` 이벤트 발화 |

---

## 11. 의존성

```
ResultScreen.js
  ├─ domain/RoutineConfig.js (RESULT_ASSETS, RESULT_PRODUCTS)
  ├─ service/ResultService.js (계산·조합)
  ├─ service/FeedbackService.js (잠금 해제)
  ├─ service/AnalyticsService.js (이벤트 추적)
  ├─ repository/SurveyRepository.js (savePendingResult)
  ├─ repository/SessionRepository.js (세션 ID)
  ├─ ui/templates/RoutineCardTemplate.js
  ├─ ui/templates/ProductCardTemplate.js
  └─ ui/templates/BalanceRowTemplate.js
```
