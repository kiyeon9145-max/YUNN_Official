# index.html 코드 분리 계획

## 현재 상태

`index.html` (1,130줄) 단일 파일에 CSS·HTML·JS가 모두 혼재.

| 구분 | 줄 범위 | 줄 수 |
|------|---------|-------|
| `<style>` | 31 ~ 773 | 743줄 |
| HTML 구조 | 775 ~ 965 | 191줄 |
| `<script>` | 967 ~ 1128 | 162줄 |

---

## 작업 목표

- CSS → `styles/home.css` 분리
- JS → `js/ui/HomeScreen.js` 클래스 전환
- `index.html` → `<link>` + `<script type="module">` 로 교체
- `onclick=""` 인라인 핸들러 제거 → 클래스 내부 이벤트 바인딩으로 전환

---

## 파일 구조 (작업 후)

```
YUNN_Mobile/
├── index.html              ← <style> / <script> 제거, link·module만 남음
├── styles/
│   ├── home.css            ← NEW (index.html 전용 CSS 743줄)
│   ├── base.css            ← 기존 (survey.html 공용)
│   ├── components.css      ← 기존
│   ├── survey.css          ← 기존
│   └── result.css          ← 기존
└── js/
    └── ui/
        ├── HomeScreen.js   ← NEW (HomeScreen 클래스)
        ├── IntroScreen.js  ← 기존
        ├── SurveyScreen.js ← 기존
        ├── ResultScreen.js ← 기존
        └── ModalManager.js ← 기존
```

> `home.js` 별도 코디네이터 없음 — `HomeScreen.js` 모듈 레벨에서 직접 인스턴스 생성 및 `window.*` 노출. 홈 페이지는 의존성 주입이 없어 app.js 구조 불필요.

---

## CSS 분리 계획 (`styles/home.css`)

`index.html`의 `<style>` 블록 전체를 그대로 이관한다.
survey.html의 `styles/base.css`와 CSS 변수셋이 달라 공유 불가 — 충돌 방지를 위해 home.css가 독립 파일로 분리.

| 섹션 | 클래스/선택자 |
|------|-------------|
| 디자인 토큰 | `:root` 변수 |
| 글로벌 리셋 | `*`, `body`, `button`, `a` |
| 앱 쉘 | `.app-shell` |
| 상태바 | `.status-bar`, `.signal-bars`, `.wifi-mark`, `.battery-shell` |
| 헤더 | `.top-header`, `.header-icon`, `.logo`, `.cart-count` |
| 히어로 | `.hero-card`, `.hero-copy`, `.profile-btn`, `.hero-product`, `.routine-ring` |
| 카테고리 | `.category-grid`, `.category-item`, `.category-image`, `.tag-new` |
| 상품 그리드 | `.product-row`, `.product-card`, `.product-media`, `.heart-btn`, `.product-title`, `.add-cart` |
| 하단 내비 | `.bottom-nav`, `.nav-item` |
| 카트 시트 | `.modal-scrim`, `.cart-sheet`, `.sheet-grip`, `.cart-product`, `.sheet-summary`, `.sheet-actions` |
| 사이드바 | `.sidebar`, `.sidebar-panel` |
| 미디어쿼리 | `@media (min-width: 640px)` |

---

## JS 클래스 설계 (`js/ui/HomeScreen.js`)

### 클래스 구조

```js
export class HomeScreen {
  #cartCount = 0;

  init() { ... }                        // DOMContentLoaded 진입점

  // ── 공개 (window.* 노출 필요) ──────────────
  openCartSheet()    { ... }
  closeAllOverlays() { ... }
  toggleSidebar()    { ... }
  addToCart(name, image) { ... }
  showCheckoutNotice()   { ... }
  toggleWishlist(button) { ... }        // onclick에서 button 요소 직접 전달

  // ── 비공개 ──────────────────────────────────
  #applySessionUrlActions() { ... }
  #getCurrentUser()         { ... }     // → { nickname } | null
  #renderPersonalHero()     { ... }
  #updateDeviceTime()       { ... }
  #updateNetworkStatus()    { ... }
  #updateBatteryStatus()    { ... }     // async
  #showScrim()              { ... }
  #bindEvents()             { ... }     // connection change 리스너
}
```

### 모듈 레벨 초기화 (파일 하단)

```js
const home = new HomeScreen();

// onclick="" 속성이 전역 함수를 호출하므로 window.*로 노출
window.openCartSheet     = ()           => home.openCartSheet();
window.closeAllOverlays  = ()           => home.closeAllOverlays();
window.toggleSidebar     = ()           => home.toggleSidebar();
window.addToCart         = (n, img)     => home.addToCart(n, img);
window.showCheckoutNotice= ()           => home.showCheckoutNotice();
window.toggleWishlist    = (btn)        => home.toggleWishlist(btn);

document.addEventListener('DOMContentLoaded', () => home.init());
```

---

## index.html 변경 계획

### `<head>` 변경

```html
<!-- 제거 -->
<style> ... 743줄 ... </style>

<!-- 추가 -->
<link rel="stylesheet" href="styles/home.css">
```

### `</body>` 직전 변경

```html
<!-- 제거 -->
<script> ... 162줄 ... </script>

<!-- 추가 -->
<script type="module" src="js/ui/HomeScreen.js"></script>
```

### GTM 인라인 스크립트

`<head>` 상단의 GTM 초기화 블록 (lines 8~27) 은 **그대로 유지**.
GTM은 `<head>` 최상단에 동기적으로 실행되어야 하며, 외부 파일로 분리 시 로드 순서 보장 불가.

---

## 검증 체크리스트

- [ ] 브라우저 콘솔 오류 없음
- [ ] 로그아웃 상태 → hero 텍스트 "Welcome to YUNN" + 로그인 CTA
- [ ] 로그인 상태 → hero 텍스트 "Hi, {nickname}" + "My skin Profile"
- [ ] 상단 장바구니 버튼 → 카트 시트 열림
- [ ] 햄버거 메뉴 → 사이드바 열림, 스크림 표시
- [ ] "Add to Cart" 클릭 → 카트 카운트 증가 + 시트 열림
- [ ] 하트 버튼 → 활성/비활성 토글
- [ ] 상태바 시간 1초마다 갱신
- [ ] `?logout` URL 파라미터 → localStorage 클리어
