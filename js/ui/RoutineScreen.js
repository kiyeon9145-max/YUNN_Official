// RoutineScreen.js — 루틴 메인 화면 렌더링 (Day 카운터 + 체크리스트 + Streak)
// 비즈니스 로직 처리 금지(CLAUDE.md). 데이터는 RoutineDomain에서 받고 화면 렌더링·이벤트 바인딩만 담당.
// 체크 흐름: 사용자 클릭 → handleCheck → Domain.setStepChecked → Analytics → 진행률·streak 갱신.

import {
    trackRoutineStepChecked,
    trackMorningCompleted,
    trackEveningCompleted,
    markAnalyticsScreen
} from '../service/AnalyticsService.js';

export class RoutineScreen {
    #domain;                    // 날짜·진행률·체크 상태 로직
    #steps        = null;       // { morning: [...], evening: [...] } 스텝 데이터
    #activePeriod = 'morning';  // 현재 보고 있는 탭 ('morning' | 'evening')
    #dateKey      = '';         // 오늘 날짜 키 "YYYY-MM-DD" (체크 저장 단위)
    #day          = 1;          // 루틴 며칠차 (1-indexed)

    // routine.js에서 호출 — 비즈니스 로직 객체를 연결한다.
    setDeps(domain) {
        this.#domain = domain;
    }

    // 화면 진입 시 호출: 오늘 날짜/Day/스텝을 로드하고 기본 탭을 정한 뒤 전체를 렌더링한다.
    // @param result 설문 진단 결과 — 피부타입·고민별 루틴 스텝 조회에 사용
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

    // 접속 시각으로 기본 탭 결정: 정오(12시) 이후면 저녁, 그 전이면 아침.
    #getDefaultPeriod() {
        const h = new Date().getHours();
        return h >= 12 ? 'evening' : 'morning';
    }

    // "Day N"과 오늘 날짜(요일·월·일)를 헤더에 표시한다.
    #renderDay() {
        const el = document.getElementById('routine-day');
        if (el) el.textContent = `Day ${this.#day}`;
        const sub = document.getElementById('routine-date');
        if (sub) sub.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
    }

    // 연속 수행일(streak)을 표시한다. 2일 이상이면 🔥 강조, 1일이면 격려 문구, 0이면 숨김.
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

    // 현재 활성 탭(아침/저녁)에 active 클래스를 토글한다.
    #renderTabs() {
        document.querySelectorAll('.period-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.period === this.#activePeriod);
        });
    }

    // 탭 클릭 시 활성 기간을 바꾸고 해당 기간의 스텝을 다시 렌더링한다.
    #bindTabs() {
        document.querySelectorAll('.period-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.#activePeriod = tab.dataset.period;
                this.#renderTabs();
                this.#renderSteps(this.#activePeriod);
            });
        });
    }

    // 지정한 기간의 스텝 카드 목록을 생성한다. 각 카드의 체크 버튼에 핸들러를 연결하고,
    // 이미 완료된 스텝은 재클릭을 무시한다. 마지막에 진행률 바를 갱신한다.
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

    // 스텝 체크 처리: 저장 → step_checked 이벤트 → 진행률·streak 갱신.
    // 해당 기간 전체 완료 시 morning/evening_completed 이벤트와 축하 메시지를 추가로 표시한다.
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

    // "3 / 5 steps done" 텍스트와 진행률 바 너비를 완료 비율에 맞춰 갱신한다.
    #renderProgress(period, totalSteps) {
        const { done } = this.#domain.getProgress(this.#dateKey, period, totalSteps);
        const el = document.getElementById('routine-progress-text');
        if (el) el.textContent = `${done} / ${totalSteps} steps done`;

        const bar = document.getElementById('routine-progress-bar');
        if (bar) bar.style.width = totalSteps > 0 ? `${(done / totalSteps) * 100}%` : '0%';
    }

    // 기간 완료 축하 메시지를 3초간 표시한다.
    #showCompletionMessage(period) {
        const el = document.getElementById('routine-complete-msg');
        if (!el) return;
        el.textContent = period === 'morning'
            ? '☀️ Morning routine complete! Great job.'
            : '🌙 Evening routine complete! Rest well.';
        el.classList.add('visible');
        setTimeout(() => el.classList.remove('visible'), 3000);
    }

    // Day 14 이상이면 After 사진 업로드 배너를 노출한다 (잠금 해제 안내).
    #renderAfterBanner() {
        const banner = document.getElementById('after-photo-banner');
        if (!banner) return;
        if (this.#domain.isBeforeAfterUnlocked()) {
            banner.classList.add('visible');
        }
    }
}
