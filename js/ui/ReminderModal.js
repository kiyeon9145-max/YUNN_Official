// ReminderModal.js — 접속 시간 기반 루틴 알림 모달 (Web Push 대안, CLAUDE.md MVP 정책)
// 아침/저녁 시간대에 접속하면 "지금 루틴 할 시간" 모달을 띄운다.
// 한 세션에 한 번만 표시(sessionStorage 플래그)해 과도한 노출을 막는다.

import { ROUTINE_CONFIG } from '../domain/AppConfig.js';

// 이 세션에서 모달을 이미 닫았는지 기록하는 sessionStorage 키 (탭 닫으면 초기화됨).
const SESSION_KEY = 'yunn_reminder_dismissed';

export class ReminderModal {
    #el;         // 모달 DOM 요소
    #onDismiss;  // 닫힘 시 실행할 콜백 (선택)

    // 모달 요소를 찾고 "지금 하기"/"나중에" 버튼에 닫기 핸들러를 연결한다.
    init() {
        this.#el = document.getElementById('reminder-modal');
        if (!this.#el) return;
        this.#el.querySelector('.reminder-btn-go')?.addEventListener('click',  () => this.dismiss());
        this.#el.querySelector('.reminder-btn-later')?.addEventListener('click', () => this.dismiss());
    }

    // 현재 시각이 어느 알림 시간대인지 반환 ('morning' | 'evening' | null).
    // 경계 시각은 AppConfig.ROUTINE_CONFIG에서만 관리 (하드코딩 금지).
    #getCurrentPeriod() {
        const h = new Date().getHours();
        if (h >= ROUTINE_CONFIG.MORNING_START_HOUR && h < ROUTINE_CONFIG.MORNING_END_HOUR) return 'morning';
        if (h >= ROUTINE_CONFIG.EVENING_START_HOUR && h < ROUTINE_CONFIG.EVENING_END_HOUR) return 'evening';
        return null;
    }

    // 표시 여부 판단: 이번 세션에 이미 닫았으면 false, 아니면 알림 시간대일 때만 true.
    shouldShow() {
        if (sessionStorage.getItem(SESSION_KEY)) return false;
        return this.#getCurrentPeriod() !== null;
    }

    // 시간대에 맞춰 아이콘·인사말을 채우고 모달을 활성화한다. 시간대 밖이면 표시하지 않는다.
    show() {
        if (!this.#el) return;
        const period = this.#getCurrentPeriod();
        if (!period) return;

        const isMorning = period === 'morning';
        this.#el.querySelector('.reminder-icon').textContent  = isMorning ? '☀️' : '🌙';
        this.#el.querySelector('.reminder-greeting').textContent =
            isMorning ? 'Good morning!' : 'Good evening!';
        this.#el.querySelector('.reminder-message').textContent = 'Time for your skincare routine.';

        this.#el.classList.add('active');
    }

    // 모달을 닫고 이번 세션 재표시를 막은 뒤, 등록된 콜백이 있으면 실행한다.
    dismiss() {
        sessionStorage.setItem(SESSION_KEY, '1');
        this.#el?.classList.remove('active');
        this.#onDismiss?.();
    }

    // 닫힘 시 실행할 콜백을 등록한다.
    onDismiss(fn) {
        this.#onDismiss = fn;
    }
}
