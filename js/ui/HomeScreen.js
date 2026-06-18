export class HomeScreen {
    #cartCount = 0;

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

    openCartSheet() {
        this.#showScrim();
        document.getElementById('cart-sheet').classList.add('active');
    }

    closeAllOverlays() {
        document.getElementById('modal-scrim').classList.remove('active');
        document.getElementById('cart-sheet').classList.remove('active');
        document.getElementById('sidebar').classList.remove('active');
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const isActive = sidebar.classList.toggle('active');
        if (isActive) {
            this.#showScrim();
        } else {
            this.closeAllOverlays();
        }
    }

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

    showCheckoutNotice() {
        alert('Checkout is coming soon. Your selected products are saved in this session.');
    }

    toggleWishlist(button) {
        button.classList.toggle('active');
        const icon = button.querySelector('i');
        icon.classList.toggle('ph');
        icon.classList.toggle('ph-fill');
    }

    // ── 비공개 메서드 ────────────────────────────────────────────────────────

    #applySessionUrlActions() {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('logout')) return;
        localStorage.removeItem('yunnUser');
        localStorage.removeItem('yunnUserNickname');
        window.history.replaceState({}, '', window.location.pathname);
    }

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

    #updateDeviceTime() {
        const timeEl = document.getElementById('device-time');
        if (!timeEl) return;
        timeEl.textContent = new Date().toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false,
        });
    }

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

    #showScrim() {
        document.getElementById('modal-scrim').classList.add('active');
    }

    #bindEvents() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            connection.addEventListener('change', () => this.#updateNetworkStatus());
        }
    }
}

const home = new HomeScreen();

window.openCartSheet      = ()          => home.openCartSheet();
window.closeAllOverlays   = ()          => home.closeAllOverlays();
window.toggleSidebar      = ()          => home.toggleSidebar();
window.addToCart          = (n, img)    => home.addToCart(n, img);
window.showCheckoutNotice = ()          => home.showCheckoutNotice();
window.toggleWishlist     = (btn)       => home.toggleWishlist(btn);

document.addEventListener('DOMContentLoaded', () => home.init());
