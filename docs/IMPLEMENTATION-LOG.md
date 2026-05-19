# YUNN Implementation Log

이 문서는 Codex가 웹사이트를 수정할 때마다 변경 내용을 복구 가능한 형태로 남기기 위한 작업 기록입니다.

## Working Rule

- 코드 변경을 하면 이 문서에 변경 목적, 수정 파일, 주요 구현 내용, 검증 방법을 기록한다.
- 핵심 화면 파일을 크게 바꿀 때는 `docs/code-backups/YYYY-MM-DD/` 아래에 복구용 사본을 남긴다.
- Figma 디자인을 기준으로 구현할 때는 Figma 프레임 이름과 웹 파일의 대응 관계를 함께 적는다.
- 임시 생성 스크립트보다 실제 서비스 진입 파일을 우선 기록한다.

## 2026-05-19

### 피그마 기반 스킨 타입 선택(Step 4) 2x2 이미지 카드 그리드 개편

Purpose:
피그마 모바일 UI에 맞춰 기존의 텍스트 기반 단일 리스트 형태였던 '스킨 타입 선택' 화면을 2x2 이미지 카드가 배치된 형태로 개편했다.

Changed files:
- `survey_gen_fixed.py`
- `survey.html` (generated)
- `docs/code-backups/2026-05-19/survey_gen_fixed.before-step4-grid.py`
- `docs/code-backups/2026-05-19/survey.before-step4-grid.html`

Main implementation:
- 기존의 `<label class="option-card">` 컴포넌트의 클릭/선택 로직을 100% 재사용하여 안전성을 확보했다.
- CSS Grid (`grid-template-columns: 1fr 1fr`)를 활용한 `.skin-grid` 생성.
- `oily skin.png`, `Dry skin.png`, `combination skin .png`, `normal skin.png` 에셋 맵핑 및 이미지 박스 구현.
- 선택 시 배경색 전체가 아닌 하단 텍스트 박스(`.skin-card-content`)만 색이 변하도록 세밀한 CSS 조정 적용.
- 하단 전체 폭을 사용하는 `Not sure` 버튼을 `.not-sure-card`로 추가.
- `survey_gen_fixed.py`를 실행하여 새로운 `survey.html` 자동 빌드 완료.

Verification:
- Python 스크립트 정상 실행 및 `survey.html` 생성 확인.
- 라디오 버튼 네임(`skinType`)과 기존 로직 파이프라인 일치 확인.



Purpose:
Figma 파일 `YUNN웹디자인`의 모바일 홈 프레임 `첫 화면 / 모바일_와이어프레임`을 기준으로 `index.html`을 모바일 앱형 홈 화면으로 재구성했다.

Changed files:
- `index.html`
- `docs/code-backups/2026-05-18/index.figma-home.html`

Main implementation:
- 393px 모바일 앱 셸 구조 추가
- iOS 스타일 상태바, 상단 헤더, YUNN 로고, 메뉴/검색/알림/장바구니 아이콘 구현
- Figma의 민트톤 히어로 카드 구현
- 루틴 진행 원형 카드 `Routine 3/5 steps done` 구현
- `Shop by Category` 8개 카테고리 그리드 구현
- `Top Selling` 3개 상품 카드 구현
- 하단 고정 탭 네비게이션 구현
- `Quiz`와 `My skin Profile`을 `survey.html`로 연결
- 상품 `Add to Cart` 클릭 시 Figma 장바구니 모달 스타일의 하단 시트가 열리도록 구현
- 사이드 메뉴가 닫힌 상태에서 닫기 아이콘이 노출되지 않도록 `visibility` 처리

Figma mapping:
- `첫 화면 / 모바일_와이어프레임` → `index.html`
- `장바구니_모달 팝업` → `index.html` 내부 `.cart-sheet`
- `Component 3/하단 카테고리` → `index.html` 내부 `.bottom-nav`

Verification:
- 로컬 서버 `http://127.0.0.1:8123/index.html`에서 페이지 로드 확인
- 브라우저 콘솔 에러 없음 확인
- 홈 화면 스크린샷 기준으로 헤더, 히어로, 카테고리, Top Selling, 하단 탭이 Figma와 유사하게 표시되는 것 확인

### Survey 연결 및 구조 보정

Purpose:
홈에서 진단 플로우로 이동하는 연결을 실제 설문 페이지와 맞추고, 결과 화면 HTML 구조를 안정화했다.

Changed files:
- `survey.html`
- `index.html`
- `docs/code-backups/2026-05-18/survey.current-flow.html`

Main implementation:
- `survey.html` 결과 화면의 닫는 `</div>` 누락 보정
- 기존 `skin_profile.html` 이동을 `survey.html` 이동으로 변경
- 하단 `Quiz` 탭이 `survey.html`로 이동하도록 수정
- 하단 네비게이션 JS가 실제 링크 이동을 막지 않도록 `href !== "#"`인 경우 기본 링크 동작을 허용

Verification:
- `landing.html` → `survey.html` 이동 확인
- `index.html` → `survey.html` 이동 확인
- 설문 결과 화면 렌더링 확인
- 브라우저 콘솔 에러 없음 확인

### 홈 로고 및 상태바 표시 개선

Purpose:
홈 화면 상단의 YUNN 브랜드 로고가 작게 보이고, 모바일 상태바의 시간/네트워크/와이파이/배터리 아이콘이 깨진 폰트 기호처럼 보이는 문제를 수정했다.

Changed files:
- `index.html`
- `docs/code-backups/2026-05-18/index.before-logo-status-fix.html`
- `docs/code-backups/2026-05-18/index.logo-status-fixed.html`

Main implementation:
- YUNN 로고 표시 영역을 키우고, 원본 PNG 내부 투명 여백 때문에 작게 보이는 문제를 보정하기 위해 헤더 중앙 로고에 `scale(1.75)` 적용
- Phosphor 아이콘 기반의 상태바 표시를 제거하고 CSS 기반 상태바 아이콘으로 교체
- 현재 시간을 `Date` 기반으로 1초마다 갱신하도록 구현
- 브라우저가 제공하는 `navigator.connection` 정보가 있으면 네트워크 라벨을 갱신하도록 구현
- 브라우저가 제공하는 `navigator.getBattery()` 정보가 있으면 배터리 잔량 표시를 갱신하도록 구현

