// ResultScreen.js — 결과 화면 DOM 조작 및 이벤트. 계산·HTML 생성 없음.

import { RESULT_ASSETS, RESULT_PRODUCTS } from '../domain/RoutineConfig.js';
import {
    escapeHTML,
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
import { isFeedbackVerifiedLocally } from '../service/FeedbackService.js';
import { balanceRowNode } from './templates/BalanceRowTemplate.js';
import { routineCardNode } from './templates/RoutineCardTemplate.js';
import { productCardNode } from './templates/ProductCardTemplate.js';

let currentResultConfig = null;
let activeRoutinePeriod = 'morning';
let resultAnalyticsObserver = null;
let resultAnalyticsSections = new Set();
let unlockConversionTracked = false;

function setResultChromeStatus() {
    const timeEl = document.getElementById('result-current-time');
    const networkEl = document.getElementById('result-network-status');
    if (timeEl) {
        timeEl.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
    }
    if (networkEl) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const value = connection && connection.effectiveType ? connection.effectiveType.toUpperCase() : '4G';
        networkEl.textContent = value.includes('WIFI') ? '' : value.replace('CELLULAR', '5G');
    }
}

function renderResultHeader(data, config) {
    document.getElementById('result-user-name').textContent = data.name;
    document.querySelector('#result-type-name .result-type-main').textContent = config.skinTypeName;
    const faceImage = document.getElementById('result-face-image');
    const fallback = data.gender === 'Male' ? RESULT_ASSETS.userFallbackMale : RESULT_ASSETS.userFallbackFemale;
    faceImage.src = window.uploadedSkinPhotoData || fallback;
    const keywordNodes = config.keywords.map(kw => {
        const span = document.createElement('span');
        span.className = 'result-keyword';
        span.textContent = kw;
        return span;
    });
    document.getElementById('result-keywords').replaceChildren(...keywordNodes);
    document.getElementById('result-summary').innerHTML = formatResultSummary(config);
}

function renderBalance(data, config) {
    const balances = computeSkinBalance(data, config);
    const nodes = balances.map(balanceRowNode);
    nodes.forEach(row => {
        row.addEventListener('click', () => {
            trackYunnEvent('metric_detail_click', {
                metric_name: row.dataset.metricName || '',
                skin_type: config.skinTypeName
            });
        }, { once: true });
    });
    document.getElementById('skin-balance-list').replaceChildren(...nodes);
}

function setupResultAnalytics(data, config) {
    if (resultAnalyticsObserver) resultAnalyticsObserver.disconnect();
    resultAnalyticsSections = new Set();

    const sectionMap = [
        { selector: '.result-insight',      name: 'skin_type',    event: 'skin_type_section_view' },
        { selector: '.balance-card',        name: 'skin_balance', event: 'skin_balance_section_view' },
        { selector: '.routine-tabs',        name: 'routine_tabs', event: 'routine_preview_view' },
        { selector: '.products-section',    name: 'products',     event: 'product_recommendation_section_view' },
        { selector: '.unlock-preview-card', name: 'unlock_cta',   event: 'unlock_cta_view' }
    ];

    resultAnalyticsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const sectionName = entry.target.getAttribute('data-analytics-section');
            const eventName   = entry.target.getAttribute('data-analytics-event');
            if (!sectionName || !eventName || resultAnalyticsSections.has(sectionName)) return;

            resultAnalyticsSections.add(sectionName);
            yunnAnalyticsState.lastVisibleResultSection = sectionName;
            const payload = { section_name: sectionName, skin_type: config.skinTypeName };

            if (sectionName === 'skin_balance') {
                Object.assign(payload, {
                    balance_scores: computeSkinBalance(data, config).reduce((acc, m) => {
                        acc[m.key] = m.value; return acc;
                    }, {})
                });
            }
            if (sectionName === 'routine_tabs') payload.routine_type = activeRoutinePeriod;
            if (sectionName === 'unlock_cta') {
                payload.cta_id = 'unlock_full_routine';
                payload.cta_position = 'routine_unlock_preview';
            }
            trackYunnEvent(eventName, payload);
        });
    }, { threshold: 0.35 });

    sectionMap.forEach(item => {
        const el = document.querySelector(item.selector);
        if (!el) return;
        el.setAttribute('data-analytics-section', item.name);
        el.setAttribute('data-analytics-event', item.event);
        resultAnalyticsObserver.observe(el);
    });
}

