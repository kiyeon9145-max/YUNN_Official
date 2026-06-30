// ResultScreen.js — 피부 진단 결과 화면의 DOM 렌더링 및 이벤트 처리
// 계산은 ResultService, 카드 마크업은 templates/*에 위임하고 여기서는 화면 조작만 한다.
// 핵심: 결과 표시 → 잠금(피드백 게이트) → 섹션별 노출 추적(IntersectionObserver) → 재진단/공유.

import { RESULT_ASSETS, RESULT_PRODUCTS } from '../domain/RoutineConfig.js';
import {
    getResultSurveyData,
    getResultConfig,
    computeSkinBalance,
    formatResultSummary
} from '../service/ResultService.js';
import {
    trackYunnEvent,
    markAnalyticsScreen,
    emitCurrentScreenTime,
    yunnAnalyticsState
} from '../service/AnalyticsService.js';
import { getSessionId } from '../repository/SessionRepository.js';
import { savePendingResult } from '../repository/SurveyRepository.js';
import { isFeedbackVerifiedLocally, verifyFeedbackAndUnlock } from '../service/FeedbackService.js';
import { balanceRowNode } from './templates/BalanceRowTemplate.js';
import { routineCardNode } from './templates/RoutineCardTemplate.js';
import { productCardNode } from './templates/ProductCardTemplate.js';

export class ResultScreen {
    #currentConfig = null;        // 현재 결과 설정(피부타입명·루틴·키워드 등)
    #activePeriod = 'morning';    // 루틴 미리보기 활성 탭
    #observer = null;             // 섹션 노출 추적용 IntersectionObserver
    #visitedSections = new Set(); // 이미 노출 추적한 섹션 (중복 방지)
    #unlockTracked = false;       // unlock_conversion 1회만 발행하기 위한 플래그
    #modalManager = null;         // 피드백 게이트 모달 제어
    #surveyScreen = null;         // 설문으로 돌아가기

    // app.js에서 호출 — 협력 객체 연결.
    setDeps(modalManager, surveyScreen) {
        this.#modalManager = modalManager;
        this.#surveyScreen = surveyScreen;
    }

    // 이벤트 바인딩 + URL 파라미터 처리(설문 복귀/데모 표시).
    init() {
        this.#bindEvents();
        this.#handleUrlParams();
    }

    // 결과 화면을 표시한다: 설문 데이터·설정 로드 → 저장 → 게이트 모달 닫고 → 렌더링.
    show() {
        const data = getResultSurveyData();
        const config = getResultConfig(data);
        savePendingResult(data);
        this.#modalManager?.closeFeedbackGateModal();
        this.#render(data, config);
    }

    // Full Routine 잠금/해제 상태를 토글한다. 최초 해제 시 unlock_conversion 이벤트 1회 발행.
    // FeedbackService가 window.setRoutineUnlockState로 이 메서드를 호출한다.
    setUnlockState(isUnlocked) {
        const el = document.getElementById('locked-result-content');
        if (!el) return;
        el.classList.toggle('locked', !isUnlocked);
        el.setAttribute('data-unlocked', isUnlocked ? 'true' : 'false');
        if (isUnlocked && !this.#unlockTracked) {
            this.#unlockTracked = true;
            trackYunnEvent('unlock_conversion', { plan_type: 'full_routine' });
        }
    }

    // 결과 화면 전체를 그린다: 다른 화면 숨김 → 헤더·밸런스·루틴·상품 렌더 → 잠금 상태 적용 → 추적 설정.
    #render(data, config) {
        this.#currentConfig = config;
        emitCurrentScreenTime('result_render');
        markAnalyticsScreen('result');
        trackYunnEvent('result_page_view', {
            user_id: getSessionId(), skin_type: config.skinTypeName,
            skin_concern: data.concernType, result_keywords: config.keywords
        });
        trackYunnEvent('result_view', {
            user_id: getSessionId(), skin_type: config.skinTypeName,
            skin_concern: data.concernType, result_keywords: config.keywords
        });

        document.getElementById('intro-screen').classList.remove('active');
        document.getElementById('survey-screen').classList.remove('active');
        document.getElementById('survey-screen').style.display = 'none';
        document.getElementById('analysis-screen').style.display = 'none';
        document.getElementById('result-screen').style.display = 'block';

