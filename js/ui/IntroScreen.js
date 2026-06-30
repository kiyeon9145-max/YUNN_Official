// IntroScreen.js — 인트로(랜딩) 화면, 사이드바, 모바일 상태바 UI 관리
// 화면 초기화, 이벤트 바인딩, 모바일 크롬(시간·네트워크·배터리) 표시를 담당한다.

import {
    trackYunnEvent, emitCurrentScreenTime, trackSurveyStepView,
    yunnAnalyticsState, getScrollPercent
} from '../service/AnalyticsService.js';
import { getSessionId, getItem } from '../repository/SessionRepository.js';

export class IntroScreen {
    // 로그인 상태 — 장바구니 뱃지 표시 및 사용자 버튼 이동 경로 결정에 사용된다.
    #isLoggedIn = false;
    #surveyScreen = null;  // 설문 시작 시 SurveyScreen으로 전환하기 위해 참조
    #modalManager = null;  // 카트 클릭 시 Beta 모달을 열기 위해 참조

    // 의존 객체를 외부에서 주입받는다 (setDeps 패턴).
    // 생성자에서 주입하지 않는 이유: app.js에서 모든 인스턴스를 생성한 뒤 교차 의존성을 연결하기 때문이다.
    setDeps(surveyScreen, modalManager) {
        this.#surveyScreen = surveyScreen;
        this.#modalManager = modalManager;
    }

    // 화면 초기화: 로그인 상태 확인, 모바일 크롬 설정, 이벤트 바인딩 순으로 실행한다.
    init() {
        this.#isLoggedIn = Boolean(this.#getSurveyUser());
        this.#initMobileChrome();
        this.#bindEvents();
    }

    // "Start My Skin Analysis" CTA 버튼 클릭 시 호출된다.
    // 인트로 화면을 숨기고 설문 화면을 표시하며, 관련 Analytics 이벤트를 발행한다.
    startSurvey() {
        trackYunnEvent('landing_cta_click', {
            button_name: 'Start My Skin Analysis',
            scroll_position: getScrollPercent(),
            time_before_click: Math.round((Date.now() - yunnAnalyticsState.screenStartedAt) / 1000)
        });
        emitCurrentScreenTime('survey_start'); // 인트로 화면 체류 시간 기록
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

    // 개발/테스트용 디버그 로그인 함수. 장바구니 뱃지를 강제로 표시한다.
    debugLogin() {
        this.#isLoggedIn = true;
        document.getElementById('cart-badge').style.display = 'flex';
        alert("Simulated Login: Success. Cart badge is now visible.");
    }

    // localStorage에서 로그인된 사용자 정보를 읽어온다.
    // yunnUser 키(JSON)를 우선 시도하고, 없으면 레거시 yunnUserNickname 키를 사용한다.
    #getSurveyUser() {
        try {
            const savedUser = JSON.parse(getItem('yunnUser') || 'null');
            if (savedUser && savedUser.nickname) return savedUser;
        } catch { }
        const nickname = getItem('yunnUserNickname');
        return nickname ? { nickname } : null;
    }

    // 모바일 UI 상단 상태바(시간, 네트워크, 배터리)를 실제 기기 정보로 채운다.
    // 앱처럼 보이는 모바일 웹 경험을 위해 실제 상태를 미러링한다.
    #initMobileChrome() {
        const timeEl            = document.getElementById('diagnosis-current-time');
        const networkEl         = document.getElementById('diagnosis-network-status');
        const batteryEl         = document.getElementById('diagnosis-battery-status');
        const surveyTimeEl      = document.getElementById('survey-current-time');
        const surveyNetworkEl   = document.getElementById('survey-network-slot');
        const surveyBatteryEl   = document.getElementById('survey-battery-level');

        // iOS 감지: Safari의 standalone 모드에서도 올바르게 동작하도록 maxTouchPoints로 추가 확인.
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        // iOS 모바일 전용 body 클래스를 추가해 Safe Area inset 등 iOS 특화 CSS를 적용한다.
        const updateIosClass = () => {
            document.body.classList.toggle('is-ios-mobile', isIOS && window.matchMedia('(max-width: 767px)').matches);
        };
        updateIosClass();

        // 현재 시각을 HH:MM 형식으로 두 요소(인트로, 설문)에 동시 업데이트한다.
        const updateTime = () => {
            const value = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
            if (timeEl) timeEl.textContent = value;
            if (surveyTimeEl) surveyTimeEl.textContent = value;
        };

