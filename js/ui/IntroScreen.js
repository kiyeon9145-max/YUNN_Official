// IntroScreen.js — 인트로 화면, 사이드바, 모바일 크롬 상태바

import {
    trackYunnEvent, emitCurrentScreenTime, trackSurveyStepView,
    yunnAnalyticsState, getScrollPercent
} from '../service/AnalyticsService.js';
import { getSessionId, getItem } from '../repository/SessionRepository.js';

export class IntroScreen {
    #isLoggedIn = false;
    #surveyScreen = null;
    #modalManager = null;

    setDeps(surveyScreen, modalManager) {
        this.#surveyScreen = surveyScreen;
        this.#modalManager = modalManager;
    }

    init() {
        this.#isLoggedIn = Boolean(this.#getSurveyUser());
        this.#initMobileChrome();
        this.#bindEvents();
    }

    startSurvey() {
        trackYunnEvent('landing_cta_click', {
            button_name: 'Start My Skin Analysis',
            scroll_position: getScrollPercent(),
            time_before_click: Math.round((Date.now() - yunnAnalyticsState.screenStartedAt) / 1000)
        });
        emitCurrentScreenTime('survey_start');
        trackYunnEvent('survey_start', {
            start_source: 'landing_cta',
            current_step: '1',
            user_id: getSessionId()
        });
        document.getElementById('intro-screen').classList.remove('active');
        document.getElementById('survey-screen').classList.add('active');
        this.#surveyScreen?.updateProgress();
        trackSurveyStepView('1');
        window.scrollTo(0, 0);
    }

    debugLogin() {
        this.#isLoggedIn = true;
        document.getElementById('cart-badge').style.display = 'flex';
        alert("Simulated Login: Success. Cart badge is now visible.");
    }

    #getSurveyUser() {
        try {
            const savedUser = JSON.parse(getItem('yunnUser') || 'null');
            if (savedUser && savedUser.nickname) return savedUser;
        } catch { }
        const nickname = getItem('yunnUserNickname');
        return nickname ? { nickname } : null;
    }

    #initMobileChrome() {
        const timeEl            = document.getElementById('diagnosis-current-time');
        const networkEl         = document.getElementById('diagnosis-network-status');
        const batteryEl         = document.getElementById('diagnosis-battery-status');
        const surveyTimeEl      = document.getElementById('survey-current-time');
        const surveyNetworkEl   = document.getElementById('survey-network-slot');
        const surveyBatteryEl   = document.getElementById('survey-battery-level');

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        const updateIosClass = () => {
            document.body.classList.toggle('is-ios-mobile', isIOS && window.matchMedia('(max-width: 767px)').matches);
        };
        updateIosClass();

        const updateTime = () => {
            const value = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
            if (timeEl) timeEl.textContent = value;
            if (surveyTimeEl) surveyTimeEl.textContent = value;
        };

        const updateNetwork = () => {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const connectionType = conn && (conn.effectiveType || conn.type);
            const value = navigator.onLine && connectionType ? connectionType.toUpperCase() : (navigator.onLine ? 'Online' : 'Offline');
            if (networkEl) {
                networkEl.textContent = value;
                networkEl.classList.add('active');
                networkEl.classList.toggle('is-muted', !connectionType);
            }
            if (surveyNetworkEl) {
                const norm = String(value).toUpperCase();
                if (['4G', '5G', '3G', '2G', 'CELLULAR'].some(t => norm.includes(t))) {
                    surveyNetworkEl.textContent = norm.replace('CELLULAR', '5G');
                } else if (navigator.onLine) {
                    const icon = document.createElement('i');
                    icon.className = 'ph-fill ph-wifi-high survey-wifi-mark';
                    icon.setAttribute('aria-hidden', 'true');
                    surveyNetworkEl.replaceChildren(icon);
                } else {
                    surveyNetworkEl.textContent = 'Off';
                }
            }
        };

        const updateBattery = (battery) => {
            const percent = Math.round(battery.level * 100);
            if (batteryEl) {
                batteryEl.textContent = `${percent}%`;
                batteryEl.classList.add('active');
                batteryEl.classList.toggle('is-muted', !battery.charging);
            }
            if (surveyBatteryEl) {
                surveyBatteryEl.style.width = `${Math.max(4, Math.round(18 * battery.level))}px`;
            }
        };

        updateTime();
        updateNetwork();
        setInterval(updateTime, 10000);
        window.addEventListener('online', updateNetwork);
        window.addEventListener('offline', updateNetwork);
        window.addEventListener('resize', updateIosClass);

        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        conn?.addEventListener('change', updateNetwork);

        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                updateBattery(battery);
                battery.addEventListener('levelchange', () => updateBattery(battery));
                battery.addEventListener('chargingchange', () => updateBattery(battery));
            }).catch(() => {
                if (batteryEl) batteryEl.classList.remove('active');
                if (surveyBatteryEl) surveyBatteryEl.style.width = '14px';
            });
        } else if (surveyBatteryEl) {
            surveyBatteryEl.style.width = '14px';
        }
    }

    #toggleSidebar() {
        document.getElementById('sidebar-menu').classList.toggle('active');
        document.getElementById('sidebar-overlay').classList.toggle('active');
    }

    #handleUserClick() {
        window.location.href = this.#isLoggedIn ? '../index.html' : 'login.html';
    }

    #handleCartClick() {
        if (!this.#isLoggedIn) {
            window.location.href = 'login.html';
        } else {
            this.#modalManager?.openBetaModal('header_cart', 'header-cart');
        }
    }

    #bindEvents() {
        const onToggle = () => this.#toggleSidebar();

        document.getElementById('sidebar-overlay')?.addEventListener('click', onToggle);
        document.getElementById('btn-sidebar-close')?.addEventListener('click', onToggle);

        document.getElementById('intro-sidebar-toggle')?.addEventListener('click', onToggle);
        document.getElementById('intro-btn-logo')?.addEventListener('click', () => { window.location.href = '../index.html'; });
        document.getElementById('intro-btn-user')?.addEventListener('click', () => this.#handleUserClick());
        document.getElementById('intro-btn-cart')?.addEventListener('click', () => this.#handleCartClick());
        document.getElementById('btn-start-survey')?.addEventListener('click', () => this.startSurvey());

        document.getElementById('survey-sidebar-toggle')?.addEventListener('click', onToggle);
        document.getElementById('survey-btn-logo')?.addEventListener('click', () => { window.location.href = '../index.html'; });
        document.getElementById('survey-btn-user')?.addEventListener('click', () => this.#handleUserClick());
        document.getElementById('survey-btn-cart')?.addEventListener('click', () => this.#handleCartClick());
    }
}