        this.#setChromeStatus();
        this.#renderHeader(data, config);
        this.#renderBalance(data, config);
        this.#renderRoutine('morning');
        this.#renderProducts();
        this.setUnlockState(isFeedbackVerifiedLocally());
        this.#setupAnalytics(data, config);
        window.scrollTo(0, 0);
    }

    // 결과 화면 상단의 시간·네트워크 상태바(목업)를 현재 값으로 채운다.
    #setChromeStatus() {
        const timeEl = document.getElementById('result-current-time');
        const networkEl = document.getElementById('result-network-status');
        if (timeEl) {
            timeEl.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
        }
        if (networkEl) {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const value = conn?.effectiveType ? conn.effectiveType.toUpperCase() : '4G';
            networkEl.textContent = value.includes('WIFI') ? '' : value.replace('CELLULAR', '5G');
        }
    }

    // 헤더 렌더: 이름·피부타입명·얼굴 사진(업로드본 우선, 없으면 성별별 기본 이미지)·키워드·요약.
    #renderHeader(data, config) {
        document.getElementById('result-user-name').textContent = data.name;
        document.querySelector('#result-type-name .result-type-main').textContent = config.skinTypeName;
        const fallback = data.gender === 'Male' ? RESULT_ASSETS.userFallbackMale : RESULT_ASSETS.userFallbackFemale;
        document.getElementById('result-face-image').src = window.uploadedSkinPhotoData || fallback;
        const keywordNodes = config.keywords.map(kw => {
            const span = document.createElement('span');
            span.className = 'result-keyword';
            span.textContent = kw;
            return span;
        });
        document.getElementById('result-keywords').replaceChildren(...keywordNodes);
        document.getElementById('result-summary').innerHTML = formatResultSummary(config);
    }

    // 피부 밸런스 지표 행들을 렌더하고, 각 행 첫 클릭 시 metric_detail_click 이벤트를 발행한다.
    #renderBalance(data, config) {
        const nodes = computeSkinBalance(data, config).map(balanceRowNode);
        nodes.forEach(row => {
            row.addEventListener('click', () => {
                trackYunnEvent('metric_detail_click', { metric_name: row.dataset.metricName || '', skin_type: config.skinTypeName });
            }, { once: true });
        });
        document.getElementById('skin-balance-list').replaceChildren(...nodes);
    }

    // 지정한 기간(아침/저녁)의 루틴 미리보기 카드들을 렌더하고 탭 활성 상태를 갱신한다.
    #renderRoutine(period = this.#activePeriod) {
        if (!this.#currentConfig) return;
        this.#activePeriod = period;
        trackYunnEvent('routine_preview_view', { routine_type: period });
        document.getElementById('morning-tab').classList.toggle('active', period === 'morning');
        document.getElementById('evening-tab').classList.toggle('active', period === 'evening');
        const steps = this.#currentConfig.routines[period] || [];
        document.getElementById('result-routine-list').replaceChildren(...steps.map(routineCardNode));
    }

    // 추천 상품 그리드를 렌더한다.
    #renderProducts() {
        document.getElementById('result-product-grid').replaceChildren(...RESULT_PRODUCTS.map(productCardNode));
    }

    // 재진단: 모달을 모두 닫고 결과 화면을 숨긴 뒤 인트로 화면으로 되돌린다.
    #retake() {
        trackYunnEvent('retake_quiz_click', { source: yunnAnalyticsState.currentScreen || 'unknown' });
        ['feedback-gate-modal', 'beta-service-modal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.classList.remove('active', 'closing'); el.setAttribute('aria-hidden', 'true'); }
        });
        document.getElementById('result-screen').style.display = 'none';
        document.getElementById('analysis-screen').style.display = 'none';
        document.getElementById('survey-screen').classList.remove('active');
        document.getElementById('survey-screen').style.display = '';
        document.getElementById('intro-screen').classList.add('active');
        markAnalyticsScreen('intro');
        window.scrollTo(0, 0);
    }

    // 결과 화면에서 설문 마지막 스텝(10)으로 되돌아간다.
    #goBackToSurvey() {
        document.getElementById('result-screen').style.display = 'none';
        document.getElementById('survey-screen').style.display = '';
        document.getElementById('survey-screen').classList.add('active');
        this.#surveyScreen?.goToStep('10');
    }

    // 결과를 공유한다. Web Share API 지원 시 네이티브 공유, 아니면 alert 폴백.
    #share() {
        const text = `My YUNN Skin Insight: ${this.#currentConfig ? this.#currentConfig.skinTypeName : 'Skin Analysis'}`;
        trackYunnEvent('share_result_click', { share_channel: navigator.share ? 'native_share' : 'fallback_alert' });
        if (navigator.share) {
            navigator.share({ title: 'YUNN Skin Analysis', text }).catch(() => {});
        } else {
            alert(text);
        }
    }

    // 결과 화면의 주요 섹션이 화면에 35% 이상 들어오면 1회씩 노출 이벤트를 발행한다.
    // 어디까지 봤는지(lastVisibleResultSection)도 기록해 이탈 분석에 활용한다.
    #setupAnalytics(data, config) {
        if (this.#observer) this.#observer.disconnect();
        this.#visitedSections = new Set();

        // 추적할 섹션: 셀렉터 → 섹션명/이벤트명 매핑
        const sections = [
            { selector: '.result-insight',      name: 'skin_type',    event: 'skin_type_section_view' },
            { selector: '.balance-card',        name: 'skin_balance', event: 'skin_balance_section_view' },
            { selector: '.routine-tabs',        name: 'routine_tabs', event: 'routine_preview_view' },
            { selector: '.products-section',    name: 'products',     event: 'product_recommendation_section_view' },
            { selector: '.unlock-preview-card', name: 'unlock_cta',   event: 'unlock_cta_view' }
        ];

        this.#observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const sectionName = entry.target.getAttribute('data-analytics-section');
                const eventName   = entry.target.getAttribute('data-analytics-event');
                if (!sectionName || !eventName || this.#visitedSections.has(sectionName)) return;

                this.#visitedSections.add(sectionName);
                yunnAnalyticsState.lastVisibleResultSection = sectionName;
                const payload = { section_name: sectionName, skin_type: config.skinTypeName };

                if (sectionName === 'skin_balance') {
                    Object.assign(payload, {
                        balance_scores: computeSkinBalance(data, config).reduce((acc, m) => {
                            acc[m.key] = m.value; return acc;
                        }, {})
                    });
                }
                if (sectionName === 'routine_tabs') payload.routine_type = this.#activePeriod;
                if (sectionName === 'unlock_cta') {
                    payload.cta_id = 'unlock_full_routine';
                    payload.cta_position = 'routine_unlock_preview';
                }
                trackYunnEvent(eventName, payload);
            });
        }, { threshold: 0.35 });

        sections.forEach(({ selector, name, event }) => {
            const el = document.querySelector(selector);
            if (!el) return;
            el.setAttribute('data-analytics-section', name);
            el.setAttribute('data-analytics-event', event);
            this.#observer.observe(el);
        });
    }

    // 결과 화면 버튼들(뒤로/공유/아침·저녁 탭/재진단)을 바인딩한다.
    #bindEvents() {
        document.getElementById('btn-back-from-result')
            ?.addEventListener('click', () => this.#goBackToSurvey());
        document.getElementById('btn-share-result')
            ?.addEventListener('click', () => this.#share());
        document.getElementById('morning-tab')
            ?.addEventListener('click', () => {
                trackYunnEvent('routine_preview_expand', { section_name: 'morning_routine' });
                this.#renderRoutine('morning');
            });
        document.getElementById('evening-tab')
            ?.addEventListener('click', () => {
                trackYunnEvent('routine_preview_expand', { section_name: 'evening_routine' });
                this.#renderRoutine('evening');
            });
        document.getElementById('btn-retake-quiz')
            ?.addEventListener('click', () => this.#retake());
        document.getElementById('btn-retake-quiz-nav')
            ?.addEventListener('click', () => this.#retake());
    }

    // URL 파라미터 처리:
    //   returnFromSurvey — 피드백 Form에서 복귀 → 결과 표시 후 잠금 해제 검증
    //   resultDemo       — 결과 화면 데모용 즉시 표시
    #handleUrlParams() {
        const p = new URLSearchParams(window.location.search);
        if (p.has('returnFromSurvey')) {
            this.show();
            verifyFeedbackAndUnlock();
        } else if (p.has('resultDemo')) {
            this.show();
        }
    }
}
