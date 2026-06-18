// ModalManager.js — Beta Service Modal + Feedback Gate Modal + 카트 이벤트

import { RESULT_PRODUCTS } from '../domain/RoutineConfig.js';
import { trackYunnEvent, yunnAnalyticsState } from '../service/AnalyticsService.js';
import { getPrimaryConcernType, getResultSurveyData } from '../service/ResultService.js';
import { setItem, getItem } from '../repository/SessionRepository.js';
import { openFeedbackSurvey, verifyFeedbackAndUnlock } from '../service/FeedbackService.js';

export class ModalManager {
    #betaCloseTimer = null;
    #resultScreen = null;

    setDeps(resultScreen) {
        this.#resultScreen = resultScreen;
    }

    init() {
        this.#bindEvents();
    }

    openBetaModal(source = 'single', productId = '') {
        try {
            const events = JSON.parse(getItem('yunn_beta_events') || '[]');
            events.push({ source, productId, createdAt: new Date().toISOString() });
            setItem('yunn_beta_events', JSON.stringify(events.slice(-100)));
        } catch { }

        trackYunnEvent('beta_service_modal_view', { source, product_id: productId });
        const modal = document.getElementById('beta-service-modal');
        if (!modal) return;
        if (this.#betaCloseTimer) { clearTimeout(this.#betaCloseTimer); this.#betaCloseTimer = null; }
        modal.classList.remove('closing');
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }

    closeBetaModal(event) {
        if (event) event.stopPropagation();
        trackYunnEvent('beta_service_modal_close', {
            close_source: event ? 'close_button' : 'backdrop_or_programmatic'
        });
        const modal = document.getElementById('beta-service-modal');
        if (!modal || !modal.classList.contains('active')) return;
        modal.classList.add('closing');
        this.#betaCloseTimer = setTimeout(() => {
            modal.classList.remove('active', 'closing');
            modal.setAttribute('aria-hidden', 'true');
            this.#betaCloseTimer = null;
        }, 320);
    }

    openFeedbackGateModal(mode = 'ready') {
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
            this.setFeedbackGateStatus('ph ph-check-circle', 'Feedback received — thank you!',
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
                    this.#resultScreen?.setUnlockState(true);
                    this.closeFeedbackGateModal();
                };
            }
        } else if (mode === 'checking') {
            this.setFeedbackGateStatus('ph ph-circle-notch', 'Checking your submission',
                'Please wait a moment while YUNN verifies your Google Form response.');
        } else if (mode === 'pending') {
            this.setFeedbackGateStatus('ph ph-warning-circle', 'Submission not confirmed yet',
                'Please complete the Google Form first, then return to this page from the confirmation screen.');
        } else {
            this.setFeedbackGateStatus('ph ph-lock-key', 'Your full routine stays saved here',
                'Close this sheet anytime. The consultation above remains visible, and the routine unlocks after the feedback step.');
        }
    }

    closeFeedbackGateModal(event) {
        if (event) event.stopPropagation();
        trackYunnEvent('feedback_gate_modal_close', {
            close_source: event ? 'close_button' : 'programmatic'
        });
        const modal = document.getElementById('feedback-gate-modal');
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    setFeedbackGateStatus(iconClass, title, copy) {
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

    addRecommendedToCart(productId, source = 'single') {
        const product = RESULT_PRODUCTS.find(p => p.id === productId);
        if (!product) return;
        this.#recordCartEvent(product, source);
        this.openBetaModal(source, product.id);
    }

    addAllToCart() {
        RESULT_PRODUCTS.forEach(product => this.#recordCartEvent(product, 'all'));
        trackYunnEvent('add_all_to_cart_click', { product_count: RESULT_PRODUCTS.length });
        this.openBetaModal('all', 'all-products');
    }

    #recordCartEvent(product, source) {
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
        } catch { }
        trackYunnEvent('product_cart_click', { product_id: product.id, product_name: product.name, source });
    }

    #handleBetaFeedbackClick() {
        try { setItem('yunn_beta_feedback_intent', new Date().toISOString()); } catch { }
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

    #bindEvents() {
        document.getElementById('beta-service-modal')
            ?.addEventListener('click', e => { if (e.target?.id === 'beta-service-modal') this.closeBetaModal(); });
        document.getElementById('btn-beta-modal-close')
            ?.addEventListener('click', e => this.closeBetaModal(e));
        document.getElementById('btn-beta-feedback')
            ?.addEventListener('click', () => this.#handleBetaFeedbackClick());

        document.getElementById('feedback-gate-modal')
            ?.addEventListener('click', e => { if (e.target?.id === 'feedback-gate-modal') this.closeFeedbackGateModal(); });
        document.getElementById('btn-feedback-gate-close')
            ?.addEventListener('click', e => this.closeFeedbackGateModal(e));
        document.getElementById('btn-open-feedback-survey')
            ?.addEventListener('click', () => openFeedbackSurvey());
        document.getElementById('btn-verify-feedback')
            ?.addEventListener('click', () => verifyFeedbackAndUnlock());
        document.getElementById('btn-feedback-not-now')
            ?.addEventListener('click', e => this.closeFeedbackGateModal(e));

        document.getElementById('btn-unlock-routine')
            ?.addEventListener('click', () => this.openFeedbackGateModal('ready'));

        document.getElementById('btn-add-all-cart')
            ?.addEventListener('click', () => this.addAllToCart());
        document.getElementById('result-product-grid')
            ?.addEventListener('click', e => {
                const btn = e.target.closest('[data-action="add-to-cart"]');
                if (btn) this.addRecommendedToCart(btn.dataset.productId);
            });
    }
}
