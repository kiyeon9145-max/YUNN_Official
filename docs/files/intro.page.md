# intro.page.md — 인트로 화면 명세

> 담당 파일: `pages/intro.html` · `styles/intro.css` · `js/ui/IntroScreen.js`

---

## 1. 화면 목적

YUNN 서비스의 첫 진입 화면. 서비스 가치를 전달하고 사용자를 서베이로 유도한다.
타겟 사용자: 피부 트러블을 겪고 있는 인도 사용자 (18~35세).

---

## 2. 화면 구성 요소

```
┌─────────────────────────────┐
│ 상태바 (시간 · 네트워크)       │  ← id: diagnosis-current-time, diagnosis-network-status
│ 헤더 (로고 · 유저 · 카트)      │  ← id: diagnosis-header
│─────────────────────────────│
│ 헤드라인 카피                  │  "Your acne keeps coming back..."
│ 여성 모델 비주얼               │  ../assets/image/survey.start.image.png
│─────────────────────────────│
│ 기능 아이콘 3개                │  Takes 3 min · 100% Private · Personalized
│─────────────────────────────│
│ 설명 텍스트 블록               │  "Most routines fail because..."
│─────────────────────────────│
│ [Start My Skin Analysis] CTA │  ← id: btn-start-survey
│ 보조 텍스트                   │  "Takes 3 minutes. Results in 24 hours."
│ 홈 인디케이터                  │
└─────────────────────────────┘
```

---

## 3. HTML 구조 (`pages/intro.html`)

```html
<div id="intro-screen" class="active">
  <div class="diagnosis-shell">

    <!-- 상태바 -->
    <div class="diagnosis-status-bar">
      <span id="diagnosis-current-time">--:--</span>
      <div class="diagnosis-live-status">
        <span id="diagnosis-network-status">Online</span>
        <span id="diagnosis-battery-status"></span>
      </div>
    </div>

    <!-- 헤더 -->
    <div class="diagnosis-header">
      <i class="ph ph-list header-icon" id="sidebar-toggle" aria-label="Open menu"></i>
      <div class="diagnosis-logo-mark" id="btn-logo" aria-label="YUNN home">
        <img src="../assets/image/yunn_logo.png" alt="YUNN">
      </div>
      <div class="diagnosis-header-actions">
        <i class="ph ph-user header-icon" id="btn-user" aria-label="Account"></i>
        <div class="cart-wrapper" id="btn-cart" aria-label="Cart">
          <i class="ph ph-shopping-bag header-icon"></i>
          <div class="cart-badge" id="cart-badge" style="display:none;">2</div>
        </div>
      </div>
    </div>

    <!-- 콘텐츠 -->
    <div class="diagnosis-content">
      <div class="diagnosis-hero">
        <div class="diagnosis-copy">
          <div class="diagnosis-headline">
            <p>Your acne<br>keeps <span class="diagnosis-highlight">coming back.</span></p>
            <p>Your dark spots<br><span class="diagnosis-highlight">won't fade.</span></p>
            <p>Let's find out <span class="diagnosis-highlight">why.</span></p>
          </div>
          <div class="diagnosis-subcopy">
            Answer a few quick questions<br>
            and get your personalized<br>skin routine.
          </div>
        </div>
        <div class="diagnosis-visual" aria-hidden="true">
          <div class="diagnosis-visual-bg"></div>
          <img src="../assets/image/survey.start.image.png" alt="">
        </div>
      </div>

      <div class="feature-icons">
        <div class="f-icon"><i class="ph-light ph-clock"></i><span>Takes 3 minutes</span></div>
        <div class="f-icon"><i class="ph-light ph-user-focus"></i><span>100% Private</span></div>
        <div class="f-icon"><i class="ph-light ph-sparkle"></i><span>Personalized for you</span></div>
      </div>

      <div class="diagnosis-desc">
        <div class="diagnosis-desc-line">Most routines fail</div>
        <div class="diagnosis-desc-line">because they're built on <span class="highlight">guesswork.</span></div>
        <div class="diagnosis-desc-line">YUNN <span class="highlight">analyzes</span> your skin,</div>
        <div class="diagnosis-desc-line">your <span class="highlight">environment,</span></div>
        <div class="diagnosis-desc-line">and your <span class="highlight">lifestyle</span> then builds</div>
        <div class="diagnosis-desc-line">a <span class="highlight">14-day routine</span></div>
        <div class="diagnosis-desc-line">designed specifically for you.</div>
      </div>

      <button class="btn-primary" id="btn-start-survey">
        Start My Skin Analysis <i class="ph ph-arrow-right" style="margin-left:8px;"></i>
      </button>
      <div class="footer-supporting">Takes 3 minutes. Results in 24 hours.</div>
    </div>

    <div class="diagnosis-home-indicator" aria-hidden="true"></div>
  </div>
</div>
```