Limitations:
- 웹 브라우저 보안 정책상 실제 휴대폰 OS의 통신사, 와이파이 종류, 전체 상태바 아이콘을 100% 직접 읽어오는 것은 불가능하다.
- 최종 모바일 배포에서 진짜 OS 상태바와 완전히 연동된 경험이 필요하면 웹페이지 내부 가짜 상태바를 제거하고, 브라우저/PWA의 native status bar를 사용하는 방향이 더 정확하다.

Verification:
- `http://127.0.0.1:8123/index.html`에서 로고 확대 확인
- 상태바 아이콘이 깨진 문자 대신 CSS 아이콘으로 표시되는 것 확인
- 시간, 네트워크 라벨, 배터리 표시 값이 스크립트로 렌더링되는 것 확인
- 브라우저 콘솔 에러 없음 확인

### 홈 카테고리 NEW 배지 수정

Purpose:
홈 화면 `Shop by Category` 영역에서 `NEW` 배지가 카테고리 원 이미지와 겹쳐 깨져 보이는 문제를 수정했다.

Changed files:
- `index.html`
- `docs/code-backups/2026-05-18/index.before-new-badge-fix.html`
- `docs/code-backups/2026-05-18/index.new-badge-fixed.html`

Main implementation:
- `.tag-new` 위치를 원 내부에서 좌상단 바깥쪽으로 이동
- 배지 크기, 폰트 크기, 굵기, 줄 높이, 패딩을 조정해 `NEW` 텍스트가 잘리지 않게 수정
- `z-index`와 약한 그림자를 추가해 이미지 위에서도 선명하게 보이도록 처리

Verification:
- `http://127.0.0.1:8123/index.html`에서 `Moisturiser`, `Sunscreen`의 `NEW` 배지가 잘리지 않고 표시되는 것 확인
- 브라우저 콘솔 에러 없음 확인

### 홈 히어로 로그인 상태 대응

Purpose:
홈 히어로 카드의 `(사용자 닉네임)` 텍스트를 고정 문구가 아닌 로그인 사용자 데이터로 표시하고, 비로그인 상태에서는 로그인 유도 카드로 바뀌도록 수정했다. 또한 `Your skin journey is on track` 문구에서 `on track`이 깨져 보이지 않도록 줄바꿈과 문장 간격을 조정했다.

Changed files:
- `index.html`
- `login.html`
- `docs/code-backups/2026-05-18/index.before-login-hero-state.html`
- `docs/code-backups/2026-05-18/index.login-aware-hero.html`
- `docs/code-backups/2026-05-18/login.demo.html`

Main implementation:
- `localStorage.yunnUser` 또는 `localStorage.yunnUserNickname`을 읽어 로그인 사용자 닉네임을 홈 히어로에 표시
- 로그인 상태일 때 `Hi, {nickname}`과 `Your skin journey is / on track` 문구 표시
- 비로그인 상태일 때 `Welcome to YUNN`, 로그인 유도 문구, `Log in to continue` CTA 표시
- `on track`과 `and routine progress`를 강조 텍스트 블록으로 줄바꿈 처리
- 실제 백엔드 로그인 전까지 데모로 닉네임을 저장할 수 있는 `login.html` 추가

Verification:
- 비로그인 상태에서 홈 히어로가 로그인 유도 카드로 표시되는 것 확인
- `login.html`에서 닉네임 `Ananya` 입력 후 홈으로 이동하면 `Hi, Ananya`가 표시되는 것 확인
- `on track`이 줄바꿈되어 깨지지 않는 것 확인
- 브라우저 콘솔 에러 없음 확인

### 비로그인 홈 히어로 레이아웃 개선

Purpose:
비로그인 상태의 홈 히어로에서 루틴 진행 원이 의미 없는 정보로 보이고 텍스트와 이미지가 서로 답답하게 배치되는 문제를 수정했다.

Changed files:
- `index.html`
- `docs/code-backups/2026-05-18/index.before-logged-out-hero-layout.html`
- `docs/code-backups/2026-05-18/index.logged-out-hero-layout.html`

Main implementation:
- 비로그인 상태 `.hero-card.logged-out`에서는 `.routine-ring`을 숨김 처리
- 비로그인 상태 텍스트 영역을 `220px`로 확장해 가독성 개선
- 비로그인 상태 메시지의 폰트 크기와 줄 간격을 조정
- 오른쪽 제품 이미지를 `124px` 폭으로 줄이고 카드 오른쪽 하단에 배치해 텍스트를 침범하지 않도록 조정
- `?logout=1` URL 파라미터를 통해 데모 로그인 데이터를 지우고 비로그인 상태를 확인할 수 있도록 구현

Verification:
- `http://127.0.0.1:8123/index.html?logout=1`로 비로그인 히어로 확인
- 루틴 원이 표시되지 않는 것 확인
- 텍스트와 오른쪽 제품 이미지가 겹치지 않는 것 확인
- 브라우저 콘솔 에러 없음 확인

### 비로그인 히어로 문구/이미지 미세 조정

Purpose:
비로그인 히어로에서 `Log in to track your skin journey`가 두 줄로 끊겨 가독성이 떨어지고, 오른쪽 제품 이미지가 다소 작게 보이는 문제를 수정했다.

Changed files:
- `index.html`
- `docs/code-backups/2026-05-18/index.before-logged-out-copy-image-tune.html`
- `docs/code-backups/2026-05-18/index.logged-out-copy-image-tuned.html`

Main implementation:
- 비로그인 상태 텍스트 영역을 `235px`로 확장
- 비로그인 상태 본문 최대 폭을 `232px`로 확장해 `skin journey`가 한 줄에 들어가도록 조정
- 오른쪽 제품 이미지를 `142px` 폭으로 확대
- 이미지 위치를 오른쪽 하단에 재배치해 텍스트 영역과 겹치지 않게 유지

Verification:
- `http://127.0.0.1:8123/index.html?logout=1`에서 비로그인 히어로 확인
- `Log in to track your skin journey`가 한 줄로 표시되는 것 확인
- 오른쪽 제품 이미지가 커졌지만 텍스트와 겹치지 않는 것 확인
- 브라우저 콘솔 에러 없음 확인

