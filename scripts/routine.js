// scripts/routine.js — 자동 생성 번들

// ── js/domain/AppConfig.js ──
// AppConfig.js — URL 상수, GTM ID, 엔드포인트

const YUNN_FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeaZgxM0-jGhdBJzJARLwAHCnyyvQaYfFw3QsP4iYq_5M5C3Q/viewform';
const YUNN_FEEDBACK_SESSION_ENTRY_ID = '';
const YUNN_FEEDBACK_VERIFY_URL = '';
const YUNN_FEEDBACK_RETURN_PARAM = 'returnFromSurvey';

const YUNN_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyVf7nkwjveU5rWg3iE363zg8wsWhXdba47-C0HKSfpjZYMJ62-p4tetm4RADGT11MNfQ/exec';

const YUNN_ANALYTICS_STORAGE_KEY = 'yunn_analytics_events';
const YUNN_ANALYTICS_MAX_EVENTS = 1000;
const YUNN_ANALYTICS_ENDPOINT = '';
const YUNN_SCROLL_THRESHOLDS = [25, 50, 75, 100];
const YUNN_LONG_STAY_SECONDS = 45;

const STORAGE_KEYS = {
    SESSION_ID:        'yunn_session_id',
    FEEDBACK_VERIFIED: 'yunn_feedback_verified',
    PENDING_RESULT:    'yunn_pending_result_data',
    ANALYTICS_EVENTS:  'yunn_analytics_events',
    CART_EVENTS:       'yunn_cart_events',
    BETA_EVENTS:       'yunn_beta_events',
    ROUTINE_START:     'yunn_routine_start',
    ROUTINE_CHECKS:    'yunn_routine_checks',
    PHOTO_BEFORE:      'yunn_photo_before',
    PHOTO_AFTER:       'yunn_photo_after',
};

const ROUTINE_CONFIG = {
    BEFORE_AFTER_UNLOCK_DAY: 14,
    MORNING_START_HOUR:      6,
    MORNING_END_HOUR:        10,
    EVENING_START_HOUR:      20,
    EVENING_END_HOUR:        23,
};

const YUNN_GTM_ID = 'GTM-P2NX3N5K';

// ── js/domain/RoutineDatabase.js ──
// RoutineDatabase.js — 성별·고민·피부타입별 상세 루틴 스텝
// 키 형식: "성별-고민타입-피부타입"  F/M · A(Acne)/P(Hyperpigmentation) · O/D/N/C
// 현재 결과 렌더링 미사용. 향후 gender 파라미터 연동 시 ResultService에서 import.

