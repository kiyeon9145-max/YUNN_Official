// ReminderModal.js — 시간 기반 루틴 알림 모달

import { ROUTINE_CONFIG } from '../domain/AppConfig.js';

const SESSION_KEY = 'yunn_reminder_dismissed';

export class ReminderModal {
    #el;
    #onDismiss;

    init() {
        this.#el = document.getElementById('reminder-modal');
        if (!this.#el) return;
        this.#el.querySelector('.reminder-btn-go')?.addEventListener('click',  () => this.dismiss());
        this.#el.querySelector('.reminder-btn-later')?.addEventListener('click', () => this.dismiss());
    }

    #getCurrentPeriod() {
        const h = new Date().getHours();
        if (h >= ROUTINE_CONFIG.MORNING_START_HOUR && h < ROUTINE_CONFIG.MORNING_END_HOUR) return 'morning';
        if (h >= ROUTINE_CONFIG.EVENING_START_HOUR && h < ROUTINE_CONFIG.EVENING_END_HOUR) return 'evening';
        return null;
    }

    shouldShow() {
        if (sessionStorage.getItem(SESSION_KEY)) return false;
        return this.#getCurrentPeriod() !== null;
    }

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

    dismiss() {
        sessionStorage.setItem(SESSION_KEY, '1');
        this.#el?.classList.remove('active');
        this.#onDismiss?.();
    }

    onDismiss(fn) {
        this.#onDismiss = fn;
    }
}