### NEW 배지 타이포그래피 및 비로그인 이미지 엣지 조정

Purpose:
홈 카테고리 `NEW` 배지의 텍스트가 너무 굵고 꽉 차 보이는 문제를 완화하고, 비로그인 히어로의 제품 이미지를 조금 더 키워 카드 오른쪽에 자연스럽게 연결되도록 조정했다.

Changed files:
- `index.html`
- `docs/code-backups/2026-05-18/index.before-new-badge-typography.html`
- `docs/code-backups/2026-05-18/index.before-hero-image-edge-tune.html`
- `docs/code-backups/2026-05-18/index.hero-image-edge-new-badge-typography.html`

Main implementation:
- `.tag-new`의 `font-weight`를 `600`에서 `400`으로 낮춤
- `NEW` 배지 좌우 패딩을 `6px`로 늘리고 최소 폭을 넓혀 내부 여백 확보
- 비로그인 상태의 오른쪽 제품 이미지를 `158px` 폭으로 확대
- 제품 이미지를 카드 오른쪽 가장자리 쪽으로 붙여 보조 비주얼이 박스와 자연스럽게 연결되도록 조정

Verification:
- `http://127.0.0.1:8123/index.html?logout=1`에서 비로그인 히어로와 카테고리 배지 확인
- `NEW` 배지의 폰트가 얇아지고 내부 여백이 확보된 것 확인
- 오른쪽 제품 이미지가 커졌지만 텍스트와 겹치지 않는 것 확인
- 브라우저 콘솔 에러 없음 확인

### 레퍼런스 기반 홈 이미지/배지/하트 폴리시

Purpose:
사용자 제공 레퍼런스에 맞춰 히어로 제품 이미지를 더 크게 만들고, `NEW` 배지 내부 여백을 더 확보하며, Top Selling 카드의 하트 버튼 배경을 제거했다.

Changed files:
- `index.html`
- `docs/code-backups/2026-05-18/index.before-reference-polish.html`
- `docs/code-backups/2026-05-18/index.reference-polish.html`

Main implementation:
- 로그인/비로그인 홈 히어로 제품 이미지를 더 크게 조정
- 비로그인 제품 이미지는 카드 오른쪽 가장자리 바깥으로 살짝 붙여 레퍼런스처럼 연결된 느낌을 강화
- `.category-item span` 선택자를 `.category-item > span`으로 좁혀 카테고리 이름 스타일이 `NEW` 배지에 먹지 않도록 수정
- `NEW` 배지 폰트를 `8px`, `400` weight로 적용하고 좌우 패딩을 확보
- Top Selling 하트 버튼의 반투명 배경 제거
- 하트 아이콘은 이미지 위에 직접 올라간 것처럼 보이도록 투명 배경과 약한 흰색 text-shadow 적용

Verification:
- `NEW` 배지의 실제 계산 스타일이 `font-size: 8px`, `font-weight: 400`, `padding: 0 8px`로 적용되는 것 확인
- 하트 버튼 배경이 `rgba(0, 0, 0, 0)`로 투명 처리된 것 확인
- 히어로 제품 이미지 크기가 비로그인 상태 기준 `186px` 폭으로 확대된 것 확인
- 브라우저 콘솔 에러 없음 확인

Note:
- 브라우저 스크린샷 캡처가 일시적으로 타임아웃되어 최종 검증은 DOM/CSS 계산값으로 확인했다.

### NEW 배지 글씨 크기 12px 조정

Purpose:
카테고리 `NEW` 배지의 글씨 크기를 사용자 요청에 따라 `12px`로 키웠다.

Changed files:
- `index.html`
- `docs/code-backups/2026-05-18/index.before-new-12px.html`
- `docs/code-backups/2026-05-18/index.new-12px.html`

Main implementation:
- `.tag-new`의 `font-size`를 `12px`로 변경
- 글씨가 배지 안에서 답답하지 않도록 `line-height`와 `height`를 `18px`로 조정
- 배지 최소 폭을 `44px`로 조정

Verification:
- `http://127.0.0.1:8123/index.html`에서 `.tag-new` 계산 스타일 확인
- 실제 적용값: `font-size: 12px`, `height: 18px`, `line-height: 18px`, `padding: 0 8px`
- 브라우저 콘솔 에러 없음 확인

### Figma 진단 시작 페이지 적용 및 설명 문단 간격 정리

Purpose:
Figma 프레임 `진단 페이지 시작`을 기준으로 `survey.html`의 시작 화면을 재구성하고, 사용자 피드백에 따라 하단 설명 문장이 끊겨 보이지 않도록 줄 간격을 균일하게 조정했다.

Changed files:
- `survey.html`
- `docs/code-backups/2026-05-18/survey.before-figma-diagnosis-start.html`
- `docs/code-backups/2026-05-18/survey.before-diagnosis-desc-spacing.html`
- `docs/code-backups/2026-05-18/survey.figma-diagnosis-start-spacing.html`

Main implementation:
- 모바일 상태바, 헤더, 중앙 YUNN 로고, 우측 아이콘 영역을 피그마 시작 화면 기준으로 재구성
- 진단 시작 히어로 문구, AI 분석 이미지, 기능 아이콘 row, CTA 영역을 `diagnosis-*` 전용 클래스로 분리
- `survey.start.image.png`가 이미 AI 카드가 합성된 이미지라 중복 카드 레이어를 제거
- 하단 설명 문단을 한 줄 단위 `.diagnosis-desc-line` 구조로 변경
- 각 설명 줄의 높이와 margin을 동일하게 적용해 문장 간격이 일정하게 보이도록 조정

Verification:
- `http://127.0.0.1:8123/survey.html`에서 진단 시작 화면 확인
- 하단 설명 문장 7줄이 동일한 `22px` line box와 `15px` 줄 간격으로 렌더링되는 것 확인
- `Start My Skin Analysis` CTA가 정상 표시되는 것 확인
- 브라우저 콘솔 에러 없음 확인

### 진단 시작 페이지 로고 이미지 복구

Purpose:
진단 시작 페이지 헤더의 임시 텍스트 로고를 제거하고 사용자가 제공한 실제 로고 파일 `image/yuun_logo png.png`를 적용했다.

