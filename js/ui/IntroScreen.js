// IntroScreen.js — 인트로 화면, 사이드바, 모바일 크롬 상태바

import { trackYunnEvent, emitCurrentScreenTime, trackSurveyStepView, yunnAnalyticsState, getScrollPercent } from '../service/AnalyticsService.js';
import { getSessionId } from '../repository/SessionRepository.js';
import { getItem } from '../repository/SessionRepository.js';

function getSurveyUser() {
    try {
        const savedUser = JSON.parse(getItem('yunnUser') || 'null');
        if (savedUser && savedUser.nickname) return savedUser;
    } catch {
        // corrupt data — remove via SessionRepository if needed
    }

    const nickname = getItem('yunnUserNickname');
    return nickname ? { nickname } : null;
}

let isLoggedIn = Boolean(getSurveyUser());

function initMobileChrome() {
    const timeEl = document.getElementById('diagnosis-current-time');
    const networkEl = document.getElementById('diagnosis-network-status');
    const batteryEl = document.getElementById('diagnosis-battery-status');
    const surveyTimeEl = document.getElementById('survey-current-time');
    const surveyNetworkEl = document.getElementById('survey-network-slot');
    const surveyBatteryLevelEl = document.getElementById('survey-battery-level');

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isMobileWidth = window.matchMedia('(max-width: 767px)').matches;
    document.body.classList.toggle('is-ios-mobile', isIOS && isMobileWidth);

    const updateTime = () => {
        const now = new Date();
        const value = now.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
        });
        if (timeEl) timeEl.textContent = value;
        if (surveyTimeEl) surveyTimeEl.textContent = value;
    };

    const updateNetwork = () => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const onlineText = navigator.onLine ? 'Online' : 'Offline';
        const connectionType = connection && (connection.effectiveType || connection.type);
        const value = navigator.onLine && connectionType ? connectionType.toUpperCase() : onlineText;
        if (networkEl) {
            networkEl.textContent = value;
            networkEl.classList.add('active');
            networkEl.classList.toggle('is-muted', !connectionType);
        }
        if (surveyNetworkEl) {
            const normalized = String(value).toUpperCase();
            if (normalized.includes('4G') || normalized.includes('5G') || normalized.includes('3G') || normalized.includes('2G') || normalized.includes('CELLULAR')) {
                surveyNetworkEl.textContent = normalized.replace('CELLULAR', '5G');
            } else if (navigator.onLine) {
                const wifiIcon = document.createElement('i');
                wifiIcon.className = 'ph-fill ph-wifi-high survey-wifi-mark';
                wifiIcon.setAttribute('aria-hidden', 'true');
                surveyNetworkEl.replaceChildren(wifiIcon);
            } else {
                surveyNetworkEl.textContent = 'Off';
            }
        }
    };

    const updateBatteryText = (battery) => {
        const percent = Math.round(battery.level * 100);
        if (batteryEl) {
            batteryEl.textContent = `${percent}%`;
            batteryEl.classList.add('active');
            batteryEl.classList.toggle('is-muted', !battery.charging);
        }
        if (surveyBatteryLevelEl) {
            surveyBatteryLevelEl.style.width = `${Math.max(4, Math.round(18 * battery.level))}px`;
        }
    };

    updateTime();
    updateNetwork();
    setInterval(updateTime, 10000);
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);
    window.addEventListener('resize', () => {
        document.body.classList.toggle('is-ios-mobile', isIOS && window.matchMedia('(max-width: 767px)').matches);
    });

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection && connection.addEventListener) {
        connection.addEventListener('change', updateNetwork);
    }

    if ('getBattery' in navigator) {
        navigator.getBattery().then((battery) => {
            updateBatteryText(battery);
            battery.addEventListener('levelchange', () => updateBatteryText(battery));
            battery.addEventListener('chargingchange', () => updateBatteryText(battery));
        }).catch(() => {
            if (batteryEl) batteryEl.classList.remove('active');
            if (surveyBatteryLevelEl) surveyBatteryLevelEl.style.width = '14px';
        });
    } else if (surveyBatteryLevelEl) {
        surveyBatteryLevelEl.style.width = '14px';
    }
}

function toggleSidebar() {
    document.getElementById('sidebar-menu').classList.toggle('active');
    document.getElementById('sidebar-overlay').classList.toggle('active');
}

function goHome() {
    window.location.href = '../index.html';
}

function handleUserClick() {
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    } else {
        window.location.href = '../index.html';
    }
}

function handleCartClick() {
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    } else {
        if (typeof window.openBetaServiceModal === 'function') {
            window.openBetaServiceModal('header_cart', 'header-cart');
        }
    }
}

// Demo function to simulate login
function debugLogin() {
    isLoggedIn = true;
    document.getElementById('cart-badge').style.display = 'flex';
    alert("Simulated Login: Success. Cart badge is now visible.");
}

function startSurvey() {
    trackYunnEvent('landing_cta_click', {
        button_name: 'Start My Skin Analysis',
        scroll_position: getScrollPercent(),
        time_before_click: Math.round((Date.now() - yunnAnalyticsState.screenStartedAt) / 1000)
    });
    emitCurrentScreenTime('survey_start');
    trackYunnEvent('survey_start', {
        start_source: 'landing_cta',
        current_step: window.currentStep || '1',
        user_id: getSessionId()
    });
    document.getElementById('intro-screen').classList.remove('active');
    document.getElementById('survey-screen').classList.add('active');
    if (typeof window.updateProgress === 'function') window.updateProgress();
    trackSurveyStepView(window.currentStep || '1');
    window.scrollTo(0, 0);
}

function bindIntroEvents() {
    // 사이드바
    document.getElementById('sidebar-overlay')?.addEventListener('click', toggleSidebar);
    document.getElementById('btn-sidebar-close')?.addEventListener('click', toggleSidebar);

    // 인트로 헤더
    document.getElementById('intro-sidebar-toggle')?.addEventListener('click', toggleSidebar);
    document.getElementById('intro-btn-logo')?.addEventListener('click', goHome);
    document.getElementById('intro-btn-user')?.addEventListener('click', handleUserClick);
    document.getElementById('intro-btn-cart')?.addEventListener('click', handleCartClick);

    // 인트로 CTA
    document.getElementById('btn-start-survey')?.addEventListener('click', startSurvey);

    // 서베이 헤더
    document.getElementById('survey-sidebar-toggle')?.addEventListener('click', toggleSidebar);
    document.getElementById('survey-btn-logo')?.addEventListener('click', goHome);
    document.getElementById('survey-btn-user')?.addEventListener('click', handleUserClick);
    document.getElementById('survey-btn-cart')?.addEventListener('click', handleCartClick);
}

// window 노출 (하위 호환)
window.toggleSidebar   = toggleSidebar;
window.goHome          = goHome;
window.handleUserClick = handleUserClick;
window.handleCartClick = handleCartClick;
window.debugLogin      = debugLogin;
window.startSurvey     = startSurvey;

initMobileChrome();
document.addEventListener('DOMContentLoaded', bindIntroEvents);