        // 네트워크 상태를 읽어 두 요소에 반영한다.
        // 설문 화면의 네트워크 표시(surveyNetworkEl)는 모바일처럼 보이도록 4G/5G/WiFi 아이콘으로 처리한다.
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
                    // cellular 타입은 5G로 표시해 최신 기기처럼 보이게 한다.
                    surveyNetworkEl.textContent = norm.replace('CELLULAR', '5G');
                } else if (navigator.onLine) {
                    // WiFi 연결 시 아이콘으로 표시한다.
                    const icon = document.createElement('i');
                    icon.className = 'ph-fill ph-wifi-high survey-wifi-mark';
                    icon.setAttribute('aria-hidden', 'true');
                    surveyNetworkEl.replaceChildren(icon);
                } else {
                    surveyNetworkEl.textContent = 'Off';
                }
            }
        };

        // 배터리 잔량과 충전 상태를 상태바에 반영한다.
        // surveyBatteryEl은 CSS width로 배터리 바 길이를 표현한다(최소 4px, 최대 18px).
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
        setInterval(updateTime, 10000); // 10초마다 시간 갱신
        window.addEventListener('online', updateNetwork);
        window.addEventListener('offline', updateNetwork);
        window.addEventListener('resize', updateIosClass); // 화면 방향 전환 대응

        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        conn?.addEventListener('change', updateNetwork); // 네트워크 변경 실시간 감지

        // Battery API: 지원하는 브라우저에서만 배터리 정보를 가져온다.
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                updateBattery(battery);
                battery.addEventListener('levelchange',   () => updateBattery(battery));
                battery.addEventListener('chargingchange', () => updateBattery(battery));
            }).catch(() => {
                // 권한 거부 또는 API 미지원 시 배터리 표시를 제거하고 기본 크기로 표시한다.
                if (batteryEl) batteryEl.classList.remove('active');
                if (surveyBatteryEl) surveyBatteryEl.style.width = '14px';
            });
        } else if (surveyBatteryEl) {
            surveyBatteryEl.style.width = '14px'; // API 미지원 기기의 기본 배터리 바 너비
        }
    }

    // 사이드바 메뉴 열기/닫기. active 클래스 토글로 CSS 애니메이션을 트리거한다.
    #toggleSidebar() {
        document.getElementById('sidebar-menu').classList.toggle('active');
        document.getElementById('sidebar-overlay').classList.toggle('active');
    }

    // 사용자(프로필) 버튼 클릭 처리.
    // 로그인된 경우 홈으로, 미로그인이면 로그인 페이지로 이동한다.
    #handleUserClick() {
        window.location.href = this.#isLoggedIn ? '../index.html' : 'login.html';
    }

    // 장바구니 버튼 클릭 처리.
    // 미로그인이면 로그인 페이지로 이동, 로그인됐으면 Beta 모달을 연다(MVP 단계).
    #handleCartClick() {
        if (!this.#isLoggedIn) {
            window.location.href = 'login.html';
        } else {
            this.#modalManager?.openBetaModal('header_cart', 'header-cart');
        }
    }

    // 인트로 화면과 설문 화면의 헤더 버튼 이벤트를 한번에 등록한다.
    // 두 화면에서 동일한 사이드바·로고·유저·카트 버튼을 공유하므로 함께 바인딩한다.
    #bindEvents() {
        const onToggle = () => this.#toggleSidebar();

        // 사이드바 관련 이벤트
        document.getElementById('sidebar-overlay')?.addEventListener('click', onToggle);
        document.getElementById('btn-sidebar-close')?.addEventListener('click', onToggle);
        document.getElementById('intro-sidebar-toggle')?.addEventListener('click', onToggle);
        document.getElementById('survey-sidebar-toggle')?.addEventListener('click', onToggle);

        // 인트로 헤더 버튼
        document.getElementById('intro-btn-logo')?.addEventListener('click', () => { window.location.href = '../index.html'; });
        document.getElementById('intro-btn-user')?.addEventListener('click', () => this.#handleUserClick());
        document.getElementById('intro-btn-cart')?.addEventListener('click', () => this.#handleCartClick());

        // 랜딩 CTA 버튼
        document.getElementById('btn-start-survey')?.addEventListener('click', () => this.startSurvey());

        // 설문 헤더 버튼
        document.getElementById('survey-btn-logo')?.addEventListener('click', () => { window.location.href = '../index.html'; });
        document.getElementById('survey-btn-user')?.addEventListener('click', () => this.#handleUserClick());
        document.getElementById('survey-btn-cart')?.addEventListener('click', () => this.#handleCartClick());
    }
}
