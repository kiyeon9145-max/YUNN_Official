// ModalManager.js — Beta Service Modal + Feedback Gate Modal + 카트 이벤트

import { RESULT_PRODUCTS } from '../domain/RoutineConfig.js';
import { trackYunnEvent, yunnAnalyticsState } from '../service/AnalyticsService.js';
import { escapeHTML, getPrimaryConcernType, getResultSurveyData } from '../service/ResultService.js';
import { setItem, getItem } from '../repository/SessionRepository.js';
import { openFeedbackSurvey, verifyFeedbackAndUnlock } from '../service/FeedbackService.js';
import { setRoutineUnlockState } from './ResultScreen.js';

// ---------- Beta Service Modal ----------

let betaModalCloseTimer = null;

function recordCartEvent(product, source = 'single') {
    try {
        const events = JSON.parse(getItem('yunn_cart_events') || '[]');
        events.push({
            productId: product.id,
            productName: product.name,
            source,
            skinType: getResultSurveyData().skinType,
            concernType: getPrimaryConcernType(),
            createdAt: new Date().toISOString()
        });
        setItem('yunn_cart_events', JSON.stringify(events.slice(-100)));
    } catch {
        // 카트 이벤트 추적은 best-effort
    }
    trackYunnEvent('product_cart_click', {
        product_id: product.id,
        product_name: product.name,
        source
    });
}

export function addRecommendedToCart(productId, source = 'single') {
    const product = RESULT_PRODUCTS.find(item => item.id === productId);
    if (!product) return;
    recordCartEvent(product, source);
    openBetaServiceModal(source, product.id);
}

export function addAllRecommendedToCart() {
    RESULT_PRODUCTS.forEach(product => recordCartEvent(product, 'all'));
    trackYunnEvent('add_all_to_cart_click', { product_count: RESULT_PRODUCTS.length });
    openBetaServiceModal('all', 'all-products');
}

function openBetaServiceModal(source = 'single', productId = '') {
    try {
        const events = JSON.parse(getItem('yunn_beta_events') || '[]');
        events.push({ source, productId, createdAt: new Date().toISOString() });
        setItem('yunn_beta_events', JSON.stringify(events.slice(-100)));
    } catch { /* best-effort */ }

    trackYunnEvent('beta_service_modal_view', { source, product_id: productId });
    const modal = document.getElementById('beta-service-modal');
    if (!modal) return;
    if (betaModalCloseTimer) { clearTimeout(betaModalCloseTimer); betaModalCloseTimer = null; }
    modal.classList.remove('closing');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
}

function closeBetaServiceModal(event) {
    if (event) event.stopPropagation();
    trackYunnEvent('beta_service_modal_close', {
        close_source: event ? 'close_button' : 'backdrop_or_programmatic'
    });
    const modal = document.getElementById('beta-service-modal');
    if (!modal || !modal.classList.contains('active')) return;
    modal.classList.add('closing');
    betaModalCloseTimer = setTimeout(() => {
        modal.classList.remove('active', 'closing');
        modal.setAttribute('aria-hidden', 'true');
        betaModalCloseTimer = null;
    }, 320);
}

function handleBetaModalBackdrop(event) {
    if (event.target && event.target.id === 'beta-service-modal') closeBetaServiceModal();
}

function handleBetaFeedbackClick() {
    try { setItem('yunn_beta_feedback_intent', new Date().toISOString()); } catch { /* best-effort */ }
    const cta = document.getElementById('btn-beta-feedback');
    if (cta) {
        const label = document.createElement('span');
        label.textContent = 'Thank you — noted';
        const icon = document.createElement('i');
        icon.className = 'ph-bold ph-check';
        cta.replaceChildren(label, icon);
    }
    trackYunnEvent('beta_feedback_click', { source: 'beta_service_modal' });
}

// ---------- Feedback Gate Modal ----------

export function setFeedbackGateStatus(iconClass, title, copy) {
    const status = document.getElementById('feedback-gate-status');
    if (!status) return;
    const icon = document.createElement('i');
    icon.className = iconClass;
    const textDiv = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = title;
    const span = document.createElement('span');
    span.textContent = copy;
    textDiv.append(strong, span);
    status.replaceChildren(icon, textDiv);
}

