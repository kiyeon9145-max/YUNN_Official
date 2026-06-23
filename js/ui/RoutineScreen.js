// RoutineScreen.js — 루틴 메인 화면 렌더링
// 비즈니스 로직 처리 금지. 화면 렌더링과 이벤트 바인딩만 담당.

import {
    trackRoutineStepChecked,
    trackMorningCompleted,
    trackEveningCompleted,
    markAnalyticsScreen
} from '../service/AnalyticsService.js';

export class RoutineScreen {
    #domain;
    #steps       = null;
    #activePeriod = 'morning';
    #dateKey      = '';
    #day          = 1;

    setDeps(domain) {
        this.#domain = domain;
    }

    init(result) {
        this.#dateKey = this.#domain.getDayKey();
        this.#day     = this.#domain.getDay();
        this.#steps   = this.#domain.getRoutineSteps(result);
        this.#activePeriod = this.#getDefaultPeriod();

        markAnalyticsScreen('routine');

        this.#renderDay();
        this.#renderStreak();
        this.#renderTabs();
        this.#bindTabs();
        this.#renderSteps(this.#activePeriod);
        this.#renderAfterBanner();
    }

    #getDefaultPeriod() {
        const h = new Date().getHours();
        return h >= 12 ? 'evening' : 'morning';
    }

    #renderDay() {
        const el = document.getElementById('routine-day');
        if (el) el.textContent = `Day ${this.#day}`;
        const sub = document.getElementById('routine-date');
        if (sub) sub.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
    }

    #renderStreak() {
        const streak = this.#domain.getStreak();
        const el = document.getElementById('routine-streak');
        if (!el) return;
        if (streak >= 2) {
            el.textContent = `🔥 ${streak} Day Streak`;
            el.classList.add('active');
        } else {
            el.textContent = streak === 1 ? '🌱 Day 1 – Let\'s build your habit!' : '';
            el.classList.remove('active');
        }
    }

    #renderTabs() {
        document.querySelectorAll('.period-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.period === this.#activePeriod);
        });
    }

    #bindTabs() {
        document.querySelectorAll('.period-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.#activePeriod = tab.dataset.period;
                this.#renderTabs();
                this.#renderSteps(this.#activePeriod);
            });
        });
    }

    #renderSteps(period) {
        const container = document.getElementById('step-list');
        if (!container) return;
        const steps = this.#steps[period] || [];
        container.innerHTML = '';

        steps.forEach((step, i) => {
            const checked = this.#domain.isStepChecked(this.#dateKey, period, i);
            const card = document.createElement('div');
            card.className = `step-card${checked ? ' checked' : ''}`;
            card.dataset.period = period;
            card.dataset.index  = i;
            card.innerHTML = `
                <button class="step-check-btn" type="button" aria-label="Mark as done">
                    <span class="step-check-icon">${checked ? '✓' : ''}</span>
                </button>
                <div class="step-info">
                    <p class="step-name">${step.name}</p>
                    <p class="step-desc">${step.desc}</p>
                </div>`;
            card.querySelector('.step-check-btn').addEventListener('click', () => {
                if (this.#domain.isStepChecked(this.#dateKey, period, i)) return;
                this.#handleCheck(period, i, step.name, steps.length);
                card.classList.add('checked');
                card.querySelector('.step-check-icon').textContent = '✓';
            });
            container.appendChild(card);
        });

        this.#renderProgress(period, steps.length);
    }

    #handleCheck(period, index, stepName, totalSteps) {
        this.#domain.setStepChecked(this.#dateKey, period, index);
        trackRoutineStepChecked(this.#day, period, index, stepName);
        this.#renderProgress(period, totalSteps);
        this.#renderStreak();

        if (this.#domain.isPeriodComplete(this.#dateKey, period, totalSteps)) {
            if (period === 'morning') trackMorningCompleted(this.#day);
            else                      trackEveningCompleted(this.#day);
            this.#showCompletionMessage(period);
        }
    }

    #renderProgress(period, totalSteps) {
        const { done } = this.#domain.getProgress(this.#dateKey, period, totalSteps);
        const el = document.getElementById('routine-progress-text');
        if (el) el.textContent = `${done} / ${totalSteps} steps done`;

        const bar = document.getElementById('routine-progress-bar');
        if (bar) bar.style.width = totalSteps > 0 ? `${(done / totalSteps) * 100}%` : '0%';
    }

    #showCompletionMessage(period) {
        const el = document.getElementById('routine-complete-msg');
        if (!el) return;
        el.textContent = period === 'morning'
            ? '☀️ Morning routine complete! Great job.'
            : '🌙 Evening routine complete! Rest well.';
        el.classList.add('visible');
        setTimeout(() => el.classList.remove('visible'), 3000);
    }

    #renderAfterBanner() {
        const banner = document.getElementById('after-photo-banner');
        if (!banner) return;
        if (this.#domain.isBeforeAfterUnlocked()) {
            banner.classList.add('visible');
        }
    }
}
