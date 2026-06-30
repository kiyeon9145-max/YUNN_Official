// AnalyticsService.js — GTM / GA4 행동 분석 이벤트 추적 중앙 모듈
// 모든 분석 이벤트는 이 파일을 경유한다. 다른 파일에서 dataLayer를 직접 건드리지 않는다.
// 추적 경로: trackYunnEvent() → ① localStorage 백업 ② GTM dataLayer ③ (선택)원격 endpoint ④ CustomEvent
// CLAUDE.md 규칙: AnalyticsManager 신규 생성 금지, GTM 코드 분산 금지 — 루틴 이벤트도 이 파일에 추가.

import {
    YUNN_ANALYTICS_STORAGE_KEY,   // localStorage 이벤트 로그 키
    YUNN_ANALYTICS_MAX_EVENTS,    // 보관 최대 이벤트 수 (초과 시 오래된 것부터 삭제)
    YUNN_ANALYTICS_ENDPOINT,      // 원격 전송 endpoint (미설정 시 로컬+GTM만)
    YUNN_SCROLL_THRESHOLDS,       // 스크롤 깊이 이벤트 발행 % 구간
    YUNN_LONG_STAY_SECONDS        // friction(막힘) 판단 기준 체류 시간
} from '../domain/AppConfig.js';
import { getItem, setItem, getSessionId } from '../repository/SessionRepository.js';

