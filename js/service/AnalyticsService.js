// AnalyticsService.js — GTM / 이벤트 추적

import {
    YUNN_ANALYTICS_STORAGE_KEY,
    YUNN_ANALYTICS_MAX_EVENTS,
    YUNN_ANALYTICS_ENDPOINT,
    YUNN_SCROLL_THRESHOLDS,
    YUNN_LONG_STAY_SECONDS
} from '../domain/AppConfig.js';
import { getItem, setItem, getSessionId } from '../repository/SessionRepository.js';

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

export const yunnAnalyticsState = {
    currentScreen: 'intro',
    currentStep: '',
    screenStartedAt: Date.now(),
    maxScrollByScreen: {},
    emittedScrollByScreen: {},
    viewedScreens: new Set(),
    frictionScreens: new Set(),
    firstInteractionTracked: false,
    lastVisibleResultSection: '',
    uploadStartedAt: 0,
    uploadAttemptCount: 0
};

function getTrafficSource() {
    const params = new URLSearchParams(window.location.search);
    return params.get('utm_source') || params.get('source') || document.referrer || 'direct';
}

export function getDeviceType() {
    if (window.matchMedia('(max-width: 767px)').matches) return 'mobile';
    if (window.matchMedia('(max-width: 1024px)').matches) return 'tablet';
    return 'desktop';
}

function getNetworkType() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection && (connection.effectiveType || connection.type) ? String(connection.effectiveType || connection.type) : 'unknown';
}

function readAnalyticsEvents() {
    try {
        return JSON.parse(getItem(YUNN_ANALYTICS_STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function persistAnalyticsEvent(eventPayload) {
    try {
        const events = readAnalyticsEvents();
        events.push(eventPayload);
        setItem(YUNN_ANALYTICS_STORAGE_KEY, JSON.stringify(events.slice(-YUNN_ANALYTICS_MAX_EVENTS)));
    } catch {
        // Analytics persistence is best-effort and must never block the user journey.
    }
}

export function trackYunnEvent(eventName, properties = {}) {
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

    persistAnalyticsEvent(eventPayload);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventPayload);

    if (YUNN_ANALYTICS_ENDPOINT && navigator.sendBeacon) {
        try {
            navigator.sendBeacon(YUNN_ANALYTICS_ENDPOINT, JSON.stringify(eventPayload));
        } catch {
            // Remote analytics must never block the UI.
        }
    }

    window.dispatchEvent(new CustomEvent('yunn:analytics', { detail: eventPayload }));
    return eventPayload;
}
window.trackYunnEvent = trackYunnEvent;

export function getScreenKey(step) {
    const s = step !== undefined ? step : yunnAnalyticsState.currentStep;
    return s ? `step_${s}` : yunnAnalyticsState.currentScreen;
}

export function getScrollPercent() {
    const doc = document.documentElement;
    const maxScrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
    return Math.min(100, Math.round((window.scrollY / maxScrollable) * 100));
}

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

export function getStepOptionList(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const activeStep = document.querySelector(`.survey-step[data-step="${String(step)}"]`);
    if (!activeStep) return [];
    return [...activeStep.querySelectorAll('input[type="radio"], input[type="checkbox"]')].map(input => input.value);
}

export function getStepCompletionStatus(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const selectedValues = getCurrentStepSelectedValues(step);
    return Object.keys(selectedValues).length ? 'partial_or_complete' : 'empty';
}

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

export function markAnalyticsScreen(screen, step = '') {
    yunnAnalyticsState.currentScreen = screen;
    yunnAnalyticsState.currentStep = step ? String(step) : '';
    yunnAnalyticsState.screenStartedAt = Date.now();
    yunnAnalyticsState.frictionScreens.delete(getScreenKey(step));
}

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

export function trackFirstInteraction(interactionType) {
    if (yunnAnalyticsState.firstInteractionTracked) return;
    if (yunnAnalyticsState.currentScreen !== 'intro') return;
    yunnAnalyticsState.firstInteractionTracked = true;
    trackYunnEvent('landing_first_interaction', {
        interaction_type: interactionType,
        seconds_after_view: Math.round((Date.now() - yunnAnalyticsState.screenStartedAt) / 1000)
    });
}

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

export function trackInputSelection(input, previousValue, nextValue, isSelected = true) {
    const name = input.name;
    const step = String(window.currentStep !== undefined ? window.currentStep : '');
    const inputConfig = INPUT_ANALYTICS_CONFIG[name] || STEP_ANALYTICS_CONFIG[step];

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
    const selectedProperty = inputConfig.selectedProperty || 'selected_value';
    const previousProperty = inputConfig.previousProperty || 'previous_value';
    const newProperty = inputConfig.newProperty || 'new_value';

    if (previousValue && previousValue !== nextValue && inputConfig.change) {
        trackYunnEvent(inputConfig.change, {
            [previousProperty]: previousValue,
            [newProperty]: nextValue
        });
    }

    if (inputConfig.select) {
        trackYunnEvent(inputConfig.select, {
            [selectedProperty]: nextValue
        });
    }

    if (name === 'skinType' && nextValue === 'NotSure') {
        trackYunnEvent('not_sure_click', { current_step: step });
        trackYunnEvent('not_sure_to_detailed_flow', { flow_id: 'detailed_skin_analysis' });
    }
}

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

trackLandingView();
setupAnalyticsObservers();
setupFieldAnalytics();
