let cartCount = 0;

function applySessionUrlActions() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("logout")) return;

    localStorage.removeItem("yunnUser");
    localStorage.removeItem("yunnUserNickname");
    window.history.replaceState({}, "", window.location.pathname);
}

function getCurrentUser() {
    try {
        const savedUser = JSON.parse(localStorage.getItem("yunnUser") || "null");
        if (savedUser && savedUser.nickname) {
            return savedUser;
        }
    } catch (error) {
        localStorage.removeItem("yunnUser");
    }

    const nickname = localStorage.getItem("yunnUserNickname");
    if (nickname) {
        return { nickname };
    }

    return null;
}

function renderPersonalHero() {
    const hero = document.getElementById("personal-hero");
    const title = document.getElementById("hero-title");
    const nickname = document.getElementById("user-nickname");
    const message = document.getElementById("hero-message");
    const cta = document.getElementById("hero-cta");
    const user = getCurrentUser();

    if (user) {
        hero.classList.remove("logged-out");
        title.innerHTML = 'Hi, <span id="user-nickname"></span>';
        document.getElementById("user-nickname").textContent = user.nickname;
        message.innerHTML = "Your skin journey is <strong>on track</strong>";
        cta.href = "pages/survey.html";
        cta.innerHTML = 'My skin Profile <i class="ph ph-arrow-right"></i>';
        return;
    }

    hero.classList.add("logged-out");
    title.textContent = "Welcome to YUNN";
    nickname.textContent = "";
    message.innerHTML = "Log in to track your skin journey <strong>and routine progress</strong>";
    cta.href = "pages/login.html";
    cta.innerHTML = 'Log in to continue <i class="ph ph-arrow-right"></i>';
}

function updateDeviceTime() {
    const timeEl = document.getElementById("device-time");
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: false
    });
}

function updateNetworkStatus() {
    const slot = document.getElementById("network-slot");
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection) {
        slot.innerHTML = '<span class="wifi-mark" aria-hidden="true"><span class="wifi-dot"></span></span>';
        return;
    }

    const type = String(connection.effectiveType || connection.type || "").toUpperCase();
    if (type.includes("4G") || type.includes("5G") || type.includes("3G") || type.includes("2G") || type.includes("CELLULAR")) {
        slot.textContent = type.replace("CELLULAR", "5G");
    } else if (navigator.onLine) {
        slot.innerHTML = '<span class="wifi-mark" aria-hidden="true"><span class="wifi-dot"></span></span>';
    } else {
        slot.textContent = "Off";
    }
}

async function updateBatteryStatus() {
    const batteryLevel = document.getElementById("battery-level");
    if (!navigator.getBattery) {
        batteryLevel.style.width = "72%";
        return;
    }

    const battery = await navigator.getBattery();
    const renderBattery = () => {
        const percent = Math.max(8, Math.round(battery.level * 100));
        batteryLevel.style.width = `${percent}%`;
        batteryLevel.style.backgroundColor = percent <= 20 ? "var(--accent)" : "var(--text)";
    };

    renderBattery();
    battery.addEventListener("levelchange", renderBattery);
    battery.addEventListener("chargingchange", renderBattery);
}

function showScrim() {
    document.getElementById("modal-scrim").classList.add("active");
}

function closeAllOverlays() {
    document.getElementById("modal-scrim").classList.remove("active");
    document.getElementById("cart-sheet").classList.remove("active");
    document.getElementById("sidebar").classList.remove("active");
}

function openCartSheet() {
    showScrim();
    document.getElementById("cart-sheet").classList.add("active");
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const isActive = sidebar.classList.toggle("active");
    if (isActive) {
        showScrim();
    } else {
        closeAllOverlays();
    }
}

function addToCart(name, image) {
    cartCount += 1;
    const count = document.getElementById("cart-count");
    count.textContent = cartCount;
    count.style.display = "flex";
    document.getElementById("cart-items").textContent = `(${String(cartCount).padStart(2, "0")} items)`;
    document.getElementById("cart-product-name").textContent = name;
    document.getElementById("cart-product-image").src = image;
    openCartSheet();
}

function showCheckoutNotice() {
    alert("Checkout is coming soon. Your selected products are saved in this session.");
}

function toggleWishlist(button) {
    button.classList.toggle("active");
    const icon = button.querySelector("i");
    icon.classList.toggle("ph");
    icon.classList.toggle("ph-fill");
}

// ── 이벤트 바인딩 ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // 초기화
    applySessionUrlActions();
    renderPersonalHero();
    updateDeviceTime();
    updateNetworkStatus();
    updateBatteryStatus();
    setInterval(updateDeviceTime, 1000);

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        connection.addEventListener("change", updateNetworkStatus);
    }

    // 헤더
    document.getElementById("btn-menu").addEventListener("click", toggleSidebar);
    document.querySelector(".cart-trigger").addEventListener("click", openCartSheet);

    // 오버레이 닫기
    document.getElementById("modal-scrim").addEventListener("click", closeAllOverlays);
    document.querySelector(".sheet-close").addEventListener("click", closeAllOverlays);
    document.querySelector(".sidebar-panel .btn-close").addEventListener("click", closeAllOverlays);

    // 장바구니 시트
    document.getElementById("btn-view-cart").addEventListener("click", showCheckoutNotice);
    document.getElementById("btn-continue-shopping").addEventListener("click", closeAllOverlays);

    // 위시리스트 (heart 버튼 전체)
    document.querySelectorAll(".heart-btn").forEach(btn => {
        btn.addEventListener("click", () => toggleWishlist(btn));
    });

    // 장바구니 추가 (data 속성으로 상품 정보 전달)
    document.querySelectorAll(".add-cart").forEach(btn => {
        btn.addEventListener("click", () => addToCart(btn.dataset.name, btn.dataset.img));
    });
});
