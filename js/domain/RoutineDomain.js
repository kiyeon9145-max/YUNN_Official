// RoutineDomain.js — 루틴 비즈니스 로직 (순수 계산 전담)
// DOM 조작, localStorage 직접 접근, GTM 전송은 절대 하지 않는다.
// 저장은 반드시 생성자로 주입받은 RoutineRepository를 경유한다.

import { ROUTINE_CONFIG } from './AppConfig.js';
import { ROUTINE_DATABASE } from './RoutineDatabase.js';

export class RoutineDomain {
    // Private 필드로 repository를 보관해 외부에서 직접 접근할 수 없도록 한다.
    #repo;

    // 의존성 주입(DI) 패턴: repository를 생성자 인자로 받아 테스트 교체가 가능하게 한다.
    constructor(repository) {
        this.#repo = repository;
    }

    // 오늘 날짜를 "YYYY-MM-DD" 문자열로 반환한다.
    // ISO 형식(.toISOString())에서 앞 10자를 잘라내는 방식으로 타임존 변환 없이 UTC 날짜를 얻는다.
    // 저장소 키와 streak 계산의 날짜 기준을 통일하기 위해 이 형식만 사용한다.
    getDayKey() {
        return new Date().toISOString().slice(0, 10);
    }

    // 루틴 시작일로부터 오늘까지 몇 일차인지 1-indexed로 반환한다.
    // 예: 시작 당일 → 1, 다음 날 → 2
    // 시작일이 없으면 0을 반환해 미시작 상태를 나타낸다.
    // 자정(00:00:00)으로 정규화한 뒤 86400000ms(1일) 단위로 나눠 정수 일수를 구한다.
    getDay() {
        const startStr = this.#repo.getRoutineStart();
        if (!startStr) return 0;
        const start = new Date(startStr);
        const today = new Date();
        // 시/분/초를 제거해 날짜 단위 비교를 보장한다.
        start.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return Math.floor((today - start) / 86400000) + 1;
    }

    // 루틴이 이미 시작됐는지 확인한다. 시작일 존재 여부로 판단.
    isStarted() {
        return Boolean(this.#repo.getRoutineStart());
    }

    // 오늘 날짜를 루틴 시작일로 기록한다.
    // AppController의 '루틴 시작' 버튼 클릭 시 한 번 호출된다.
    startRoutine() {
        this.#repo.saveRoutineStart(this.getDayKey());
    }

    // 설문 결과(gender, concernType, skinType)로 RoutineDatabase 키를 조합한다.
    // 키 형식: "성별(F/M)-고민타입(A/P)-피부타입(O/D/N/C)"
    // concernType이 'Acne' 이외는 모두 Pigmentation(P) 루틴으로 분류된다.
    #buildDbKey(result) {
        const gender  = result.gender === 'M' ? 'M' : 'F';
        const concern = result.concernType === 'Acne' ? 'A' : 'P';
        const skinMap = { Oily: 'O', Dry: 'D', Normal: 'N', Combination: 'C' };
        const skin    = skinMap[result.skinType] || 'O';
        return `${gender}-${concern}-${skin}`;
    }

    // 사용자의 설문 결과에 맞는 루틴 스텝 배열을 RoutineDatabase에서 반환한다.
    // DB에 해당 키가 없으면 기본값 'F-A-O'(여성·지성·여드름) 루틴을 사용한다.
    // 반환 형태: { title, morning: [{name, desc}, ...], evening: [...] }
    getRoutineSteps(result) {
        const key = this.#buildDbKey(result);
        return ROUTINE_DATABASE[key] || ROUTINE_DATABASE['F-A-O'];
    }

    // 특정 날짜(dateKey)의 특정 기간(morning/evening)에서 index번째 스텝이 완료됐는지 확인한다.
    // checks[dateKey]?.[period]?.[index]가 없으면 false(미완료)를 반환한다.
    isStepChecked(dateKey, period, index) {
        const checks = this.#repo.getChecks();
        return Boolean(checks[dateKey]?.[period]?.[index]);
    }

    // 특정 날짜·기간·인덱스의 스텝을 완료 처리(true)하고, 변경된 전체 checks 객체를 저장한다.
    // 이미 완료된 스텝은 UI에서 재호출하지 않지만, 중복 저장에도 데이터가 변하지 않는다.
    setStepChecked(dateKey, period, index) {
        const checks = this.#repo.getChecks();
        if (!checks[dateKey])         checks[dateKey] = {};
        if (!checks[dateKey][period]) checks[dateKey][period] = [];
        checks[dateKey][period][index] = true;
        this.#repo.saveChecks(checks);
        return checks;
    }

    // 특정 날짜·기간의 완료 스텝 수와 전체 스텝 수를 반환한다.
    // 반환 형태: { done: number, total: number }
    // RoutineScreen이 진행률 바(progress bar) 렌더링에 이 값을 사용한다.
    getProgress(dateKey, period, totalSteps) {
        const checks = this.#repo.getChecks();
        const arr    = checks[dateKey]?.[period] || [];
        const done   = arr.filter(Boolean).length;
        return { done, total: totalSteps };
    }

    // 특정 날짜·기간의 모든 스텝이 완료됐는지 확인한다.
    // 완료 메시지 표시 및 morning_completed/evening_completed 이벤트 발행 기준으로 사용된다.
    isPeriodComplete(dateKey, period, totalSteps) {
        const { done, total } = this.getProgress(dateKey, period, totalSteps);
        return total > 0 && done >= total;
    }

    // 오늘을 포함해 연속으로 루틴을 수행한 날 수(streak)를 반환한다.
    // Streak 유지 조건: morning 또는 evening 중 하나라도 true가 1개 이상이면 해당 날 유지.
    // 오늘부터 거꾸로 최대 365일을 탐색하며, 수행 기록이 없는 날을 만나면 즉시 중단한다.
    getStreak() {
        const checks = this.#repo.getChecks();
        const today  = new Date();
        let streak   = 0;

        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            const day = checks[key];
            if (!day) break; // 기록 없는 날 발견 → streak 종료
            const done = day.morning?.some(Boolean) || day.evening?.some(Boolean);
            if (!done) break; // 기록은 있지만 완료 스텝이 0개인 날 → streak 종료
            streak++;
        }

        return streak;
    }

    // Day 14 이상이면 After 사진 업로드를 허용한다.
    // BEFORE_AFTER_UNLOCK_DAY는 AppConfig에서 관리하며 직접 14를 쓰지 않는다.
    isBeforeAfterUnlocked() {
        return this.getDay() >= ROUTINE_CONFIG.BEFORE_AFTER_UNLOCK_DAY;
    }
}