Changed files:
- `survey.html`
- `docs/code-backups/2026-05-18/survey.before-logo-image-restore.html`
- `docs/code-backups/2026-05-18/survey.logo-image-restored.html`

Main implementation:
- `.diagnosis-logo-mark` 래퍼를 추가해 실제 PNG 로고를 헤더 중앙에 배치
- 원본 PNG가 `521x479` 투명 캔버스라 작게 보이지 않도록 래퍼 안에서 확대 및 마스킹 처리
- 로고 클릭 시 기존 `goHome()` 동작 유지

Verification:
- `http://127.0.0.1:8123/survey.html`에서 로고 이미지 로드 확인
- 실제 로고 `src`가 `image/yuun_logo png.png`로 연결된 것 확인
- 브라우저에서 로고가 중앙 헤더에 정상 표시되는 것 확인

### 진단 시작 페이지 로고 크기 및 실시간 상태바 조정

Purpose:
진단 시작 페이지의 실제 PNG 로고가 너무 크게 확대되어 깨져 보이는 문제를 줄이고, 상단 상태바를 고정 가짜 아이콘 대신 가능한 브라우저 실시간 값으로 표시하도록 변경했다.

Changed files:
- `survey.html`
- `docs/code-backups/2026-05-19/survey.before-logo-status-live.html`
- `docs/code-backups/2026-05-19/survey.logo-status-live.html`

Main implementation:
- `.diagnosis-logo-mark` 표시 영역을 `86x28px`로 줄이고 내부 PNG 확대 폭을 `112px`로 낮춰 로고 깨짐 완화
- CSS로 그린 신호/와이파이/배터리 아이콘을 제거
- `initDiagnosisStatusBar()`를 추가해 현재 시간을 실시간 표시
- `navigator.connection` 지원 시 네트워크 상태를 `4G`, `3G`, `Online` 등으로 표시
- `navigator.getBattery()` 지원 시 배터리 퍼센트를 표시

Verification:
- `http://127.0.0.1:8123/survey.html`에서 로고 이미지가 `image/yuun_logo png.png`로 로드되는 것 확인
- 상태바 시간이 현재 시각으로 표시되는 것 확인
- 테스트 브라우저에서 네트워크 `4G`, 배터리 `100%` 값이 표시되는 것 확인

Note:
- iOS/Android 브라우저 보안 정책상 웹페이지가 실제 OS 상태바 아이콘을 그대로 가져올 수는 없다. 지원되는 API 값이 없을 때는 가짜 아이콘을 만들지 않고 안전한 텍스트 상태만 표시한다.

### 진단 시작 페이지 로고 홈 화면 방식 적용

Purpose:
진단 시작 페이지 로고를 홈 화면과 같은 `yuun_logo png.png` 표시 방식으로 맞춰 위쪽 원형 장식이 잘려 보이는 문제를 해결했다.

Changed files:
- `survey.html`
- `docs/code-backups/2026-05-19/survey.before-home-logo-match.html`
- `docs/code-backups/2026-05-19/survey.home-logo-match.html`

Main implementation:
- `.diagnosis-header` 높이를 홈 화면과 동일한 `56px`로 조정
- `.diagnosis-logo-mark`를 헤더 중앙 absolute 배치로 변경
- 로고 PNG를 홈 화면처럼 `128x58px` 기준에 `scale(1.75)`로 표시
- 로고 래퍼의 `overflow: hidden`을 제거해 위쪽 원형 장식이 잘리지 않도록 수정
- 메뉴/액션 아이콘의 `z-index`를 로고보다 높여 클릭 동작 방해를 방지

Verification:
- `http://127.0.0.1:8123/survey.html`에서 실제 로고 파일 로드 확인
- 로고 표시 방식이 홈 화면과 같은 크기/스케일 기준으로 적용된 것 확인
- 헤더 액션 영역이 로고보다 위 레이어에 있는 것 확인

### 설문 1페이지 Figma 모바일 UI 적용

Purpose:
사용자가 제공한 Figma 설문 입력 화면을 기준으로 `Page 1 of 10` 화면의 글 배치, 색상, 입력 카드, 버튼, 보안 문구, 모바일 상태바 및 iOS 전용 하단 브라우저 바를 재구성했다.

Changed files:
- `survey.html`
- `docs/code-backups/2026-05-19/survey.before-step1-figma-mobile.html`
- `docs/code-backups/2026-05-19/survey.step1-figma-mobile.html`

Main implementation:
- 설문 화면 전용 `.survey-app-shell`, `.survey-status-bar`, `.survey-top-header` 추가
- 피그마 `헤더`, `상태 입력 박스`, `안전 문구`, `버튼 / back or next`, `아이폰 하단 바` 컴포넌트 기준으로 Step 1 재구성
- `Your Name`, `Email`, `Phon Number` 입력 카드를 흰색 카드, 1px `#EBEBEB` 테두리, 5px radius, 약한 그림자로 구현
- 제목 `Let’s Start / with the basics`에서 강조색 `#3AAE92` 적용
- 버튼을 `150x40px`, 12px radius, Back outline / Next filled 형태로 변경
- iOS 모바일 환경에서만 `.ios-browser-toolbar`와 홈 인디케이터가 보이도록 `is-ios-mobile` 클래스를 JS로 제어
- `?survey=1` URL 파라미터로 설문 1페이지를 직접 확인할 수 있도록 보조 진입점 추가

Verification:
- Figma 컴포넌트 `214:1382`, `214:1402`, `242:1341`, `284:4961` 디자인 컨텍스트 확인
- `http://127.0.0.1:8123/survey.html?survey=1`에서 DOM 스냅샷으로 `Page 1 of 10`, 제목, 입력 3개, 보안 문구, Back/Next 버튼 확인
- 상태바 시간이 실시간으로 표시되고 네트워크 값이 표시되는 것 확인
- iOS 하단 브라우저 바는 iOS 모바일 조건에서만 표시되도록 구현

### 설문 상태바 와이파이 아이콘 수정

Purpose:
상단 상태바의 CSS 와이파이 아이콘이 작은 크기에서 집 모양처럼 깨져 보이는 문제를 수정했다.

Changed files:
- `survey.html`
- `docs/code-backups/2026-05-19/survey.before-status-wifi-icon-fix.html`
- `docs/code-backups/2026-05-19/survey.status-wifi-icon-fixed.html`

