// ResultScreen.js — 결과 화면 DOM 조작 및 이벤트. 계산·HTML 생성 없음.

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
    #currentConfig = null;
    #activePeriod = 'morning';
    #observer = null;
    #visitedSections = new Set();
    #unlockTracked = false;
    #modalManager = null;
    #surveyScreen = null;

    setDeps(modalManager, surveyScreen) {
        this.#modalManager = modalManager;
        this.#surveyScreen = surveyScreen;
    }

    init() {
        this.#bindEvents();
        this.#handleUrlParams();
    }

    show() {
        const data = getResultSurveyData();
        const config = getResultConfig(data);
        savePendingResult(data);
        this.#modalManager?.closeFeedbackGateModal();
        this.#render(data, config);
    }

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

    #renderBalance(data, config) {
        const nodes = computeSkinBalance(data, config).map(balanceRowNode);
        nodes.forEach(row => {
            row.addEventListener('click', () => {
                trackYunnEvent('metric_detail_click', { metric_name: row.dataset.metricName || '', skin_type: config.skinTypeName });
            }, { once: true });
        });
        document.getElementById('skin-balance-list').replaceChildren(...nodes);
    }

    #renderRoutine(period = this.#activePeriod) {
        if (!this.#currentConfig) return;
        this.#activePeriod = period;
        trackYunnEvent('routine_preview_view', { routine_type: period });
        document.getElementById('morning-tab').classList.toggle('active', period === 'morning');
        document.getElementById('evening-tab').classList.toggle('active', period === 'evening');
        const steps = this.#currentConfig.routines[period] || [];
        document.getElementById('result-routine-list').replaceChildren(...steps.map(routineCardNode));
    }

    #renderProducts() {
        document.getElementById('result-product-grid').replaceChildren(...RESULT_PRODUCTS.map(productCardNode));
    }

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

    #goBackToSurvey() {
        document.getElementById('result-screen').style.display = 'none';
        document.getElementById('survey-screen').style.display = '';
        document.getElementById('survey-screen').classList.add('active');
        this.#surveyScreen?.goToStep('10');
    }

    #share() {
        const text = `My YUNN Skin Insight: ${this.#currentConfig ? this.#currentConfig.skinTypeName : 'Skin Analysis'}`;
        trackYunnEvent('share_result_click', { share_channel: navigator.share ? 'native_share' : 'fallback_alert' });
        if (navigator.share) {
            navigator.share({ title: 'YUNN Skin Analysis', text }).catch(() => {});
        } else {
            alert(text);
        }
    }

    #setupAnalytics(data, config) {
        if (this.#observer) this.#observer.disconnect();
        this.#visitedSections = new Set();

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