export function openFeedbackGateModal(mode = 'ready') {
    trackYunnEvent('unlock_cta_click', {
        cta_id: 'unlock_full_routine',
        mode,
        delay_sec: Math.round((Date.now() - yunnAnalyticsState.screenStartedAt) / 1000)
    });
    const modal = document.getElementById('feedback-gate-modal');
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    if (mode === 'verified') {
        setFeedbackGateStatus('ph ph-check-circle', 'Feedback received — thank you!',
            'Your response has been noted. Tap below to unlock your morning, evening, and product routine.');
        const primaryBtn = modal.querySelector('.feedback-gate-primary');
        if (primaryBtn) {
            primaryBtn.style.cssText = 'background: var(--primary); box-shadow: 0 4px 12px rgba(58,174,146,0.35);';
            const label = document.createElement('span');
            label.textContent = 'View My Routine';
            const arrow = document.createElement('i');
            arrow.className = 'ph ph-arrow-right';
            primaryBtn.replaceChildren(label, arrow);
            primaryBtn.onclick = (e) => {
                e.stopPropagation();
                setRoutineUnlockState(true);
                closeFeedbackGateModal();
            };
        }
    } else if (mode === 'checking') {
        setFeedbackGateStatus('ph ph-circle-notch', 'Checking your submission',
            'Please wait a moment while YUNN verifies your Google Form response.');
    } else if (mode === 'pending') {
        setFeedbackGateStatus('ph ph-warning-circle', 'Submission not confirmed yet',
            'Please complete the Google Form first, then return to this page from the confirmation screen.');
    } else {
        setFeedbackGateStatus('ph ph-lock-key', 'Your full routine stays saved here',
            'Close this sheet anytime. The consultation above remains visible, and the routine unlocks after the feedback step.');
    }
}

export function closeFeedbackGateModal(event) {
    if (event) event.stopPropagation();
    trackYunnEvent('feedback_gate_modal_close', {
        close_source: event ? 'close_button' : 'programmatic'
    });
    const modal = document.getElementById('feedback-gate-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
}

function handleFeedbackGateBackdrop(event) {
    if (event.target && event.target.id === 'feedback-gate-modal') closeFeedbackGateModal();
}

// ---------- 이벤트 바인딩 ----------

function bindModalEvents() {
    // Beta modal
    document.getElementById('beta-service-modal')
        ?.addEventListener('click', handleBetaModalBackdrop);
    document.getElementById('btn-beta-modal-close')
        ?.addEventListener('click', closeBetaServiceModal);
    document.getElementById('btn-beta-feedback')
        ?.addEventListener('click', handleBetaFeedbackClick);

    // Feedback gate modal
    document.getElementById('feedback-gate-modal')
        ?.addEventListener('click', handleFeedbackGateBackdrop);
    document.getElementById('btn-feedback-gate-close')
        ?.addEventListener('click', closeFeedbackGateModal);
    document.getElementById('btn-open-feedback-survey')
        ?.addEventListener('click', openFeedbackSurvey);
    document.getElementById('btn-verify-feedback')
        ?.addEventListener('click', verifyFeedbackAndUnlock);
    document.getElementById('btn-feedback-not-now')
        ?.addEventListener('click', closeFeedbackGateModal);

    // 잠금 해제 CTA (result screen)
    document.getElementById('btn-unlock-routine')
        ?.addEventListener('click', () => openFeedbackGateModal('ready'));

    // 카트 버튼 (Add All + 상품 카드 이벤트 위임)
    document.getElementById('btn-add-all-cart')
        ?.addEventListener('click', addAllRecommendedToCart);
    document.getElementById('result-product-grid')
        ?.addEventListener('click', e => {
            const btn = e.target.closest('[data-action="add-to-cart"]');
            if (btn) addRecommendedToCart(btn.dataset.productId);
        });
}

window.openBetaServiceModal = openBetaServiceModal;
window.closeBetaServiceModal = closeBetaServiceModal;
window.openFeedbackGateModal = openFeedbackGateModal;
window.closeFeedbackGateModal = closeFeedbackGateModal;
window.setFeedbackGateStatus = setFeedbackGateStatus;
window.addRecommendedToCart = addRecommendedToCart;
window.addAllRecommendedToCart = addAllRecommendedToCart;
window.verifyFeedbackAndUnlock = verifyFeedbackAndUnlock;

document.addEventListener('DOMContentLoaded', bindModalEvents);