// ── 설문 스텝별 이벤트 이름 매핑 ────────────────────────────────────────────────
// 각 스텝(1~10, 세부 3-1~3-4)마다 발행할 이벤트 이름과 속성 키를 정의한다.
// 키 의미: pageView(진입), timeSpent(체류), abandon(이탈), friction(막힘),
//          scroll(스크롤), optionView(선택지 노출), select/change(선택/변경),
//          nextClick/backClick(이동), *Property(이벤트에 실어 보낼 속성 키 이름).
// 여기서 이름을 관리해 분석 도구의 이벤트명을 한 곳에서 일관되게 유지한다.
export const STEP_ANALYTICS_CONFIG = {
    '1': {
        pageView: 'user_info_page_view',
        timeSpent: 'user_info_time_spent',
        abandon: 'page_abandon',
        optionView: 'progress_bar_view',
        nextClick: 'next_button_click',
        backClick: 'back_button_click'
    },
    '2': {
        pageView: 'demographic_page_view',
        timeSpent: 'demographic_time_spent',
        abandon: 'page_abandon',
        optionViewEvents: [
            { event: 'gender_option_view', selector: 'input[name="gender"]', property: 'option_list' },
            { event: 'age_option_view', selector: 'input[name="age"]', property: 'option_list' }
        ],
        nextClick: 'next_button_click',
        backClick: 'back_button_click'
    },
    '3': {
        pageView: 'skin_type_page_view',
        timeSpent: 'skin_type_time_spent',
        abandon: 'page_abandon',
        optionView: 'skin_type_option_view',
        nextClick: 'next_button_click'
    },
    '3-1': {
        pageView: 'skin_feel_page_view',
        timeSpent: 'skin_feel_time_spent',
        abandon: 'skin_feel_abandon',
        friction: 'skin_feel_friction_detected',
        scroll: 'skin_feel_scroll_depth',
        optionView: 'skin_feel_option_view',
        select: 'skin_feel_select',
        change: 'skin_feel_change',
        nextClick: 'skin_feel_next_click',
        backClick: 'skin_feel_back_click',
        selectedProperty: 'selected_feel_level',
        previousProperty: 'before_level',
        newProperty: 'after_level'
    },
    '3-2': {
        pageView: 'skin_oil_behavior_page_view',
        timeSpent: 'skin_oil_behavior_time_spent',
        abandon: 'skin_oil_behavior_abandon',
        friction: 'skin_oil_behavior_friction_detected',
        scroll: 'skin_oil_behavior_scroll_depth',
        optionView: 'skin_oil_behavior_option_view',
        select: 'skin_oil_behavior_select',
        change: 'skin_oil_behavior_change',
        nextClick: 'skin_oil_behavior_next_click',
        backClick: 'skin_oil_behavior_back_click',
        selectedProperty: 'selected_behavior',
        previousProperty: 'before_behavior',
        newProperty: 'after_behavior'
    },
    '3-3': {
        pageView: 'skin_day_behavior_page_view',
        timeSpent: 'skin_day_behavior_time_spent',
        abandon: 'skin_day_behavior_abandon',
        friction: 'skin_day_behavior_friction_detected',
        scroll: 'skin_day_behavior_scroll_depth',
        optionView: 'skin_day_behavior_option_view',
        select: 'skin_day_behavior_select',
        change: 'skin_day_behavior_change',
        nextClick: 'skin_day_behavior_next_click',
        backClick: 'skin_day_behavior_back_click',
        selectedProperty: 'selected_behavior',
        previousProperty: 'before_behavior',
        newProperty: 'after_behavior'
    },
    '3-4': {
        pageView: 'skin_texture_page_view',
        timeSpent: 'skin_texture_time_spent',
        abandon: 'skin_texture_abandon',
        friction: 'skin_texture_friction_detected',
        scroll: 'skin_texture_scroll_depth',
        optionView: 'skin_texture_option_view',
        select: 'skin_texture_select',
        change: 'skin_texture_change',
        nextClick: 'skin_texture_next_click',
        backClick: 'skin_texture_back_click',
        selectedProperty: 'selected_texture_type',
        previousProperty: 'before_texture',
        newProperty: 'after_texture'
    },
    '4': {
        pageView: 'skin_concern_page_view',
        timeSpent: 'skin_concern_time_spent',
        abandon: 'skin_concern_abandon',
        friction: 'skin_concern_friction_detected',
        scroll: 'skin_concern_scroll_depth',
        optionView: 'skin_concern_option_view',
        select: 'skin_concern_select',
        change: 'skin_concern_change',
        nextClick: 'skin_concern_next_click',
        backClick: 'skin_concern_back_click',
        selectedProperty: 'selected_concern',
        previousProperty: 'before_concern',
        newProperty: 'after_concern'
    },
    '5': {
        pageView: 'skin_trigger_page_view',
        timeSpent: 'skin_trigger_time_spent',
        abandon: 'skin_trigger_abandon',
        friction: 'skin_trigger_friction_detected',
        scroll: 'skin_trigger_scroll_depth',
        optionView: 'skin_trigger_option_view',
        select: 'skin_trigger_select',
        unselect: 'skin_trigger_unselect',
        combination: 'skin_trigger_combination',
        nextClick: 'skin_trigger_next_click',
        backClick: 'skin_trigger_back_click'
    },
    '6': {
        pageView: 'skin_reactivity_page_view',
        timeSpent: 'skin_reactivity_time_spent',
        abandon: 'skin_reactivity_abandon',
        friction: 'skin_reactivity_friction_detected',
        scroll: 'skin_reactivity_scroll_depth',
        optionView: 'skin_reactivity_option_view',
        select: 'skin_reactivity_select',
        change: 'skin_reactivity_change',
        nextClick: 'skin_reactivity_next_click',
        backClick: 'skin_reactivity_back_click',
        selectedProperty: 'selected_reactivity_level',
        previousProperty: 'previous_option',
        newProperty: 'new_option'
    },
    '7': {
        pageView: 'outdoor_time_page_view',
        timeSpent: 'outdoor_time_time_spent',
        abandon: 'outdoor_time_page_abandon',
        friction: 'outdoor_time_friction_detected',
        scroll: 'outdoor_time_scroll_depth',
        nextClick: 'outdoor_time_next_click',
        backClick: 'outdoor_time_back_click'
    },
    '8': {
        pageView: 'sleep_stress_page_view',
        timeSpent: 'sleep_stress_time_spent',
        abandon: 'sleep_stress_abandon',
        friction: 'sleep_stress_friction_detected',
        scroll: 'sleep_stress_scroll_depth',
        nextClick: 'sleep_stress_next_click',
        backClick: 'sleep_stress_back_click'
    },
    '9': {
        pageView: 'routine_page_view',
        timeSpent: 'routine_time_spent',
        abandon: 'routine_abandon',
        friction: 'routine_friction_detected',
        scroll: 'routine_scroll_depth',
        optionView: 'routine_option_view',
        select: 'routine_level_select',
        change: 'routine_level_change',
        nextClick: 'routine_next_click',
        backClick: 'routine_back_click',
        selectedProperty: 'selected_routine_level',
        previousProperty: 'previous_value',
        newProperty: 'new_value'
    },
    '10': {
        pageView: 'final_page_view',
        timeSpent: 'photo_upload_time_spent',
        abandon: 'photo_upload_abandon',
        friction: 'photo_upload_friction_detected',
        scroll: 'photo_upload_scroll_depth'
    }
};

