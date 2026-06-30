// HomeScreen.js — index.html(홈) 화면: 개인화 히어로, 장바구니 시트, 사이드바, 상태바 UI
// 모바일 앱처럼 보이도록 기기 시간·네트워크·배터리 상태바도 흉내 낸다(목업).
// HTML의 onclick에서 부르는 메서드는 파일 하단에서 window.*로 노출한다.

export class HomeScreen {
    #cartCount = 0;  // 이 세션 장바구니 담긴 수량 (MVP: 메모리에만, 결제 없음)

    // 홈 화면 초기화: URL 액션 처리 → 히어로/상태바 렌더 → 이벤트 바인딩 → 1초마다 시계 갱신.
    init() {
        this.#applySessionUrlActions();
        this.#renderPersonalHero();
        this.#updateDeviceTime();
        this.#updateNetworkStatus();
        this.#updateBatteryStatus();
        this.#bindEvents();
        setInterval(() => this.#updateDeviceTime(), 1000);
    }

    // ── 공개 메서드 (window.* 경유로 HTML onclick에서 호출) ──────────────────

    // 장바구니 바텀시트를 연다 (배경 스크림 함께 표시).
    openCartSheet() {
        this.#showScrim();
        document.getElementById('cart-sheet').classList.add('active');
    }

    // 스크림·장바구니·사이드바 등 모든 오버레이를 닫는다.
    closeAllOverlays() {
        document.getElementById('modal-scrim').classList.remove('active');
        document.getElementById('cart-sheet').classList.remove('active');
        document.getElementById('sidebar').classList.remove('active');
    }

    // 사이드바를 토글한다. 열리면 스크림 표시, 닫히면 모든 오버레이 정리.
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const isActive = sidebar.classList.toggle('active');
        if (isActive) {
            this.#showScrim();
        } else {
            this.closeAllOverlays();
        }
    }

    // 상품을 장바구니에 담는다: 수량 배지 갱신 + 마지막 담은 상품 미리보기 + 시트 열기.
    addToCart(name, image) {
        this.#cartCount += 1;
        const count = document.getElementById('cart-count');
        count.textContent = this.#cartCount;
        count.style.display = 'flex';
        document.getElementById('cart-items').textContent =
            `(${String(this.#cartCount).padStart(2, '0')} items)`;
        document.getElementById('cart-product-name').textContent = name;
        document.getElementById('cart-product-image').src = image;
        this.openCartSheet();
    }

    // 결제 미구현(MVP) — 준비 중 안내만 표시.
    showCheckoutNotice() {
        alert('Checkout is coming soon. Your selected products are saved in this session.');
    }

    // 위시리스트 하트 버튼 토글 (빈 하트 ↔ 채운 하트 아이콘 전환).
    toggleWishlist(button) {
        button.classList.toggle('active');
        const icon = button.querySelector('i');
        icon.classList.toggle('ph');
        icon.classList.toggle('ph-fill');
    }

    // ── 비공개 메서드 ────────────────────────────────────────────────────────