function renderRoutine(period) {
    if (period === undefined) period = activeRoutinePeriod;
    if (!currentResultConfig) return;
    activeRoutinePeriod = period;
    trackYunnEvent('routine_preview_view', { routine_type: period });
    document.getElementById('morning-tab').classList.toggle('active', period === 'morning');
    document.getElementById('evening-tab').classList.toggle('active', period === 'evening');
    const steps = currentResultConfig.routines[period] || [];
    document.getElementById('result-routine-list').replaceChildren(...steps.map(routineCardNode));
}

function renderProducts() {
    document.getElementById('result-product-grid').replaceChildren(...RESULT_PRODUCTS.map(productCardNode));
}

function switchRoutineTab(period) {
    trackYunnEvent('routine_preview_expand', { section_name: `${period}_routine` });
    renderRoutine(period);
}

export function setRoutineUnlockState(isUnlocked) {
    const lockedContent = document.getElementById('locked-result-content');
    if (!lockedContent) return;
    lockedContent.classList.toggle('locked', !isUnlocked);
    lockedContent.setAttribute('data-unlocked', isUnlocked ? 'true' : 'false');
    if (isUnlocked && !unlockConversionTracked) {
        unlockConversionTracked = true;
        trackYunnEvent('unlock_conversion', { plan_type: 'full_routine' });
    }
}

function retakeQuiz() {
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

function goBackToSurveyFromResult() {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('survey-screen').style.display = '';
    document.getElementById('survey-screen').classList.add('active');
    if (typeof window.goToStep === 'function') window.goToStep('10');
}

function shareResult() {
    const text = `My YUNN Skin Insight: ${currentResultConfig ? currentResultConfig.skinTypeName : 'Skin Analysis'}`;
    trackYunnEvent('share_result_click', {
        share_channel: navigator.share ? 'native_share' : 'fallback_alert'
    });
    if (navigator.share) {
        navigator.share({ title: 'YUNN Skin Analysis', text }).catch(() => {});
    } else {
        alert(text);
    }
}

function renderResultScreen(data, config) {
    currentResultConfig = config;
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
    setResultChromeStatus();
    renderResultHeader(data, config);
    renderBalance(data, config);
    renderRoutine('morning');
    renderProducts();
    setRoutineUnlockState(isFeedbackVerifiedLocally());
    setupResultAnalytics(data, config);
    window.scrollTo(0, 0);
}

export function showResults() {
    const data = getResultSurveyData();
    const config = getResultConfig(data);
    savePendingResult(data);
    if (typeof window.closeFeedbackGateModal === 'function') window.closeFeedbackGateModal();
    renderResultScreen(data, config);
}

function bindResultEvents() {
    document.getElementById('btn-back-from-result')
        ?.addEventListener('click', goBackToSurveyFromResult);
    document.getElementById('btn-share-result')
        ?.addEventListener('click', shareResult);
    document.getElementById('morning-tab')
        ?.addEventListener('click', () => switchRoutineTab('morning'));
    document.getElementById('evening-tab')
        ?.addEventListener('click', () => switchRoutineTab('evening'));
    document.getElementById('btn-retake-quiz')
        ?.addEventListener('click', retakeQuiz);
    document.getElementById('btn-retake-quiz-nav')
        ?.addEventListener('click', retakeQuiz);
}

window.switchRoutineTab = switchRoutineTab;
window.retakeQuiz = retakeQuiz;
window.goBackToSurveyFromResult = goBackToSurveyFromResult;
window.shareResult = shareResult;
window.showResults = showResults;
window.setRoutineUnlockState = setRoutineUnlockState;

document.addEventListener('DOMContentLoaded', () => {
    bindResultEvents();
    const p = new URLSearchParams(window.location.search);
    if (p.has('returnFromSurvey')) {
        showResults();
        import('../service/FeedbackService.js').then(mod => mod.verifyFeedbackAndUnlock());
    } else if (p.has('resultDemo')) {
        showResults();
    }
});