// ── 입력 필드별 이벤트 이름 매핑 ────────────────────────────────────────────────
// 스텝과 무관하게 입력 이름(name 속성)으로 직접 매핑되는 선택지들.
// trackInputSelection()에서 STEP_ANALYTICS_CONFIG보다 우선 적용된다.
export const INPUT_ANALYTICS_CONFIG = {
    gender: {
        select: 'gender_select',
        change: 'gender_change',
        selectedProperty: 'selected_gender',
        previousProperty: 'before_gender',
        newProperty: 'after_gender'
    },
    age: {
        select: 'age_select',
        change: 'age_change',
        selectedProperty: 'selected_age_range',
        previousProperty: 'before_age',
        newProperty: 'after_age'
    },
    skinType: {
        select: 'skin_type_select',
        change: 'skin_type_change',
        selectedProperty: 'selected_skin_type',
        previousProperty: 'before_type',
        newProperty: 'after_type'
    },
    outdoor: {
        select: 'outdoor_time_option_select',
        change: 'outdoor_time_selection_change',
        selectedProperty: 'selected_outdoor_time',
        previousProperty: 'previous_value',
        newProperty: 'new_value'
    },
    sunscreen: {
        select: 'sunscreen_frequency_select',
        change: 'sunscreen_selection_change',
        selectedProperty: 'selected_sunscreen_frequency',
        previousProperty: 'previous_value',
        newProperty: 'new_value'
    },
    sleep: {
        select: 'sleep_duration_select',
        change: 'sleep_duration_change',
        selectedProperty: 'selected_sleep_duration',
        previousProperty: 'previous_value',
        newProperty: 'new_value'
    },
    stress: {
        select: 'stress_level_select',
        change: 'stress_level_change',
        selectedProperty: 'selected_stress_level',
        previousProperty: 'previous_value',
        newProperty: 'new_value'
    }
};

// ── 런타임 분석 상태 ────────────────────────────────────────────────────────────
// 현재 화면/스텝, 체류 시작 시각, 화면별 최대 스크롤, 중복 발행 방지 집합 등을 보관한다.
// 페이지 생애 동안 메모리에 유지되는 단일 상태 객체.
export const yunnAnalyticsState = {
    currentScreen: 'intro',          // 현재 화면 ('intro' | 'survey' | 'result' 등)
    currentStep: '',                 // 현재 설문 스텝 키 (survey 화면일 때만)
    screenStartedAt: Date.now(),     // 현재 화면 진입 시각 (체류 시간 계산용)
    maxScrollByScreen: {},           // 화면별 최대 스크롤 깊이 (%)
    emittedScrollByScreen: {},       // 화면별 이미 발행한 스크롤 임계값 Set (중복 방지)
    viewedScreens: new Set(),        // 조회한 화면 키 집합
    frictionScreens: new Set(),      // friction 이벤트를 이미 발행한 화면 (1회만 발행)
    firstInteractionTracked: false,  // 랜딩 첫 상호작용 추적 여부 (1회만)
    lastVisibleResultSection: '',    // 결과 화면에서 마지막으로 본 섹션 (이탈 분석용)
    uploadStartedAt: 0,              // 사진 업로드 시작 시각
    uploadAttemptCount: 0            // 사진 업로드 시도 횟수
};

// 유입 경로 추정: utm_source → source 파라미터 → 리퍼러 → 'direct' 순으로 폴백.
function getTrafficSource() {
    const params = new URLSearchParams(window.location.search);
    return params.get('utm_source') || params.get('source') || document.referrer || 'direct';
}

// 뷰포트 너비 기준 디바이스 타입 판별 (768 미만 mobile, 1025 미만 tablet, 그 외 desktop).
export function getDeviceType() {
    if (window.matchMedia('(max-width: 767px)').matches) return 'mobile';
    if (window.matchMedia('(max-width: 1024px)').matches) return 'tablet';
    return 'desktop';
}

// 네트워크 타입(4g, wifi 등)을 브라우저별 connection API에서 읽는다. 미지원 시 'unknown'.
function getNetworkType() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection && (connection.effectiveType || connection.type) ? String(connection.effectiveType || connection.type) : 'unknown';
}