const ROUTINE_DATABASE = {
    "F-A-O": {
        title: "Female · Acne · Oily Skin",
        morning: [
            { name: "Mild gel cleanser (pH 5.5)", desc: "Cleanse with lukewarm water for 30 sec, no harsh scrubbing" },
            { name: "Salicylic acid 2% toner", desc: "Wipe entire face with cotton pad (max 5x/week)" },
            { name: "Niacinamide 10% serum", desc: "Apply thin layer across entire face" },
            { name: "Oil-free water-gel moisturizer", desc: "Pat gently until fully absorbed" },
            { name: "SPF50+ PA++++ sunscreen (oil-free)", desc: "Apply coin-sized amount 30 min before going out" }
        ],
        out: [{ name: "SPF50+ sun stick", desc: "Reapply every 2-3 hours" }],
        home: [
            { name: "Micellar water", desc: "Remove pollutants gently with cotton pad" },
            { name: "Calming toner mist", desc: "Spritz lightly across face" }
        ],
        evening: [
            { name: "Gel cleanser", desc: "Cleanse with lukewarm water" },
            { name: "Salicylic acid 2% toner", desc: "Focus on T-zone" },
            { name: "Niacinamide + Azelaic acid serum", desc: "Apply to entire face (intensive night treatment)" },
            { name: "Oil-free night gel", desc: "Finish with thin layer" }
        ]
    },
    "F-A-D": {
        title: "Female · Acne · Dry Skin",
        morning: [
            { name: "Hydrating mild foam cleanser", desc: "Gentle circular motions for 5-10 sec" },
            { name: "Hydrating toner", desc: "Hyaluronic Acid - Press gently into skin" },
            { name: "Niacinamide 5% serum", desc: "Apply to entire face (low concentration)" },
            { name: "Ceramide cream", desc: "Deep moisture" },
            { name: "SPF50+ hydrating sunscreen", desc: "Apply 30 min before going out" }
        ],
        out: [{ name: "Hydrating sun stick SPF50+", desc: "Reapply as needed" }],
        home: [{ name: "Mild cleansing water then sheet mask", desc: "Leave on 10-15 min" }],
        evening: [
            { name: "Cleansing balm then foam", desc: "Double cleanse" },
            { name: "Hydrating toner", desc: "Layer 2-3 times" },
            { name: "Benzoyl peroxide 2.5%", desc: "Spot treatment only on breakouts" },
            { name: "Ceramide + Peptide cream", desc: "Apply generously" }
        ]
    },
    "F-A-N": {
        title: "Female · Acne · Normal Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "30 sec gentle massage" },
            { name: "BHA toner", desc: "Apply all over (3-4x/week)" },
            { name: "Niacinamide serum", desc: "All over" },
            { name: "Light lotion moisturizer", desc: "Pat until absorbed" },
            { name: "SPF50+ sunscreen", desc: "Apply 30 min before" }
        ],
        out: [{ name: "Sun stick", desc: "Reapply every 2-3 hours" }],
        home: [{ name: "Micellar water", desc: "Light cleanse" }],
        evening: [
            { name: "Foam cleanser", desc: "Second cleanse" },
            { name: "Salicylic acid serum", desc: "Alternate with Retinol 0.025%" },
            { name: "Lotion moisturizer", desc: "Finish" }
        ]
    },
    "F-A-C": {
        title: "Female · Acne · Combination Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "Cleanse with lukewarm water" },
            { name: "BHA toner", desc: "Focus on T-zone" },
            { name: "Niacinamide serum", desc: "Balancing effect" },
            { name: "Gel-cream moisturizer", desc: "Zone-specific application" },
            { name: "SPF50+ sunscreen", desc: "Apply all over" }
        ],
        out: [{ name: "SPF50+ powder", desc: "Reapply on T-zone" }],
        home: [{ name: "Toning mist", desc: "Spritz and pat" }],
        evening: [
            { name: "Cleansing oil then foam", desc: "Double cleanse" },
            { name: "Niacinamide + Azelaic acid", desc: "All over" },
            { name: "Gel-cream", desc: "Finish" }
        ]
    },
    "F-P-O": {
        title: "Female · Hyperpigmentation · Oily Skin",
        morning: [
            { name: "Mild gel cleanser", desc: "Cleanse with lukewarm water" },
            { name: "Vitamin C serum (L-Ascorbic Acid 15%)", desc: "Apply thin layer (morning only)" },
            { name: "Niacinamide toner", desc: "Apply all over" },
            { name: "Oil-free water-gel moisturizer", desc: "Light application" },
            { name: "SPF50+ PA++++ sunscreen", desc: "Sun protection is #1 brightening step" }
        ],
        out: [{ name: "SPF50+", desc: "Reapply every 2-3 hours" }],
        home: [{ name: "Micellar water then mist", desc: "Remove pollutants + calm" }],
        evening: [
            { name: "Gel cleanser", desc: "Cleanse" },
            { name: "Alpha Arbutin + Niacinamide", desc: "Focus on pigmented areas" },
            { name: "Retinol 0.05%", desc: "Focus on dark spots (start 3x/week)" },
            { name: "Oil-free night gel", desc: "Finish" }
        ]
    },
    "F-P-D": {
        title: "Female · Hyperpigmentation · Dry Skin",
        morning: [
            { name: "Hydrating foam cleanser", desc: "Gentle cleanse" },
            { name: "Vitamin C serum 10%", desc: "All over (low concentration)" },
            { name: "Hyaluronic acid essence", desc: "Layer for moisture" },
            { name: "Ceramide cream", desc: "Apply generously" },
            { name: "SPF50+ hydrating sunscreen", desc: "Apply 30 min before" }
        ],
        out: [{ name: "Hydrating sun stick", desc: "Reapply" }],
        home: [{ name: "Cleansing water then sheet mask", desc: "Calm + hydrate" }],
        evening: [
            { name: "Cleansing balm then foam", desc: "Double cleanse" },
            { name: "Alpha Arbutin + Niacinamide", desc: "All over" },
            { name: "Retinol 0.025%", desc: "Low concentration" },
            { name: "Rich night cream", desc: "Apply generously" }
        ]
    },
    "F-P-N": {
        title: "Female · Hyperpigmentation · Normal Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "Cleanse" },
            { name: "Vitamin C serum 15-20%", desc: "All over" },
            { name: "Lotion moisturizer", desc: "All over" },
            { name: "SPF50+ PA++++ sunscreen", desc: "Apply generously" }
        ],
        out: [{ name: "Sun stick", desc: "Reapply" }],
        home: [{ name: "Micellar water", desc: "Light cleanse" }],
        evening: [
            { name: "Foam cleanser", desc: "Cleanse" },
            { name: "AHA toner", desc: "3x/week, exfoliate + improve pigmentation" },
            { name: "Retinol 0.05%", desc: "Every other night" },
            { name: "Lotion moisturizer", desc: "Finish" }
        ]
    },
    "F-P-C": {
        title: "Female · Hyperpigmentation · Combination Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "Cleanse" },
            { name: "Vitamin C serum", desc: "All over" },
            { name: "Gel-cream", desc: "Thin on T-zone, thicker on cheeks" },
            { name: "SPF50+ PA++++", desc: "Apply generously" }
        ],
        out: [{ name: "SPF50+ powder", desc: "Reapply on T-zone" }],
        home: [{ name: "Micellar water then mist", desc: "Calm + clean" }],
        evening: [
            { name: "Cleansing oil then foam", desc: "Double cleanse" },
            { name: "Alpha Arbutin serum", desc: "Focus on pigmented areas" },
            { name: "Retinol", desc: "Focus on cheeks" },
            { name: "Gel-cream", desc: "Finish" }
        ]
    },
    "M-A-O": {
        title: "Male · Acne · Oily Skin",
        morning: [
            { name: "Deep cleansing gel (Salicylic Acid)", desc: "Massage 30sec-1min" },
            { name: "Salicylic acid 2% toner", desc: "Wipe entire face" },
            { name: "Oil-free matte lotion", desc: "Light application" },
            { name: "SPF50+ oil-control sunscreen", desc: "Apply before going out" }
        ],
        out: [{ name: "Oil-control powder", desc: "Focus reapplication on T-zone" }],
        home: [{ name: "Micellar water", desc: "Remove pollutants" }],
        evening: [
            { name: "Salicylic acid foam", desc: "Thorough cleanse" },
            { name: "Niacinamide + Azelaic acid", desc: "All over" },
            { name: "Oil-free night gel", desc: "Finish" }
        ]
    },
    "M-A-D": {
        title: "Male · Acne · Dry Skin",
        morning: [
            { name: "Hydrating foam cleanser", desc: "Gentle cleanse" },
            { name: "Hydrating toner", desc: "All over" },
            { name: "Ceramide lotion", desc: "Apply for moisture" },
            { name: "SPF50+ hydrating sunscreen", desc: "Apply before going out" }
        ],
        out: [{ name: "Sun stick", desc: "Reapply" }],
        home: [{ name: "Cleansing water", desc: "Gentle cleanse" }],
        evening: [
            { name: "Cleansing balm then foam", desc: "Double cleanse" },
            { name: "Benzoyl peroxide 2.5%", desc: "Spot treatment" },
            { name: "Ceramide cream", desc: "Apply generously" }
        ]
    },
    "M-A-N": {
        title: "Male · Acne · Normal Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "Cleanse" },
            { name: "BHA toner", desc: "All over (3-4x/week)" },
            { name: "Lotion moisturizer", desc: "Pat until absorbed" },
            { name: "SPF50+ sunscreen", desc: "Apply before going out" }
        ],
        out: [{ name: "Sun stick", desc: "Reapply" }],
        home: [{ name: "Micellar water", desc: "Light cleanse" }],
        evening: [
            { name: "Foam cleanser", desc: "Cleanse" },
            { name: "Retinol 0.025% or Salicylic acid", desc: "Alternate (2-3x/week)" },
            { name: "Lotion", desc: "Finish" }
        ]
    },
    "M-A-C": {
        title: "Male · Acne · Combination Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "Cleanse" },
            { name: "BHA toner", desc: "Focus on T-zone" },
            { name: "Gel moisturizer", desc: "Thin on T-zone, thicker on cheeks" },
            { name: "SPF50+", desc: "All over" }
        ],
        out: [{ name: "SPF50+ powder", desc: "Reapply" }],
        home: [{ name: "Toning mist", desc: "Calm skin" }],
        evening: [
            { name: "Cleansing oil then foam", desc: "Double cleanse" },
            { name: "Azelaic acid serum", desc: "All over" },
            { name: "Gel-cream", desc: "Finish" }
        ]
    },
    "M-P-O": {
        title: "Male · Hyperpigmentation · Oily Skin",
        morning: [
            { name: "Deep cleansing gel", desc: "Cleanse" },
            { name: "Vitamin C serum 15%", desc: "All over (morning only)" },
            { name: "Oil-free matte lotion", desc: "Light application" },
            { name: "SPF50+ oil-control sunscreen", desc: "Apply generously" }
        ],
        out: [{ name: "Oil-control sun stick", desc: "Reapply" }],
        home: [{ name: "Micellar water", desc: "Remove pollutants" }],
        evening: [
            { name: "Gel cleanser", desc: "Cleanse" },
            { name: "Niacinamide + Alpha Arbutin", desc: "Focus application" },
            { name: "Retinol 0.05%", desc: "Focus on dark spots" },
            { name: "Oil-free night gel", desc: "Finish" }
        ]
    },
    "M-P-D": {
        title: "Male · Hyperpigmentation · Dry Skin",
        morning: [
            { name: "Hydrating foam cleanser", desc: "Gentle cleanse" },
            { name: "Vitamin C 10% serum", desc: "All over" },
            { name: "Ceramide cream", desc: "Apply generously" },
            { name: "SPF50+ hydrating sunscreen", desc: "Apply before" }
        ],
        out: [{ name: "Sun stick", desc: "Reapply" }],
        home: [{ name: "Sheet mask", desc: "Calm for 10-15 min" }],
        evening: [
            { name: "Cleansing balm then foam", desc: "Double cleanse" },
            { name: "Alpha Arbutin serum", desc: "All over" },
            { name: "Retinol 0.025%", desc: "Small amount" },
            { name: "Rich night cream", desc: "Apply generously" }
        ]
    },
    "M-P-N": {
        title: "Male · Hyperpigmentation · Normal Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "Cleanse" },
            { name: "Vitamin C serum 15-20%", desc: "All over" },
            { name: "SPF50+ PA++++", desc: "Apply generously" }
        ],
        out: [{ name: "Sun stick", desc: "Reapply" }],
        home: [{ name: "Micellar water", desc: "Light cleanse" }],
        evening: [
            { name: "Foam cleanser", desc: "Cleanse" },
            { name: "AHA toner", desc: "3x/week, improve pigmentation" },
            { name: "Retinol 0.05%", desc: "Every other night" },
            { name: "Lotion", desc: "Finish" }
        ]
    },
    "M-P-C": {
        title: "Male · Hyperpigmentation · Combination Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "Cleanse" },
            { name: "Vitamin C serum", desc: "All over" },
            { name: "SPF50+ PA++++", desc: "Apply generously" }
        ],
        out: [{ name: "SPF50+ powder", desc: "Reapply" }],
        home: [{ name: "Micellar water then mist", desc: "Cleanse + calm" }],
        evening: [
            { name: "Cleansing oil then foam", desc: "Double cleanse" },
            { name: "Alpha Arbutin + Vitamin C", desc: "Focus on pigmented areas" },
            { name: "Retinol", desc: "Focus on cheeks" },
            { name: "Gel-cream", desc: "Finish" }
        ]
    }
};

