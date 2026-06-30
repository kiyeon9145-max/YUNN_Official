// ModalManager.js — 베타 서비스 모달 + 피드백 게이트 모달 + 장바구니 이벤트 관리
// 베타 모달: 결제 미구현 안내. 피드백 게이트: Google Form 완료 시 Full Routine 잠금 해제 UI.
// FeedbackService(service 레이어)가 window.* 콜백으로 이 클래스의 모달 메서드를 호출한다.

import { RESULT_PRODUCTS } from '../domain/RoutineConfig.js';
import { trackYunnEvent, yunnAnalyticsState } from '../service/AnalyticsService.js';
import { getPrimaryConcernType, getResultSurveyData } from '../service/ResultService.js';
import { setItem, getItem } from '../repository/SessionRepository.js';
import { openFeedbackSurvey, verifyFeedbackAndUnlock } from '../service/FeedbackService.js';

export class ModalManager {
    #betaCloseTimer = null;  // 베타 모달 닫힘 애니메이션 타이머 (중복 방지용)
    #resultScreen = null;    // 잠금 해제 시 결과 화면 상태를 바꾸기 위한 참조

    // app.js에서 호출 — 결과 화면 참조를 연결한다.
    setDeps(resultScreen) {
        this.#resultScreen = resultScreen;
    }

    // 모달 내부 버튼·배경 클릭 이벤트를 바인딩한다.
    init() {
        this.#bindEvents();
    }

    // 베타 서비스 안내 모달을 연다. 노출 이벤트를 localStorage(최근 100건)와 GTM에 기록한다.
    // @param source 호출 위치 ('single' | 'all' 등), @param productId 관련 상품 id
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

    // 베타 모달을 닫는다. closing 클래스로 320ms 퇴장 애니메이션 후 완전히 숨긴다.
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

    // 피드백 게이트 모달을 연다. mode에 따라 안내 문구/버튼이 달라진다:
    //   'ready'(기본): 잠금 안내 / 'checking': 검증 중 / 'pending': 미확인 / 'verified': 완료→루틴 보기.
    // 'verified'일 때만 기본 버튼을 "View My Routine"으로 바꿔 잠금을 해제한다.
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

    // 피드백 게이트 모달을 닫는다.
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

    // 게이트 모달의 상태 영역(아이콘+제목+설명)을 교체한다. XSS 방지를 위해 textContent로만 채운다.
    // FeedbackService도 window.setFeedbackGateStatus로 이 메서드를 호출한다.
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

    // 추천 상품 하나를 장바구니에 담는다 (이벤트 기록 후 베타 모달 안내).
    addRecommendedToCart(productId, source = 'single') {
        const product = RESULT_PRODUCTS.find(p => p.id === productId);
        if (!product) return;
        this.#recordCartEvent(product, source);
        this.openBetaModal(source, product.id);
    }

    // 추천 상품 전체를 한 번에 담는다.
    addAllToCart() {
        RESULT_PRODUCTS.forEach(product => this.#recordCartEvent(product, 'all'));
        trackYunnEvent('add_all_to_cart_click', { product_count: RESULT_PRODUCTS.length });
        this.openBetaModal('all', 'all-products');
    }

    // 장바구니 클릭을 localStorage(최근 100건)와 GTM에 기록한다 — 피부타입·고민 정보도 함께 저장.
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

    // 베타 모달 안의 피드백 CTA 클릭 처리: 의향 기록 + 버튼을 "Thank you" 상태로 바꿈.
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

    // 두 모달의 배경 클릭(닫기)·닫기 버튼·CTA 버튼과 추천 상품 그리드의 장바구니 버튼을 바인딩한다.
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