Main implementation:
- 직접 CSS 선으로 그리던 `.survey-wifi-mark` pseudo-element 제거
- Phosphor의 `ph-fill ph-wifi-high` 아이콘을 사용해 와이파이 모양이 깨지지 않도록 변경

Verification:
- `http://127.0.0.1:8123/survey.html?survey=1` DOM 스냅샷에서 상태바 네트워크 값과 와이파이 아이콘이 별도 요소로 표시되는 것 확인

### 공통 네트워크 상태바 슬롯 규칙 적용

Purpose:
상태바에서 `4G/5G` 데이터 표시는 와이파이 아이콘 옆에 별도로 붙는 값이 아니라, 셀룰러 데이터를 사용할 때 와이파이 아이콘 자리를 대체하는 공통 변수로 동작하도록 정리했다. 이 규칙을 홈과 설문 화면에 동일하게 적용했다.

Changed files:
- `index.html`
- `survey.html`
- `docs/code-backups/2026-05-19/index.before-shared-network-status.html`
- `docs/code-backups/2026-05-19/index.shared-network-status.html`
- `docs/code-backups/2026-05-19/survey.before-shared-network-status.html`
- `docs/code-backups/2026-05-19/survey.shared-network-status-logo-aligned.html`

Main implementation:
- 홈 상태바의 `network-label + wifi-mark` 구조를 `network-slot`으로 통합
- 설문 상태바의 `survey-network-label + survey-wifi-mark` 구조를 `survey-network-slot`으로 통합
- 네트워크 타입이 `4G/5G/3G/2G/cellular`일 때 슬롯에 텍스트 표시
- 그 외 온라인 상태에서는 같은 슬롯에 와이파이 아이콘 표시
- 오프라인 상태에서는 슬롯에 `Off` 표시
- 설문 헤더 로고를 메뉴/검색/프로필/장바구니 아이콘 중심선과 맞추도록 위치 재조정

Verification:
- `http://127.0.0.1:8123/survey.html?survey=1`에서 상태바 슬롯이 `4G`로 표시되는 것 확인
- 설문 헤더에서 로고 중심선과 메뉴 아이콘 중심선이 같은 `cy=91`로 정렬되는 것 확인

### 설문 헤더 우측 아이콘 간격 압축

Purpose:
설문 헤더에서 우측 검색/프로필/장바구니 아이콘 묶음이 너무 벌어져 보여, 로고는 화면 중앙선을 기준으로 유지하면서 우측 아이콘 묶음을 더 촘촘하게 정렬했다.

Changed files:
- `survey.html`
- `docs/code-backups/2026-05-19/survey.before-header-icon-spacing.html`
- `docs/code-backups/2026-05-19/survey.header-icon-spacing.html`

Main implementation:
- `.survey-header-actions`의 gap을 `18px`에서 `10px`로 축소
- 우측 아이콘 각각의 margin 기준을 제거하고 아이콘 그룹 자체를 메뉴/로고 중심선에 맞춤
- 장바구니 wrapper를 `24x24px` inline-flex로 고정해 다른 아이콘과 같은 정렬 기준 사용

Verification:
- `http://127.0.0.1:8123/survey.html?survey=1`에서 헤더 위치값 확인
- 로고 중심 `cx=292`가 화면 중앙 `shellCenter=292`와 일치
- 메뉴, 로고, 우측 아이콘 그룹 모두 중심선 `cy=91`로 정렬
- 우측 아이콘 그룹 gap이 `10px`로 적용된 것 확인

### 진단/설문 페이지 검색 기능 제거 및 보안 문구 폭 조정

Purpose:
진단 페이지 전체에서 검색 기능을 제거하고, 설문 1페이지 보안 안내의 첫 문장이 한 줄로 표시되도록 입력 카드와 같은 가로 폭으로 맞췄다.

Changed files:
- `survey.html`
- `docs/code-backups/2026-05-19/survey.before-remove-search-icons.html`
- `docs/code-backups/2026-05-19/survey.remove-search-secure-line.html`

Main implementation:
- 진단 시작 헤더와 설문 헤더에서 돋보기 검색 아이콘 제거
- `search-modal`, `search-input-wrapper`, `toggleSearch()` 제거
- 설문 헤더 우측 아이콘을 프로필/장바구니 2개만 남김
- `.step-one-secure` 폭을 입력 카드와 동일하게 `100%`로 변경
- 보안 문구 텍스트를 `white-space: nowrap`으로 유지하고 자간/패딩을 조정

Verification:
- `http://127.0.0.1:8123/survey.html?survey=1`에서 검색 아이콘 수 `0`, 검색 모달 없음 확인
- 우측 헤더 아이콘 수가 프로필/장바구니 2개로 유지되는 것 확인
- 보안 문구 박스 폭이 입력 카드와 동일한 `343px`로 렌더링되는 것 확인
- `Your information is 100% safe and secure.` 문장 한 줄 표시 확인

### Step 1 입력 검증 및 이메일 오류 UI

Purpose:
설문 1페이지의 이름, 이메일, WhatsApp 번호가 올바른 형식일 때 입력란 우측에 초록 체크를 표시하고, 이메일 형식이 잘못되었을 때 빨간 테두리와 오류 문구를 표시하도록 구현했다.

Changed files:
- `survey.html`
- `docs/code-backups/2026-05-19/survey.before-step1-validation.html`
- `docs/code-backups/2026-05-19/survey.step1-validation.html`

Main implementation:
- `.step-input-wrap`, `.step-valid-check`, `.step-field-error` 추가
- 이름, 이메일, WhatsApp 입력란에 정상 입력 시 `ph-fill ph-check-circle` 초록 체크 표시
- 이메일 오류 메시지 `Please enter a valid email address.` 추가
- 이메일 입력 중에는 오류 상태를 원래 색으로 되돌리고, blur 또는 Next 검증 시 오류 표시
- `isValidIndianMvpEmail()` 함수 추가
- `RECOMMENDED_INDIAN_EMAIL_DOMAINS` 상수로 인도 사용자에게 자주 쓰이는 이메일 도메인 정리
- WhatsApp 번호는 인도 번호 기준 `6-9`로 시작하는 10자리 숫자만 통과
- 모든 Step 1 값이 유효할 때만 Next 버튼 활성화