// ── js/repository/SessionRepository.js ──
// SessionRepository.js — localStorage / 세션 ID 관리


const yunnMemoryStorage = {};
const yunnStorage = (() => {
    try {
        if (window.localStorage) return window.localStorage;
    } catch {
        // Some embedded or privacy-restricted browsers block yunnStorage.
    }
    return {
        getItem(key) {
            return Object.prototype.hasOwnProperty.call(yunnMemoryStorage, key) ? yunnMemoryStorage[key] : null;
        },
        setItem(key, value) {
            yunnMemoryStorage[key] = String(value);
        },
        removeItem(key) {
            delete yunnMemoryStorage[key];
        }
    };
})();

function getItem(key)        { return yunnStorage.getItem(key); }
function setItem(key, value) { yunnStorage.setItem(key, String(value)); }
function removeItem(key)     { yunnStorage.removeItem(key); }

function getSessionId() {
    let sessionId = yunnStorage.getItem(STORAGE_KEYS.SESSION_ID);
    if (!sessionId) {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            sessionId = `yunn_${crypto.randomUUID()}`;
        } else {
            sessionId = `yunn_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        }
        yunnStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
    }
    return sessionId;
}

// 원본 함수명 하위 호환
const getYunnSessionId = getSessionId;

// ── js/repository/RoutineRepository.js ──
// RoutineRepository.js — 루틴 데이터 접근 계층
// SessionRepository를 통해서만 저장/조회한다. localStorage 직접 접근 금지.


class RoutineRepository {
    getRoutineStart() {
        return getItem(STORAGE_KEYS.ROUTINE_START);
    }

    saveRoutineStart(dateStr) {
        setItem(STORAGE_KEYS.ROUTINE_START, dateStr);
    }

    getChecks() {
        try {
            return JSON.parse(getItem(STORAGE_KEYS.ROUTINE_CHECKS) || '{}');
        } catch {
            return {};
        }
    }

    saveChecks(checks) {
        setItem(STORAGE_KEYS.ROUTINE_CHECKS, JSON.stringify(checks));
    }

    getBeforePhoto() {
        try {
            return JSON.parse(getItem(STORAGE_KEYS.PHOTO_BEFORE) || 'null');
        } catch {
            return null;
        }
    }

    saveBeforePhoto(photo) {
        setItem(STORAGE_KEYS.PHOTO_BEFORE, JSON.stringify(photo));
    }

    getAfterPhoto() {
        try {
            return JSON.parse(getItem(STORAGE_KEYS.PHOTO_AFTER) || 'null');
        } catch {
            return null;
        }
    }

    saveAfterPhoto(photo) {
        setItem(STORAGE_KEYS.PHOTO_AFTER, JSON.stringify(photo));
    }
}

// ── js/service/AnalyticsService.js ──
// AnalyticsService.js — GTM / 이벤트 추적


const STEP_ANALYTICS_CONFIG = {
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

const INPUT_ANALYTICS_CONFIG = {
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

const yunnAnalyticsState = {
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

function getDeviceType() {
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

function trackYunnEvent(eventName, properties = {}) {
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

function getScreenKey(step) {
    const s = step !== undefined ? step : yunnAnalyticsState.currentStep;
    return s ? `step_${s}` : yunnAnalyticsState.currentScreen;
}

function getScrollPercent() {
    const doc = document.documentElement;
    const maxScrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
    return Math.min(100, Math.round((window.scrollY / maxScrollable) * 100));
}

function getCurrentStepSelectedValues(step) {
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

function getStepOptionList(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const activeStep = document.querySelector(`.survey-step[data-step="${String(step)}"]`);
    if (!activeStep) return [];
    return [...activeStep.querySelectorAll('input[type="radio"], input[type="checkbox"]')].map(input => input.value);
}

function getStepCompletionStatus(step) {
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

function markAnalyticsScreen(screen, step = '') {
    yunnAnalyticsState.currentScreen = screen;
    yunnAnalyticsState.currentStep = step ? String(step) : '';
    yunnAnalyticsState.screenStartedAt = Date.now();
    yunnAnalyticsState.frictionScreens.delete(getScreenKey(step));
}

function emitCurrentScreenTime(reason = 'screen_leave') {
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

function emitPageAbandon(reason = 'page_exit') {
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

function trackLandingView() {
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

function trackFirstInteraction(interactionType) {
    if (yunnAnalyticsState.firstInteractionTracked) return;
    if (yunnAnalyticsState.currentScreen !== 'intro') return;
    yunnAnalyticsState.firstInteractionTracked = true;
    trackYunnEvent('landing_first_interaction', {
        interaction_type: interactionType,
        seconds_after_view: Math.round((Date.now() - yunnAnalyticsState.screenStartedAt) / 1000)
    });
}

function trackSurveyStepView(step) {
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

function trackInputSelection(input, previousValue, nextValue, isSelected = true) {
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

function trackStepNextClick(step) {
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

function trackStepBackClick(step) {
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

function setupAnalyticsObservers() {
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

function setupFieldAnalytics() {
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

function trackRoutineStarted(skinType, concernType) {
    trackYunnEvent('routine_started', { day: 1, skinType, concernType });
}

function trackRoutineStepChecked(day, period, step, stepName) {
    trackYunnEvent('routine_step_checked', { day, period, step, stepName });
}

function trackMorningCompleted(day) {
    trackYunnEvent('morning_completed', { day });
}

function trackEveningCompleted(day) {
    trackYunnEvent('evening_completed', { day });
}

function trackBeforePhotoUploaded() {
    trackYunnEvent('before_photo_uploaded', { day: 1 });
}

function trackAfterPhotoUploaded(day) {
    trackYunnEvent('after_photo_uploaded', { day });
}

function trackCompareViewed(day, streakDays) {
    trackYunnEvent('compare_viewed', { day, streakDays });
}

// ── js/domain/RoutineDomain.js ──
// RoutineDomain.js — 루틴 비즈니스 로직
// DOM 조작, 저장, GTM 전송 금지. 순수 계산 로직만 담당.


class RoutineDomain {
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

// ── js/ui/ReminderModal.js ──
// ReminderModal.js — 시간 기반 루틴 알림 모달


const SESSION_KEY = 'yunn_reminder_dismissed';

class ReminderModal {
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

// ── js/ui/RoutineScreen.js ──
// RoutineScreen.js — 루틴 메인 화면 렌더링
// 비즈니스 로직 처리 금지. 화면 렌더링과 이벤트 바인딩만 담당.


class RoutineScreen {
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

// ── js/ui/PhotoManager.js ──
// PhotoManager.js — 사진 업로드, 압축, Before/After 비교


const COMPRESS_QUALITY  = 0.5;
const COMPRESS_MAX_WIDTH = 1080;

class PhotoManager {
    #repo;
    #domain;
    #onBeforeSaved;
    #onAfterSaved;

    setDeps(repo, domain) {
        this.#repo   = repo;
        this.#domain = domain;
    }

    init() {
        document.getElementById('before-photo-input')
            ?.addEventListener('change', e => this.#handleBeforeUpload(e));
        document.getElementById('after-photo-input')
            ?.addEventListener('change', e => this.#handleAfterUpload(e));
    }

    async #compressImage(file) {
        return new Promise(resolve => {
            const reader  = new FileReader();
            reader.onload = e => {
                const img  = new Image();
                img.onload = () => {
                    const scale  = Math.min(1, COMPRESS_MAX_WIDTH / img.width);
                    const canvas = document.createElement('canvas');
                    canvas.width  = Math.round(img.width  * scale);
                    canvas.height = Math.round(img.height * scale);
                    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', COMPRESS_QUALITY));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    async #handleBeforeUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const dataUrl = await this.#compressImage(file);
        const photo   = { dataUrl, date: new Date().toISOString().slice(0, 10) };
        this.#repo.saveBeforePhoto(photo);
        trackBeforePhotoUploaded();

        const preview = document.getElementById('before-photo-preview');
        if (preview) { preview.src = dataUrl; preview.classList.add('visible'); }

        this.#onBeforeSaved?.();
    }

    async #handleAfterUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const dataUrl = await this.#compressImage(file);
        const photo   = { dataUrl, date: new Date().toISOString().slice(0, 10) };
        this.#repo.saveAfterPhoto(photo);
        trackAfterPhotoUploaded(this.#domain.getDay());

        const preview = document.getElementById('after-photo-preview');
        if (preview) { preview.src = dataUrl; preview.classList.add('visible'); }

        this.#onAfterSaved?.();
    }

    renderCompare() {
        markAnalyticsScreen('compare');
        const before = this.#repo.getBeforePhoto();
        const after  = this.#repo.getAfterPhoto();

        const beforeImg  = document.getElementById('compare-before-img');
        const afterImg   = document.getElementById('compare-after-img');
        const beforeDate = document.getElementById('compare-before-date');
        const afterDate  = document.getElementById('compare-after-date');

        if (beforeImg && before)  { beforeImg.src = before.dataUrl; }
        if (afterImg  && after)   { afterImg.src  = after.dataUrl; }
        if (beforeDate && before) beforeDate.textContent = this.#formatDate(before.date);
        if (afterDate  && after)  afterDate.textContent  = this.#formatDate(after.date);

        trackCompareViewed(this.#domain.getDay(), this.#domain.getStreak());
    }

    hasBeforePhoto() {
        return Boolean(this.#repo.getBeforePhoto());
    }

    hasAfterPhoto() {
        return Boolean(this.#repo.getAfterPhoto());
    }

    onBeforeSaved(fn) { this.#onBeforeSaved = fn; }
    onAfterSaved(fn)  { this.#onAfterSaved  = fn; }

    #formatDate(dateStr) {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
}

// ── js/controller/AppController.js ──
// AppController.js — 앱 초기화, 의존성 연결, 화면 라우팅
// 비즈니스 로직 처리 금지. 상태 확인 후 화면 전환만 담당.


class AppController {
    #domain;
    #repo;
    #routineScreen;
    #reminderModal;
    #photoManager;
    #result = null;

    setDeps(domain, repo, routineScreen, reminderModal, photoManager) {
        this.#domain        = domain;
        this.#repo          = repo;
        this.#routineScreen = routineScreen;
        this.#reminderModal = reminderModal;
        this.#photoManager  = photoManager;
    }

    init() {
        this.#result = this.#loadResult();
        this.#reminderModal.init();
        this.#photoManager.init();
        this.#photoManager.onBeforeSaved(() => this.#goToRoutineScreen());
        this.#photoManager.onAfterSaved(()  => this.#goToCompareScreen());

        this.#bindStartButton();
        this.#bindAfterPhotoBanner();
        this.#route();
    }

    #loadResult() {
        try {
            return JSON.parse(localStorage.getItem('yunn_pending_result_data') || 'null');
        } catch {
            return null;
        }
    }

    #route() {
        if (!this.#result?.skinType) {
            this.#showScreen('guard-screen');
            return;
        }
        if (!this.#domain.isStarted()) {
            this.#showScreen('start-screen');
            return;
        }
        if (this.#domain.isBeforeAfterUnlocked() && this.#photoManager.hasAfterPhoto()) {
            this.#goToCompareScreen();
            return;
        }
        this.#goToRoutineScreen();
    }

    #showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id)?.classList.add('active');
    }

    #goToRoutineScreen() {
        this.#showScreen('routine-screen');
        this.#routineScreen.init(this.#result);
        if (this.#reminderModal.shouldShow()) {
            this.#reminderModal.show();
        }
    }

    #goToCompareScreen() {
        this.#showScreen('compare-screen');
        this.#photoManager.renderCompare();
    }

    #bindStartButton() {
        document.getElementById('btn-start-routine')?.addEventListener('click', () => {
            this.#domain.startRoutine();
            trackRoutineStarted(this.#result?.skinType, this.#result?.concernType);
            this.#showScreen('routine-screen');
            this.#routineScreen.init(this.#result);
            if (this.#reminderModal.shouldShow()) {
                this.#reminderModal.show();
            }
        });
    }

    #bindAfterPhotoBanner() {
        document.getElementById('after-photo-banner-btn')
            ?.addEventListener('click', () => {
                document.getElementById('after-photo-input')?.click();
            });
    }
}

// ── js/routine.js ──
// routine.js — routine.html 진입점: 인스턴스 생성 및 의존성 주입


const repo    = new RoutineRepository();
const domain  = new RoutineDomain(repo);
const screen  = new RoutineScreen();
const modal   = new ReminderModal();
const photos  = new PhotoManager();
const app     = new AppController();

screen.setDeps(domain);
photos.setDeps(repo, domain);
app.setDeps(domain, repo, screen, modal, photos);

document.addEventListener('DOMContentLoaded', () => app.init());