// localStorage에 저장된 이벤트 로그 배열을 읽는다. 파싱 실패 시 빈 배열.
function readAnalyticsEvents() {
    try {
        return JSON.parse(getItem(YUNN_ANALYTICS_STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

// 이벤트를 localStorage 로그에 추가한다. 최근 YUNN_ANALYTICS_MAX_EVENTS건만 보관(slice).
function persistAnalyticsEvent(eventPayload) {
    try {
        const events = readAnalyticsEvents();
        events.push(eventPayload);
        setItem(YUNN_ANALYTICS_STORAGE_KEY, JSON.stringify(events.slice(-YUNN_ANALYTICS_MAX_EVENTS)));
    } catch {
        // Analytics persistence is best-effort and must never block the user journey.
    }
}

// ── 핵심 이벤트 발행 함수 ────────────────────────────────────────────────────────
// 모든 추적의 진입점. 공통 메타데이터(세션·페이지·디바이스 등)를 자동으로 덧붙이고
// 4개 채널로 동시에 내보낸다: ①localStorage ②GTM dataLayer ③원격 endpoint ④CustomEvent.
// @param eventName  발행할 이벤트 이름
// @param properties 이벤트별 추가 속성 (공통 메타데이터와 병합)
export function trackYunnEvent(eventName, properties = {}) {
    // 공통 메타데이터 + 호출자가 넘긴 속성을 병합한 최종 payload.
    const eventPayload = {
        event: eventName,
        event_name: eventName,
        session_id: getSessionId(),
        timestamp: new Date().toISOString(),
        page_path: window.location.pathname,
        page_url: window.location.href,
        screen: yunnAnalyticsState.currentScreen,
        step: yunnAnalyticsState.currentStep || '',
        traffic_source: getTrafficSource(),
        device_type: getDeviceType(),
        network: getNetworkType(),
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        ...properties
    };

    // ① localStorage 백업 (분석 도구 누락 대비 + 디버깅용)
    persistAnalyticsEvent(eventPayload);

    // ② GTM dataLayer push (GA4 등으로 전달되는 주 경로)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventPayload);

    // ③ 원격 endpoint 전송 (설정된 경우에만). sendBeacon은 페이지 이탈 중에도 안전하게 전송된다.
    if (YUNN_ANALYTICS_ENDPOINT && navigator.sendBeacon) {
        try {
            navigator.sendBeacon(YUNN_ANALYTICS_ENDPOINT, JSON.stringify(eventPayload));
        } catch {
            // Remote analytics must never block the UI.
        }
    }

    // ④ 앱 내부 리스너용 CustomEvent (예: 실시간 디버그 패널)
    window.dispatchEvent(new CustomEvent('yunn:analytics', { detail: eventPayload }));
    return eventPayload;
}
// 번들 환경에서 인라인 HTML이 호출할 수 있도록 전역 노출.
window.trackYunnEvent = trackYunnEvent;

// 화면 식별 키 반환. 스텝이 있으면 "step_3", 없으면 현재 화면 이름.
// maxScrollByScreen / frictionScreens 등 화면별 상태의 키로 사용된다.
export function getScreenKey(step) {
    const s = step !== undefined ? step : yunnAnalyticsState.currentStep;
    return s ? `step_${s}` : yunnAnalyticsState.currentScreen;
}

// 현재 페이지의 스크롤 깊이를 0~100%로 반환. 분모가 0이 되지 않도록 최소 1로 보정.
export function getScrollPercent() {
    const doc = document.documentElement;
    const maxScrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
    return Math.min(100, Math.round((window.scrollY / maxScrollable) * 100));
}

// 특정 스텝에서 사용자가 선택한 값들을 { 입력이름: 값 또는 값배열 } 형태로 수집한다.
// 단일 선택은 문자열, 다중 선택(체크박스)은 배열로 정규화한다.
export function getCurrentStepSelectedValues(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const activeStep = document.querySelector(`.survey-step[data-step="${String(step)}"]`);
    if (!activeStep) return {};
    const values = {};
    activeStep.querySelectorAll('input:checked').forEach(input => {
        if (!values[input.name]) values[input.name] = [];
        values[input.name].push(input.value);
    });
    return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.length === 1 ? value[0] : value]));
}

// 특정 스텝에 노출된 모든 선택지 값 목록을 반환한다 (선택 여부 무관).
// 어떤 선택지가 사용자에게 보였는지 분석(option_list 속성)에 사용된다.
export function getStepOptionList(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const activeStep = document.querySelector(`.survey-step[data-step="${String(step)}"]`);
    if (!activeStep) return [];
    return [...activeStep.querySelectorAll('input[type="radio"], input[type="checkbox"]')].map(input => input.value);
}

// 스텝 완료 상태를 'partial_or_complete'(하나라도 선택) / 'empty'(미선택)로 반환.
export function getStepCompletionStatus(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const selectedValues = getCurrentStepSelectedValues(step);
    return Object.keys(selectedValues).length ? 'partial_or_complete' : 'empty';
}

// 스텝 진입 시 선택지 노출(optionView) 이벤트를 발행한다.
// optionViewEvents 배열이 있으면 입력 그룹별로 개별 발행(예: 성별·나이 각각),
// 없으면 단일 optionView 이벤트로 전체 선택지 목록을 발행한다.
function emitStepOptionView(step) {
    const config = STEP_ANALYTICS_CONFIG[String(step)];
    if (!config) return;
    if (Array.isArray(config.optionViewEvents)) {
        config.optionViewEvents.forEach(item => {
            const optionList = [...document.querySelectorAll(item.selector)].map(input => input.value);
            trackYunnEvent(item.event, {
                step_number: String(step),
                [item.property]: optionList
            });
        });
        return;
    }
    if (config.optionView) {
        trackYunnEvent(config.optionView, {
            step_number: String(step),
            option_list: getStepOptionList(step)
        });
    }
}

// ── 화면 전환·체류·이탈 추적 ──────────────────────────────────────────────────
// 화면 전환 시 호출. 현재 화면/스텝을 갱신하고 체류 타이머를 리셋한다.
// friction 플래그도 초기화해 새 화면에서 다시 막힘을 감지할 수 있게 한다.
export function markAnalyticsScreen(screen, step = '') {
    yunnAnalyticsState.currentScreen = screen;
    yunnAnalyticsState.currentStep = step ? String(step) : '';
    yunnAnalyticsState.screenStartedAt = Date.now();
    yunnAnalyticsState.frictionScreens.delete(getScreenKey(step));
}

// 현재 화면을 떠날 때 체류 시간 이벤트를 발행한다.
// 스텝 화면이면 timeSpent 이벤트(선택값·스크롤 포함), intro/result면 전용 이벤트로 분기.
// @param reason 발행 사유 ('screen_leave' | 'beforeunload' 등)
export function emitCurrentScreenTime(reason = 'screen_leave') {
    const durationSec = Math.round((Date.now() - yunnAnalyticsState.screenStartedAt) / 1000);
    const screenKey = getScreenKey();
    const step = yunnAnalyticsState.currentStep;
    const config = STEP_ANALYTICS_CONFIG[String(step)];
    const maxScrollDepth = yunnAnalyticsState.maxScrollByScreen[screenKey] || getScrollPercent();

    if (config && config.timeSpent) {
        trackYunnEvent(config.timeSpent, {
            stay_duration_sec: durationSec,
            duration_sec: durationSec,
            scroll_depth: maxScrollDepth,
            selected_status: getStepCompletionStatus(step),
            selected_values: getCurrentStepSelectedValues(step),
            reason
        });
    } else if (yunnAnalyticsState.currentScreen === 'intro') {
        trackYunnEvent('landing_time_spent', {
            duration_seconds: durationSec,
            source: getTrafficSource(),
            reason
        });
    } else if (yunnAnalyticsState.currentScreen === 'result') {
        trackYunnEvent('result_time_spent', {
            duration_sec: durationSec,
            reason
        });
    }
}

// 사용자가 페이지를 이탈할 때 이탈 지점·완료 상태를 기록한다.
// 결과 화면에서는 스크롤이 얕거나(35% 미만) 잠금 미해제 상태면 추가 드롭오프 이벤트를 발행 —
// KPI 분석(어디서 떨어져 나가는가)의 핵심 데이터.
// @param reason 이탈 사유
export function emitPageAbandon(reason = 'page_exit') {
    const step = yunnAnalyticsState.currentStep;
    const config = STEP_ANALYTICS_CONFIG[String(step)];
    const screenKey = getScreenKey();
    const maxScrollDepth = yunnAnalyticsState.maxScrollByScreen[screenKey] || getScrollPercent();
    if (config && config.abandon) {
        trackYunnEvent(config.abandon, {
            completion_status: getStepCompletionStatus(step),
            selection_status: getStepCompletionStatus(step),
            selected_values: getCurrentStepSelectedValues(step),
            upload_started: Boolean(yunnAnalyticsState.uploadStartedAt),
            reason
        });
    } else if (yunnAnalyticsState.currentScreen === 'intro') {
        trackYunnEvent('landing_exit', {
            max_scroll_depth: maxScrollDepth,
            duration: Math.round((Date.now() - yunnAnalyticsState.screenStartedAt) / 1000),
            source: getTrafficSource(),
            reason
        });
    } else if (yunnAnalyticsState.currentScreen === 'result') {
        trackYunnEvent('result_exit', {
            exit_section: yunnAnalyticsState.lastVisibleResultSection || 'unknown',
            reason
        });
        if (maxScrollDepth < 35) {
            trackYunnEvent('exit_before_balance', { scroll_percent: maxScrollDepth });
        }
        // isFeedbackVerifiedLocally는 FeedbackService에서 window에 노출됨
        const feedbackVerified = typeof window.isFeedbackVerifiedLocally === 'function' && window.isFeedbackVerifiedLocally();
        if (!feedbackVerified) {
            trackYunnEvent('unlock_dropoff', {
                last_seen_section: yunnAnalyticsState.lastVisibleResultSection || 'unknown'
            });
            trackYunnEvent('exit_before_unlock', { scroll_percent: maxScrollDepth });
        }
    }
}

// 한 스텝에 YUNN_LONG_STAY_SECONDS 이상 머물면 friction(막힘) 이벤트를 1회 발행한다.
// 이미 발행한 화면은 frictionScreens로 걸러 중복을 막는다.
function emitFrictionIfNeeded() {
    const step = yunnAnalyticsState.currentStep;
    const config = STEP_ANALYTICS_CONFIG[String(step)];
    if (!config || !config.friction) return;
    const screenKey = getScreenKey(step);
    if (yunnAnalyticsState.frictionScreens.has(screenKey)) return;
    const durationSec = Math.round((Date.now() - yunnAnalyticsState.screenStartedAt) / 1000);
    if (durationSec >= YUNN_LONG_STAY_SECONDS) {
        yunnAnalyticsState.frictionScreens.add(screenKey);
        trackYunnEvent(config.friction, { duration_sec: durationSec });
    }
}

// 스크롤 시 화면별 최대 깊이를 갱신하고, 임계값(25/50/75/100%) 통과 시 1회씩 이벤트 발행.
// emittedScrollByScreen Set으로 같은 임계값 중복 발행을 막는다. 마지막에 friction도 점검.
function emitScrollDepth() {
    const screenKey = getScreenKey();
    const percent = getScrollPercent();
    const previousMax = yunnAnalyticsState.maxScrollByScreen[screenKey] || 0;
    yunnAnalyticsState.maxScrollByScreen[screenKey] = Math.max(previousMax, percent);
    const emitted = yunnAnalyticsState.emittedScrollByScreen[screenKey] || new Set();
    yunnAnalyticsState.emittedScrollByScreen[screenKey] = emitted;
    YUNN_SCROLL_THRESHOLDS.forEach(threshold => {
        if (percent >= threshold && !emitted.has(threshold)) {
            emitted.add(threshold);
            const step = yunnAnalyticsState.currentStep;
            const config = STEP_ANALYTICS_CONFIG[String(step)];
            const scrollEvent = config && config.scroll
                ? config.scroll
                : yunnAnalyticsState.currentScreen === 'result'
                    ? 'scroll_depth_result'
                    : 'landing_scroll_depth';
            trackYunnEvent(scrollEvent, {
                scroll_percent: threshold,
                time_spent: Math.round((Date.now() - yunnAnalyticsState.screenStartedAt) / 1000)
            });
        }
    });
    emitFrictionIfNeeded();
}

// ── 화면별 진입/상호작용 추적 함수 ──────────────────────────────────────────────
// 랜딩(intro) 화면 진입을 기록하고, load 완료 시 페이지 로드 시간도 1회 측정한다.
export function trackLandingView() {
    markAnalyticsScreen('intro');
    trackYunnEvent('landing_view', {
        utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
        device: getDeviceType()
    });
    window.addEventListener('load', () => {
        if (yunnAnalyticsState.currentScreen !== 'intro') return;
        const nav = performance.getEntriesByType('navigation')[0];
        const loadMs = nav ? Math.round(nav.loadEventEnd || nav.domContentLoadedEventEnd) : Math.round(performance.now());
        trackYunnEvent('landing_load_time', {
            load_ms: loadMs,
            device: getDeviceType(),
            network: getNetworkType()
        });
    }, { once: true });
}

// 랜딩 화면에서의 첫 상호작용(스크롤/클릭)을 1회만 기록한다 — 사용자 참여 시작 시점 측정.
export function trackFirstInteraction(interactionType) {
    if (yunnAnalyticsState.firstInteractionTracked) return;
    if (yunnAnalyticsState.currentScreen !== 'intro') return;
    yunnAnalyticsState.firstInteractionTracked = true;
    trackYunnEvent('landing_first_interaction', {
        interaction_type: interactionType,
        seconds_after_view: Math.round((Date.now() - yunnAnalyticsState.screenStartedAt) / 1000)
    });
}

// 설문 스텝 진입을 기록한다. pageView·선택지 노출 이벤트를 발행하고,
// 스텝 1(개인정보 고지·진행바)과 스텝 10(사진 개인정보 고지)은 전용 이벤트를 추가 발행한다.
export function trackSurveyStepView(step) {
    const stepKey = String(step);
    const config = STEP_ANALYTICS_CONFIG[stepKey];
    markAnalyticsScreen('survey', stepKey);
    if (config && config.pageView) {
        trackYunnEvent(config.pageView, {
            step_number: stepKey,
            selected_values: getCurrentStepSelectedValues(stepKey)
        });
    }
    emitStepOptionView(stepKey);
    if (stepKey === '1') {
        trackYunnEvent('privacy_notice_view', { component_id: 'user_info_secure_notice' });
        trackYunnEvent('progress_bar_view', { step_number: 1 });
    }
    if (stepKey === '10') {
        trackYunnEvent('skin_photo_privacy_info_view', { component_id: 'photo_privacy_notice' });
    }
}

// 사용자가 선택지를 고르거나 변경할 때 select/change 이벤트를 발행한다.
// 매핑 우선순위: 입력 이름(INPUT_ANALYTICS_CONFIG) → 스텝(STEP_ANALYTICS_CONFIG).
// 특수 처리:
//   - trigger: 다중 선택이므로 select/unselect + 선택 조합(combination) 별도 발행.
//   - skinType='NotSure': 상세 분석 플로우(3-1~3-4)로 분기하는 전용 이벤트 발행.
// @param previousValue 변경 전 값 (없으면 신규 선택)
// @param nextValue     선택된 값
// @param isSelected    선택(true)/해제(false) — trigger 다중 선택에서 의미 있음
export function trackInputSelection(input, previousValue, nextValue, isSelected = true) {
    const name = input.name;
    const step = String(window.currentStep !== undefined ? window.currentStep : '');
    const inputConfig = INPUT_ANALYTICS_CONFIG[name] || STEP_ANALYTICS_CONFIG[step];

    // trigger는 복수 선택 가능 — 개별 선택/해제 + 전체 조합을 함께 기록한다.
    if (name === 'trigger') {
        trackYunnEvent(isSelected ? 'skin_trigger_select' : 'skin_trigger_unselect', {
            [isSelected ? 'selected_trigger' : 'unselected_trigger']: nextValue
        });
        const selectedTriggerList = [...document.querySelectorAll('input[name="trigger"]:checked')].map(item => item.value);
        trackYunnEvent('skin_trigger_combination', {
            selected_trigger_list: selectedTriggerList
        });
        return;
    }

    if (!inputConfig) return;
    // 이벤트에 실어 보낼 속성 키 이름 (config에 없으면 기본값 사용).
    const selectedProperty = inputConfig.selectedProperty || 'selected_value';
    const previousProperty = inputConfig.previousProperty || 'previous_value';
    const newProperty = inputConfig.newProperty || 'new_value';

    // 기존 값에서 다른 값으로 바꾼 경우에만 change 이벤트 발행 (전/후 값 포함).
    if (previousValue && previousValue !== nextValue && inputConfig.change) {
        trackYunnEvent(inputConfig.change, {
            [previousProperty]: previousValue,
            [newProperty]: nextValue
        });
    }

    // 선택 자체(select) 이벤트 발행.
    if (inputConfig.select) {
        trackYunnEvent(inputConfig.select, {
            [selectedProperty]: nextValue
        });
    }

    // "잘 모르겠음" 선택 시 상세 피부 분석 플로우로 유도된 것을 별도 추적.
    if (name === 'skinType' && nextValue === 'NotSure') {
        trackYunnEvent('not_sure_click', { current_step: step });
        trackYunnEvent('not_sure_to_detailed_flow', { flow_id: 'detailed_skin_analysis' });
    }
}

// "다음" 버튼 클릭을 기록한다. 선택값·선택 개수·스텝1 필수입력 완료 여부 등을 함께 보낸다.
export function trackStepNextClick(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const stepKey = String(step);
    const config = STEP_ANALYTICS_CONFIG[stepKey];
    const selectedValues = getCurrentStepSelectedValues(stepKey);
    if (config && config.nextClick) {
        trackYunnEvent(config.nextClick, {
            ...selectedValues,
            selected_values: selectedValues,
            selected_trigger_count: Array.isArray(selectedValues.trigger) ? selectedValues.trigger.length : selectedValues.trigger ? 1 : 0,
            selected_count: Object.keys(selectedValues).length,
            // validateStepOne은 SurveyScreen이 window에 노출
            all_fields_completed: stepKey === '1' ? (typeof window.validateStepOne === 'function' ? window.validateStepOne() : undefined) : undefined,
            photo_uploaded: Boolean(window.uploadedSkinPhotoData)
        });
    }
}

// "뒤로" 버튼 클릭을 기록한다 — 어느 스텝에서 되돌아가는지 분석.
export function trackStepBackClick(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const stepKey = String(step);
    const config = STEP_ANALYTICS_CONFIG[stepKey];
    if (config && config.backClick) {
        trackYunnEvent(config.backClick, {
            current_step: stepKey,
            previous_page: stepKey
        });
    }
}

// ── 전역 옵저버 / 필드 추적 설정 ────────────────────────────────────────────────
// 스크롤·클릭·이탈을 감지하는 전역 리스너를 등록한다. 모든 페이지에서 1회 실행.
// 5초마다 friction 점검 인터벌도 가동해 스크롤 없이 머무는 경우도 감지한다.
export function setupAnalyticsObservers() {
    window.addEventListener('scroll', () => {
        trackFirstInteraction('scroll');
        emitScrollDepth();
    }, { passive: true });
    window.addEventListener('click', () => trackFirstInteraction('click'), { once: true, capture: true });
    window.addEventListener('beforeunload', () => {
        emitCurrentScreenTime('beforeunload');
        emitPageAbandon('beforeunload');
    });
    setInterval(emitFrictionIfNeeded, 5000);
}

// 이름·이메일·전화 입력 필드의 focus/blur를 추적한다 — 입력 시작/완료 및 도메인·길이 등 기록.
// blur 시 값이 비어 있으면 무시(미입력 이탈은 abandon에서 별도 처리).
export function setupFieldAnalytics() {
    const fieldConfig = {
        userName: { focus: 'name_input_focus', complete: 'name_input_complete', field: 'name' },
        userEmail: { focus: 'email_input_focus', complete: 'email_input_complete', field: 'email' },
        userWhatsApp: { focus: 'phone_input_focus', complete: 'phone_input_complete', field: 'phone' }
    };
    Object.entries(fieldConfig).forEach(([id, config]) => {
        const input = document.getElementById(id);
        if (!input) return;
        input.addEventListener('focus', () => {
            trackYunnEvent(config.focus, {
                field_name: config.field,
                country_code: config.field === 'phone' ? '+91' : undefined
            });
        });
        input.addEventListener('blur', () => {
            const value = input.value.trim();
            if (!value) return;
            const properties = {};
            if (config.field === 'name') properties.name_length = value.length;
            if (config.field === 'email') properties.email_domain = value.split('@')[1] || '';
            if (config.field === 'phone') {
                properties.country_code = '+91';
                properties.phone_length = value.length;
            }
            trackYunnEvent(config.complete, properties);
        });
    });
}

// 공통: 스크롤·클릭·이탈 추적은 모든 페이지에서 실행
setupAnalyticsObservers();

// Survey 전용 초기화: survey.html에서만 실행
if (window.location.pathname.includes('survey')) {
    trackLandingView();
    setupFieldAnalytics();
}

// ── Routine 이벤트 추적 ────────────────────────────────────────────
// routine.html(14일 루틴 트래킹) 전용 이벤트. CLAUDE.md 설계서의 7개 이벤트와 1:1 대응.
// AnalyticsManager 신규 생성 금지 규칙에 따라 모두 이 파일에 추가한다.

// 루틴 첫 시작 (KPI 2: 루틴 실행 의향).
export function trackRoutineStarted(skinType, concernType) {
    trackYunnEvent('routine_started', { day: 1, skinType, concernType });
}

// 개별 스텝 체크. stepName 필수 — "클렌저 vs 선크림" 완료율 비교 분석에 사용된다.
export function trackRoutineStepChecked(day, period, step, stepName) {
    trackYunnEvent('routine_step_checked', { day, period, step, stepName });
}

// 아침 루틴 전체 완료.
export function trackMorningCompleted(day) {
    trackYunnEvent('morning_completed', { day });
}

// 저녁 루틴 전체 완료.
export function trackEveningCompleted(day) {
    trackYunnEvent('evening_completed', { day });
}

// Before 사진 업로드 (항상 Day 1, KPI 3: 성과 체감 기록 시작).
export function trackBeforePhotoUploaded() {
    trackYunnEvent('before_photo_uploaded', { day: 1 });
}

// After 사진 업로드 (Day 14+).
export function trackAfterPhotoUploaded(day) {
    trackYunnEvent('after_photo_uploaded', { day });
}

// Before/After 비교 화면 조회 (KPI 3: 개선 체감). 누적 streak 일수 포함.
export function trackCompareViewed(day, streakDays) {
    trackYunnEvent('compare_viewed', { day, streakDays });
}