Email validation rules:
- `local-part@domain` 구조 필수
- `@`는 정확히 1개만 허용
- 공백, 한글/비ASCII 문자 차단
- local-part 허용 문자: 영문 소문자/숫자/`.`/`_`/`%`/`+`/`-`
- domain 허용 문자: 영문 소문자/숫자/`.`/`-`
- local-part 시작/끝 특수문자 차단
- 연속 점(`..`) 차단
- domain에 점(`.`) 필수
- TLD는 영문 2자 이상 필수

Verification:
- `survey.html` 내 스크립트 문법 검증 통과
- 브라우저 자동 입력 검증은 플러그인 가상 클립보드 문제로 제한됨

### 이메일 허용 도메인 검증 강화

Purpose:
`test@gmai.com`처럼 이메일 문법은 맞지만 사용자가 제공한 인도 기준 허용 도메인 목록에 없는 오타 도메인이 정상으로 처리되는 문제를 수정했다.

Changed files:
- `survey.html`
- `docs/code-backups/2026-05-19/survey.before-email-domain-allowlist.html`
- `docs/code-backups/2026-05-19/survey.email-domain-allowlist.html`

Main implementation:
- `RECOMMENDED_INDIAN_EMAIL_DOMAINS`를 실제 검증에 사용하는 `ALLOWED_INDIAN_EMAIL_DOMAINS`로 변경
- 이메일 domain이 허용 목록에 포함될 때만 정상 처리
- 허용 도메인: `gmail.com`, `outlook.com`, `yahoo.com`, `yahoo.in`, `hotmail.com`, `rediffmail.com`, `icloud.com`

Verification:
- `test@gmai.com` -> false
- `test@gmail.com` -> true
- `priya@gmail` -> false
- `priya@@gmail.com` -> false
- `홍길동@gmail.com` -> false
- `anika_2001@yahoo.in` -> true

### 전화번호 오타 수정 및 오류 UI 추가

Purpose:
설문 1페이지의 `Phon Number` 오타를 `Phone Number`로 수정하고, 인도 전화번호 형식이 틀렸을 때 사용자가 어떤 필드가 틀렸는지 알 수 있도록 이메일과 같은 오류 UI를 추가했다.

Changed files:
- `survey.html`
- `docs/code-backups/2026-05-19/survey.before-phone-validation.html`
- `docs/code-backups/2026-05-19/survey.phone-validation.html`

Main implementation:
- `Phon Number` -> `Phone Number` 수정
- 전화번호 오류 메시지 `Please enter a valid Indian phone number.` 추가
- 전화번호 blur 또는 Next 클릭 시 잘못된 번호에 빨간 테두리와 오류 문구 표시
- 전화번호를 다시 입력하기 시작하면 오류 상태를 원래 색으로 복귀
- 인도 휴대폰 번호 기준 `6-9`로 시작하는 10자리 숫자만 통과
- 이메일, 이름, 전화번호가 모두 유효할 때만 Next 버튼 활성화

Verification:
- `survey.html` 내 스크립트 문법 검증 통과
- `Phone Number` 문구와 전화번호 오류 문구가 파일에 반영된 것 확인

### 선택 박스 메인 텍스트 볼드 통일

Purpose:
사용자 요청에 따라 선택 카드/버튼의 메인 텍스트를 `Oily` 카드처럼 볼드체로 통일했다. 새 아이콘 추가 방향은 중단하고 현재 오른쪽 체크 선택 형태를 유지했다.

Changed files:
- `survey.html`
- `docs/code-backups/2026-05-19/survey.before-option-main-bold.html`
- `docs/code-backups/2026-05-19/survey.option-main-bold.html`

Main implementation:
- 공통 `.option-text`의 `font-weight`를 `700`으로 변경
- 2페이지 성별/나이 선택지의 `.step-two-check-options .option-text`를 `700`으로 변경
- `.step-two-option-text`도 `700`으로 맞춰 이후 동일 스타일 확장 시 볼드 기준 유지

Verification:
- `http://127.0.0.1:8123/survey.html?survey=1&step=2`에서 첫 선택지 `Female`의 계산 스타일 `font-weight: 700` 확인
- 2페이지 Next 버튼은 성별/나이 선택 전 비활성 상태 유지 확인

### 2페이지 성별/나이 선택 카드 UI 통일

Purpose:
사용자 요청에 따라 2페이지의 성별/나이 선택 박스를 `Oily`, `Dry` 선택 카드와 같은 UI 톤으로 통일했다. 기존 오른쪽 체크 선택 형태는 유지했다.

Changed files:
- `survey.html`
- `docs/code-backups/2026-05-19/survey.before-step2-card-ui-match.html`
- `docs/code-backups/2026-05-19/survey.step2-card-ui-match.html`

Main implementation:
- 2페이지 선택 카드 높이를 `92px`로 맞추고, 흰 배경/14px 라운드/가벼운 그림자 스타일 적용
- 선택 전 카드는 흰색 테두리와 은은한 그림자를 사용해 `Oily`, `Dry` 카드의 부드러운 박스감과 맞춤
- 선택 후 카드는 초록 테두리, 연녹색 배경, 오른쪽 체크 원형 아이콘을 유지
- 성별/나이 카드 텍스트는 `font-weight: 700`으로 유지해 메인 선택 텍스트를 볼드 기준으로 통일

Verification:
- `http://127.0.0.1:8123/survey.html?survey=1&step=2&cardMatch=1779157000000`에서 Step 2 활성 상태 확인
- 첫 선택 카드 계산 스타일 확인: `height: 92px`, `border-radius: 14px`, `background: rgb(255, 255, 255)`, `box-shadow: rgba(0, 0, 0, 0.04) 0px 2px 12px 0px`
- 첫 선택 카드 텍스트 계산 스타일 확인: `font-weight: 700`
- Step 2 Next 버튼은 성별/나이 선택 전 비활성 상태 유지 확인

### GitHub 원격 백업 정책 반영

Purpose:
사용자가 앞으로 작업 파일을 GitHub 저장소에 업로드해 백업하겠다고 지정했기 때문에, 공식 원격 백업 저장소 주소와 작업 후 백업 흐름을 문서 규칙에 반영했다.