**변경 사항** (원본 대비):
- `onclick="startSurvey()"` → `id="btn-start-survey"` (JS에서 addEventListener)
- `onclick="toggleSidebar()"` → `id="sidebar-toggle"`
- `onclick="goHome()"` → `id="btn-logo"`
- `onclick="handleUserClick()"` → `id="btn-user"`
- `onclick="handleCartClick()"` → `id="btn-cart"`
- 로고 src: `yuun_logo png.png` → `yunn_logo.png` (오타 수정)

---

## 4. CSS (`styles/intro.css`)

원본 위치: `survey.html` 164~553줄 (약 390줄)

담당 클래스:
- `.diagnosis-shell` — 화면 컨테이너, 최대 480px
- `.diagnosis-status-bar` — 상태바 레이아웃
- `.diagnosis-header` — 헤더 flex 레이아웃
- `.diagnosis-content` — 스크롤 콘텐츠 영역
- `.diagnosis-hero` — 카피 + 비주얼 2단 레이아웃
- `.diagnosis-headline` — 헤드라인 타이포그래피
- `.diagnosis-highlight` — 강조 텍스트 (brand green)
- `.diagnosis-visual` — 모델 이미지 컨테이너
- `.feature-icons` / `.f-icon` — 기능 아이콘 3개 행
- `.diagnosis-desc` / `.diagnosis-desc-line` — 설명 텍스트
- `.footer-supporting` — 보조 텍스트
- `.diagnosis-home-indicator` — iOS 홈 인디케이터

---

## 5. JS (`js/ui/IntroScreen.js`)

**책임**: 인트로 화면 이벤트 바인딩, 사이드바 토글, 네비게이션, 모바일 상태바 초기화

**주요 함수**:

| 함수 | 역할 | 원본 위치 |
|------|------|----------|
| `initMobileChrome()` | 시계·배터리·네트워크 상태바 초기화 | 3981~4068줄 |
| `toggleSidebar()` | 사이드바 메뉴 열기/닫기 | 4727~4730줄 |
| `goHome()` | `../index.html`로 이동 | 4731~4733줄 |
| `handleUserClick()` | 로그인 상태에 따라 login.html or index.html | 4734~4740줄 |
| `handleCartClick()` | 로그인 상태에 따라 Beta Modal or login.html | 4741~4750줄 |
| `startSurvey()` | 인트로 → 서베이 화면 전환 | 5575~5593줄 |
| `bindIntroEvents()` | 위 함수들을 버튼에 addEventListener로 연결 | 신규 |

**초기화 순서** (모듈 로드 시):
```
1. initMobileChrome()
2. trackLandingView()
3. setupAnalyticsObservers()
4. setupFieldAnalytics()
5. DOMContentLoaded → bindIntroEvents()
```

---

## 6. 이벤트 맵

| 요소 ID | 이벤트 | 호출 함수 |
|---------|-------|---------|
| `btn-start-survey` | click | `startSurvey()` |
| `sidebar-toggle` | click | `toggleSidebar()` |
| `sidebar-overlay` | click | `toggleSidebar()` |
| `btn-logo` | click | `goHome()` |
| `btn-user` | click | `handleUserClick()` |
| `btn-cart` | click | `handleCartClick()` |

---

## 7. URL 파라미터

| 파라미터 | 동작 |
|----------|------|
| `?survey` | 인트로 스킵, 서베이 직접 시작 (`startSurvey()` 호출) |
| `?survey&step=N` | 인트로 스킵 후 특정 스텝으로 이동 |

---

## 8. 의존성

```
IntroScreen.js
  └─ AnalyticsService.js (trackLandingView, setupAnalyticsObservers 등)
```
