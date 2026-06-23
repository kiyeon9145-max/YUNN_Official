// RoutineDomain.js — 루틴 비즈니스 로직
// DOM 조작, 저장, GTM 전송 금지. 순수 계산 로직만 담당.

import { ROUTINE_CONFIG } from './AppConfig.js';
import { ROUTINE_DATABASE } from './RoutineDatabase.js';

export class RoutineDomain {
    #repo;

    constructor(repository) {
        this.#repo = repository;
    }

    getDayKey() {
        return new Date().toISOString().slice(0, 10);
    }

    getDay() {
        const startStr = this.#repo.getRoutineStart();
        if (!startStr) return 0;
        const start = new Date(startStr);
        const today = new Date();
        start.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return Math.floor((today - start) / 86400000) + 1;
    }

    isStarted() {
        return Boolean(this.#repo.getRoutineStart());
    }

    startRoutine() {
        this.#repo.saveRoutineStart(this.getDayKey());
    }

    #buildDbKey(result) {
        const gender  = result.gender === 'M' ? 'M' : 'F';
        const concern = result.concernType === 'Acne' ? 'A' : 'P';
        const skinMap = { Oily: 'O', Dry: 'D', Normal: 'N', Combination: 'C' };
        const skin    = skinMap[result.skinType] || 'O';
        return `${gender}-${concern}-${skin}`;
    }

    getRoutineSteps(result) {
        const key = this.#buildDbKey(result);
        return ROUTINE_DATABASE[key] || ROUTINE_DATABASE['F-A-O'];
    }

    isStepChecked(dateKey, period, index) {
        const checks = this.#repo.getChecks();
        return Boolean(checks[dateKey]?.[period]?.[index]);
    }

    setStepChecked(dateKey, period, index) {
        const checks = this.#repo.getChecks();
        if (!checks[dateKey])         checks[dateKey] = {};
        if (!checks[dateKey][period]) checks[dateKey][period] = [];
        checks[dateKey][period][index] = true;
        this.#repo.saveChecks(checks);
        return checks;
    }

    getProgress(dateKey, period, totalSteps) {
        const checks = this.#repo.getChecks();
        const arr    = checks[dateKey]?.[period] || [];
        const done   = arr.filter(Boolean).length;
        return { done, total: totalSteps };
    }

    isPeriodComplete(dateKey, period, totalSteps) {
        const { done, total } = this.getProgress(dateKey, period, totalSteps);
        return total > 0 && done >= total;
    }

    getStreak() {
        const checks = this.#repo.getChecks();
        const today  = new Date();
        let streak   = 0;

        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            const day = checks[key];
            if (!day) break;
            const done = day.morning?.some(Boolean) || day.evening?.some(Boolean);
            if (!done) break;
            streak++;
        }

        return streak;
    }

    isBeforeAfterUnlocked() {
        return this.getDay() >= ROUTINE_CONFIG.BEFORE_AFTER_UNLOCK_DAY;
    }
}