Changed files:
- `docs/AI-WORK-RULES.md`
- `docs/BACKUP-POLICY.md`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-github-remote-policy.md`
- `docs/code-backups/2026-05-19/AI-WORK-RULES.before-github-remote-policy.md`

Main implementation:
- 공식 GitHub 원격 백업 저장소를 `https://github.com/kiyeon9145-max/YUNN_Official_v2.git`로 기록
- 모든 주요 작업은 로컬 `docs/code-backups/` 백업과 구현 로그를 남긴 뒤 Git 커밋/푸시 가능한 상태로 정리하도록 명시
- Git 인증이 가능한 환경이거나 사용자가 요청한 경우 원격 저장소에 커밋/푸시하는 흐름을 `BACKUP-POLICY.md`에 추가

Verification:
- `docs/AI-WORK-RULES.md`와 `docs/BACKUP-POLICY.md`에서 원격 저장소 주소가 검색되는지 확인

### GitHub 협업 워크플로우 문서화

Purpose:
사용자가 원하는 작업 방식은 단순 백업이 아니라, 여러 바이브코딩 툴 또는 여러 개발자가 하나의 GitHub 저장소를 기준으로 웹사이트를 함께 완성하고 필요 시 특정 시점으로 복구하는 협업 방식이다. 이를 위해 브랜치, 커밋, PR, 복구, 충돌 처리 규칙을 별도 문서로 정리했다.

Changed files:
- `docs/GITHUB-COLLABORATION-WORKFLOW.md`
- `docs/AI-WORK-RULES.md`
- `docs/BACKUP-POLICY.md`
- `README.md`
- `docs/code-backups/2026-05-19/AI-WORK-RULES.before-collaboration-workflow.md`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-collaboration-workflow.md`
- `docs/code-backups/2026-05-19/IMPLEMENTATION-LOG.before-collaboration-workflow.md`
- `docs/code-backups/2026-05-19/README.before-collaboration-workflow-conflict-cleanup.md`

Main implementation:
- `docs/GITHUB-COLLABORATION-WORKFLOW.md` 신규 작성
- GitHub 저장소를 단순 백업이 아닌 협업 기준점으로 사용한다고 명시
- `main` 안정 버전 유지, 작업별 브랜치 생성, Pull Request 병합, 복구 전략, 충돌 처리 규칙 추가
- AI 어시스턴트 책임에 작업 전 파일 안내, 백업, 구현 로그, push 전 상태 확인, `.DS_Store` 제외 규칙 추가
- README에 협업/버전관리 문서와 AI 작업 규칙 문서 링크 추가
- README에 남아 있던 Git 충돌 마커를 제거하고 기존 프로젝트 설명을 보존

Verification:
- `docs/GITHUB-COLLABORATION-WORKFLOW.md` 생성 확인
- README에서 `<<<<<<<`, `=======`, `>>>>>>>` 충돌 마커 제거 확인
- `docs/AI-WORK-RULES.md`, `docs/BACKUP-POLICY.md`가 협업 워크플로우 문서를 참조하는지 확인

### HTML 파일 경로 정리 반영

Purpose:
프로젝트 구조 정리로 `survey.html`, `login.html`, `landing.html`이 `pages/` 폴더 아래로 이동된 상태에 맞춰 루트 홈 화면의 내부 링크와 README 폴더 구조 설명을 수정했다.

Changed files:
- `index.html`
- `README.md`
- `docs/BACKUP-POLICY.md`
- `docs/code-backups/2026-05-19/index.before-pages-path-fix.html`
- `docs/code-backups/2026-05-19/index.pages-path-fixed.html`
- `docs/code-backups/2026-05-19/README.before-pages-path-fix.md`
- `docs/code-backups/2026-05-19/README.pages-path-fixed.md`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-pages-path-fix.md`

Main implementation:
- 홈 화면 Account 링크를 `pages/login.html`로 수정
- 사이드 메뉴 About YUNN 링크를 `pages/landing.html`로 수정
- 로그인 상태에 따라 바뀌는 CTA JS 경로를 `pages/survey.html`, `pages/login.html`로 수정
- README 폴더 구조를 `pages/`와 `assets/image/` 기준으로 갱신

Verification:
- `http://127.0.0.1:8123/pages/survey.html?survey=1&step=2&pathCheck=1779158000000` 로드 확인
- 설문 Step 2 활성 상태와 로고 이미지 로드 확인
- `http://127.0.0.1:8123/index.html?pathFix=1779158100000`에서 홈 화면 로드 확인
- 홈 CTA, Quiz, Account, About YUNN 링크가 새 `pages/` 경로를 가리키는지 확인

### 설문 Step 3 선택 시 Step 5로 건너뛰는 문제 수정

Purpose:
사용자가 Step 3에서 답변을 선택하면 Step 4가 아니라 Step 5로 이동하는 문제를 제보했다. Step 2에 성별+나이를 합치면서 남아 있던 예전 Step 3 Age 페이지와 라벨/radio 중복 클릭 처리 때문에 내부 단계가 두 번 진행되는 것이 원인이었다.

Changed files:
- `pages/survey.html`
- `docs/BACKUP-POLICY.md`
- `docs/code-backups/2026-05-19/survey.before-step-number-flow-fix.html`
- `docs/code-backups/2026-05-19/survey.step-number-flow-fixed.html`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-step-number-flow-fix.md`

Main implementation:
- 예전 단독 Age Step 3 화면을 제거
- Skin Type부터 실제 `data-step="3"`으로 재번호 지정
- 전체 설문 단계를 `10`개로 정리
- 진행바 표시 계산을 내부 step 번호와 동일하게 단순화
- Step 2 완료 후 이동 대상을 `goToStep(3)`으로 수정
- `.option-card` 클릭 시 `preventDefault()`와 `stopPropagation()`을 적용해 label 클릭과 radio input 클릭이 중복 처리되지 않도록 수정

Verification:
- `http://127.0.0.1:8123/pages/survey.html?survey=1&step=3&singleClickFix=1779159100000`에서 Step 3이 `Page 3 of 10`으로 표시되는 것 확인
- Step 3 Oily 선택 후 `Page 4 of 10`, `What's actually bothering you?`로 이동하는 것 확인
- 선택 값 `skinType=Oily` 유지 확인

### 설문 Step 4 피부 고민 이미지 카드 개편