    // URL에 ?logout이 있으면 로그인 정보를 지우고 파라미터를 제거한다 (로그아웃 처리).
    #applySessionUrlActions() {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('logout')) return;
        localStorage.removeItem('yunnUser');
        localStorage.removeItem('yunnUserNickname');
        window.history.replaceState({}, '', window.location.pathname);
    }

    // 로그인 사용자 정보를 반환한다. yunnUser(JSON) 우선, 실패 시 yunnUserNickname 폴백, 없으면 null.
    #getCurrentUser() {
        try {
            const saved = JSON.parse(localStorage.getItem('yunnUser') || 'null');
            if (saved?.nickname) return saved;
        } catch {
            localStorage.removeItem('yunnUser');
        }
        const nickname = localStorage.getItem('yunnUserNickname');
        return nickname ? { nickname } : null;
    }

    // 로그인 여부에 따라 히어로 영역을 개인화한다.
    // 로그인: "Hi, 닉네임" + 내 프로필 CTA / 비로그인: 환영 문구 + 로그인 CTA.
    #renderPersonalHero() {
        const hero     = document.getElementById('personal-hero');
        const title    = document.getElementById('hero-title');
        const message  = document.getElementById('hero-message');
        const cta      = document.getElementById('hero-cta');
        const user     = this.#getCurrentUser();

        if (user) {
            hero.classList.remove('logged-out');
            title.innerHTML = 'Hi, <span id="user-nickname"></span>';
            document.getElementById('user-nickname').textContent = user.nickname;
            message.innerHTML = 'Your skin journey is <strong>on track</strong>';
            cta.href = 'pages/survey.html';
            cta.innerHTML = 'My skin Profile <i class="ph ph-arrow-right"></i>';
            return;
        }

        hero.classList.add('logged-out');
        title.textContent = 'Welcome to YUNN';
        document.getElementById('user-nickname').textContent = '';
        message.innerHTML = 'Log in to track your skin journey <strong>and routine progress</strong>';
        cta.href = 'pages/login.html';
        cta.innerHTML = 'Log in to continue <i class="ph ph-arrow-right"></i>';
    }

    // 상태바의 시계를 현재 시각(24시간제 HH:MM)으로 갱신한다.
    #updateDeviceTime() {
        const timeEl = document.getElementById('device-time');
        if (!timeEl) return;
        timeEl.textContent = new Date().toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false,
        });
    }

    // 상태바 네트워크 표시를 갱신한다: 셀룰러면 "4G/5G" 텍스트, Wi-Fi면 아이콘, 오프라인이면 "Off".
    #updateNetworkStatus() {
        const slot = document.getElementById('network-slot');
        if (!slot) return;
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (!connection) {
            slot.innerHTML = '<span class="wifi-mark" aria-hidden="true"><span class="wifi-dot"></span></span>';
            return;
        }
        const type = String(connection.effectiveType || connection.type || '').toUpperCase();
        if (type.includes('4G') || type.includes('5G') || type.includes('3G') ||
            type.includes('2G') || type.includes('CELLULAR')) {
            slot.textContent = type.replace('CELLULAR', '5G');
        } else if (navigator.onLine) {
            slot.innerHTML = '<span class="wifi-mark" aria-hidden="true"><span class="wifi-dot"></span></span>';
        } else {
            slot.textContent = 'Off';
        }
    }

    // 상태바 배터리 게이지를 실제 배터리 잔량에 맞춰 갱신한다.
    // Battery API 미지원 시 72%로 고정. 20% 이하면 강조색으로 표시하고 충전/잔량 변화에 반응한다.
    async #updateBatteryStatus() {
        const batteryLevel = document.getElementById('battery-level');
        if (!batteryLevel) return;
        if (!navigator.getBattery) {
            batteryLevel.style.width = '72%';
            return;
        }
        const battery = await navigator.getBattery();
        const render = () => {
            const percent = Math.max(8, Math.round(battery.level * 100));
            batteryLevel.style.width = `${percent}%`;
            batteryLevel.style.backgroundColor = percent <= 20 ? 'var(--accent)' : 'var(--text)';
        };
        render();
        battery.addEventListener('levelchange', render);
        battery.addEventListener('chargingchange', render);
    }

    // 오버레이 뒤 배경 스크림(어두운 막)을 표시한다.
    #showScrim() {
        document.getElementById('modal-scrim').classList.add('active');
    }

    // 네트워크 연결 변화 시 상태바를 다시 갱신하도록 리스너를 등록한다.
    #bindEvents() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            connection.addEventListener('change', () => this.#updateNetworkStatus());
        }
    }
}

// 단일 인스턴스 생성 후 HTML onclick이 호출하는 메서드들을 전역에 노출한다.
const home = new HomeScreen();

window.openCartSheet      = ()          => home.openCartSheet();
window.closeAllOverlays   = ()          => home.closeAllOverlays();
window.toggleSidebar      = ()          => home.toggleSidebar();
window.addToCart          = (n, img)    => home.addToCart(n, img);
window.showCheckoutNotice = ()          => home.showCheckoutNotice();
window.toggleWishlist     = (btn)       => home.toggleWishlist(btn);

// DOM 준비 후 홈 화면 초기화
document.addEventListener('DOMContentLoaded', () => home.init());