Purpose:
사용자 레퍼런스 이미지에 맞춰 Step 4 피부 고민 선택 페이지를 텍스트 체크박스 리스트에서 2x2 이미지 카드 선택 UI로 개편했다. 카드 디자인은 Step 3의 이미지 카드 톤과 맞추고, 사용자가 업로드한 이미지 파일을 각 답변에 매칭했다.

Changed files:
- `pages/survey.html`
- `docs/BACKUP-POLICY.md`
- `docs/code-backups/2026-05-19/survey.before-step4-concern-image-grid.html`
- `docs/code-backups/2026-05-19/survey.step4-concern-image-grid.html`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-step4-concern-image-grid.md`

Main implementation:
- Step 4 제목을 `What’s bothering / your skin / the most?` 형태로 변경하고 `your skin`에 민트 포인트 컬러 적용
- 설명 문구를 레퍼런스처럼 3줄 구조로 정리
- 피부 고민 선택지를 4개 이미지 카드로 구성
- 이미지 매칭:
  - `Acne / Breakouts` → `../assets/image/Acne : Breaksout .png`
  - `Acne Marks` → `../assets/image/Acne Marks.png`
  - `Pigmentation / Dark Spots` → `../assets/image/Pigmentation : Dark Spots.png`
  - `Uneven Skin Tone` → `../assets/image/Uneven skin tone .png`
- 선택 로직은 기존 `checkbox-card` 기반 다중 선택 로직을 재사용
- 결과 분석에서 사용하는 `concerns` value는 기존 분기와 호환되도록 `Acne`, `Acne marks`, `Pigmentation`, `Uneven skin tone` 유지

Verification:
- `http://127.0.0.1:8123/pages/survey.html?survey=1&step=4&concernGrid=1779159500000`에서 `Page 4 of 10` 로드 확인
- Step 4 이미지 카드 4개 렌더링 확인
- 네 개 이미지 모두 `complete: true`, `naturalWidth > 0`으로 정상 로드 확인
- 각 카드의 value, 제목, 이미지 경로가 의도한 답변과 매칭되는지 확인

### Step 3 Not sure 피부 타입 판별 서브 플로우 추가

Purpose:
Step 3 피부 타입 선택에서 `Not sure`를 누르면 Figma/레퍼런스 플로우처럼 `3-1 → 3-2 → 3-3 → 3-4` 피부 타입 판별 질문을 거친 뒤 다시 Step 4 피부 고민 페이지로 이어지도록 구현했다. 사용자가 지적한 체크 박스 위계 차이는 기존 1/2페이지의 오른쪽 체크 선택 스타일을 사용해 통일했다.

Changed files:
- `pages/survey.html`
- `docs/BACKUP-POLICY.md`
- `docs/code-backups/2026-05-19/survey.before-skin-helper-subflow.html`
- `docs/code-backups/2026-05-19/survey.skin-helper-subflow.html`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-skin-helper-subflow.md`

Main implementation:
- `data-step="3-1"`, `3-2`, `3-3`, `3-4` 서브 페이지 추가
- 각 페이지 질문/설명/답변을 사용자 제공 레퍼런스 이미지 기준으로 구성
- 서브 페이지 선택 카드는 기존 `.option-card`, `.check-circle` 기반 오른쪽 체크 디자인을 재사용
- 진행바는 서브 페이지에서 3번 단계 진행률을 유지하고, 표시 문구는 `Page 3-1`처럼 출력
- `Not sure` 선택 시 `3-1`로 이동
- `3-1 → 3-2 → 3-3 → 3-4 → 4` 이동 로직 추가
- 3-4 완료 시 서브 답변 평균/패턴으로 `Dry`, `Normal`, `Combination`, `Oily` 중 하나를 추론해 실제 `skinType` 값에 반영
- Step 4에서 Back을 누르면 서브 플로우를 완료한 경우 `3-4`로 돌아가도록 처리

Verification:
- `http://127.0.0.1:8123/pages/survey.html?survey=1&step=3&helperFlow=1779160500000`에서 Step 3 로드 확인
- `Not sure` 선택 후 `Page 3-1`로 이동하는 흐름 확인
- `3-1`, `3-2`, `3-3`, `3-4` 각 질문 제목과 indicator 확인
- 3-4 마지막 답변 후 `Page 4 of 10`, `What’s bothering your skin the most?`로 이동 확인
- 테스트 답변 패턴에서 `skinType=Combination`으로 추론되어 실제 선택 값에 반영되는 것 확인

### 설문 Step 5 트리거 체크박스 페이지 개편

Purpose:
사용자 레퍼런스 이미지에 맞춰 Step 5 페이지를 단일 선택 radio에서 다중 선택 체크박스 구조로 바꿨다. 체크박스는 현재 웹사이트의 기존 `checkbox-card` 디자인을 유지했다.

Changed files:
- `pages/survey.html`
- `docs/BACKUP-POLICY.md`
- `docs/code-backups/2026-05-19/survey.before-step5-trigger-checkboxes.html`
- `docs/code-backups/2026-05-19/survey.step5-trigger-checkboxes.html`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-step5-trigger-checkboxes.md`

Main implementation:
- 제목을 `When does / your skin / get worse?` 구조로 변경하고 `your skin`에 민트 포인트 적용
- 설명 문구를 `Select all that apply.`와 `Triggers help us understand your skin better.`로 변경
- 트리거 선택지를 checkbox 다중 선택으로 변경
- 선택지 6개 구성:
  - `After sun exposure`
  - `During stressful periods`
  - `Around my period`
  - `When I don’t sleep enough`
  - `After trying new skincare`
  - `It stays the same most of the time`
- 기존 `.option-card.checkbox-card`와 `.check-circle` 기반 체크박스 선택 디자인 유지

Verification:
- `http://127.0.0.1:8123/pages/survey.html?survey=1&step=5&triggerCheckbox=1779162300000`에서 `Page 5 of 10` 로드 확인
- 체크박스 카드 6개 렌더링 확인
- 모든 선택지가 `type="checkbox"`로 적용된 것 확인
- 체크박스 라운드가 기존 디자인과 같은 `6px`인지 확인
- `After sun exposure` 클릭 후 checked 값과 selected 클래스가 정상 반영되는 것 확인
