// scripts/survey.js — 자동 생성 번들

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

// ── js/domain/SurveyAnswer.js ──
// SurveyAnswer.js — 각 스텝 선택지 정의

const ALLOWED_INDIAN_EMAIL_DOMAINS = [
    'gmail.com',
    'outlook.com',
    'yahoo.com',
    'yahoo.in',
    'hotmail.com',
    'rediffmail.com',
    'icloud.com',
];

const PHONE_REGEX = /^[6-9]\d{9}$/;

const GENDER_OPTIONS    = ['Female', 'Male'];
const AGE_OPTIONS       = ['Under 18', '18–24', '25–30', '31–40', '40+'];
const SKIN_TYPE_OPTIONS = ['Oily', 'Dry', 'Combination', 'Normal', 'Not Sure'];
const CONCERN_OPTIONS   = ['Acne', 'Acne marks', 'Pigmentation', 'Uneven skin tone'];
const TRIGGER_OPTIONS   = ['Sun', 'Stress', 'Period', 'Sleep', 'New skincare', 'Nothing specific'];
const SENSITIVITY_OPTIONS = [
    'Rarely reacts', 'Sometimes reacts', 'Often reacts', 'Very sensitive',
];
const OUTDOOR_OPTIONS   = ['Less than 1 hour', '1–3 hours', '3–5 hours', '5+ hours'];
const SUNSCREEN_OPTIONS = ['Every day', 'Most days', 'Occasionally', 'Rarely or never'];
const SLEEP_OPTIONS     = ['Less than 5 hours', '5–6 hours', '7–8 hours', '9+ hours'];
const STRESS_OPTIONS    = ['Low', 'Moderate', 'High', 'Very high'];
const ROUTINE_LEVEL_OPTIONS = ['Nothing', 'Wash only', 'Basic', 'Multi-step'];

// ── js/domain/SkinType.js ──
// SkinType.js — 피부 타입 정의 및 추론 규칙

const SKIN_TYPES = ['Oily', 'Dry', 'Combination', 'Normal', 'Not Sure'];

const SKIN_HELPER_STEPS = ['3-1', '3-2', '3-3', '3-4'];

const REQUIRED_STEP_INPUT_GROUPS = {
    '3':   ['skinType'],
    '3-1': ['skinHelperCleanse'],
    '3-2': ['skinHelperAfterHours'],
    '3-3': ['skinHelperDay'],
    '3-4': ['skinHelperTexture'],
    '4':   ['concerns'],
    '5':   ['trigger'],
    '6':   ['sensitivity'],
    '7':   ['outdoor', 'sunscreen'],
    '8':   ['sleep', 'stress'],
    '9':   ['routineLevel'],
};

const SKIN_INFERENCE_RULES = {
    DRY_MAX:         1.8,
    OILY_MIN:        4.2,
    COMBINATION_MIN: 2.6,
    T_ZONE_VALUE:    3,
};

// ── js/domain/RoutineConfig.js ──
// RoutineConfig.js — 결과 화면 에셋·카피·추천 설정·상품 데이터
// ROUTINE_DATABASE(상세 루틴 스텝)는 RoutineDatabase.js에서 관리. 이 파일은 import하지 않음.

const RESULT_ASSETS = {
    userFallbackFemale: '../assets/image/Woman_model_YUNN.png',
    userFallbackMale:   '../assets/image/Man_model_YUNN.png',
    cleanser:           '../assets/image/Facewash_YUNN.png',
    serum:              '../assets/image/Serum_YUNN.png',
    sunscreen:          '../assets/image/Sunscreen_YUNN.png',
    moisturiser:        '../assets/image/Moisturiser_YUNN.png',
    cleanserCard:       '../assets/image/Facewash_top_selling.png',
    serumCard:          '../assets/image/Serum_top_selling.png',
    sunscreenCard:      '../assets/image/Sunscreen_YUNN.png',
    creamCard:          '../assets/image/Moisturiser_top_selling.png'
};

const RESULT_COPY_VARIANTS = {
    Acne: {
        focus: 'calmer pores and breakout control',
        typeSuffix: 'Clear Balance type',
        concernKeyword: 'Breakouts',
        summary: 'Your skin is asking for calm, consistent care. Delhi heat, pollution, and daily stress may be triggering congestion, so barrier-friendly acne care matters most right now.',
        serumName: 'Brightening Serum',
        serumTag: 'Treat',
        serumDesc: 'Helps improve uneven skin tone and prevents pigmentation.',
        serumWhy: 'Niacinamide and botanical extracts help support a more even-looking complexion while keeping the skin hydrated.'
    },
    Marks: {
        focus: 'post-acne marks and tone recovery',
        typeSuffix: 'Post-Acne Glow type',
        concernKeyword: 'Acne Marks',
        summary: 'Your skin may be healing from previous breakouts. The priority is to protect your barrier while supporting a more even, brighter-looking tone.',
        serumName: 'Tone Repair Serum',
        serumTag: 'Repair',
        serumDesc: 'Targets visible marks while supporting hydrated, resilient skin.',
        serumWhy: 'Niacinamide and brightening botanicals help reduce the look of post-breakout marks over time.'
    },
    Pigmentation: {
        focus: 'dark spots and UV defense',
        typeSuffix: 'Bright Shield type',
        concernKeyword: 'Dark Spots',
        summary: 'Your skin needs steady brightening support and stronger daily UV protection. Pollution and sun exposure can make spots look more visible without consistent care.',
        serumName: 'Brightening Serum',
        serumTag: 'Brighten',
        serumDesc: 'Helps improve dark spots and supports a clearer-looking complexion.',
        serumWhy: 'Brightening actives and antioxidants help support tone correction while sunscreen protects progress.'
    },
    Tone: {
        focus: 'dullness and uneven tone',
        typeSuffix: 'Even Glow type',
        concernKeyword: 'Uneven Tone',
        summary: 'Your skin tone looks like it needs balance and radiance support. Gentle exfoliation, hydration, and daily protection can help your complexion look more even.',
        serumName: 'Even Tone Essence',
        serumTag: 'Glow',
        serumDesc: 'Supports radiance and helps improve the look of patchy, uneven tone.',
        serumWhy: 'Hydrating and tone-supporting ingredients help skin look smoother and more balanced.'
    }
};

const RESULT_SKIN_VARIANTS = {
    Oily: {
        typePrefix: 'Oil-Control',
        keyword: 'Oily',
        balanceAdjust: { hydration: -5, barrier: -4, oil: -12, calmness: -3 },
        cleanserDesc: 'Removes excess oil and impurities without stripping your skin barrier.',
        cleanserWhy: 'Helps keep pores clear and oil balanced, which may support a calmer complexion for oily and sensitive skin.',
        moisturiserName: 'Light Gel Moisturiser'
    },
    Dry: {
        typePrefix: 'Hydration',
        keyword: 'Dry',
        balanceAdjust: { hydration: -16, barrier: -10, oil: 8, calmness: -4 },
        cleanserDesc: 'Cleanses gently while helping your skin avoid that tight after-wash feeling.',
        cleanserWhy: 'A mild cleanser helps preserve moisture so dry skin can recover without extra irritation.',
        moisturiserName: 'Ceramide Moisture Cream'
    },
    Combination: {
        typePrefix: 'Dual-Zone',
        keyword: 'Combination',
        balanceAdjust: { hydration: -8, barrier: -5, oil: -7, calmness: -2 },
        cleanserDesc: 'Balances oil-prone areas while staying gentle on drier cheeks.',
        cleanserWhy: 'A balanced cleanser helps manage the T-zone without over-cleansing the rest of your face.',
        moisturiserName: 'Balancing Gel Cream'
    },
    Normal: {
        typePrefix: 'Sensitive Glow',
        keyword: 'Balanced',
        balanceAdjust: { hydration: 2, barrier: 4, oil: 2, calmness: 2 },
        cleanserDesc: 'Keeps your skin clean and comfortable without disrupting your natural balance.',
        cleanserWhy: 'A gentle cleanser supports consistency while keeping already balanced skin steady.',
        moisturiserName: 'Daily Balance Lotion'
    }
};

const RESULT_RECOMMENDATION_CONFIG = {};
Object.keys(RESULT_SKIN_VARIANTS).forEach((skinType) => {
    Object.keys(RESULT_COPY_VARIANTS).forEach((concernType) => {
        const skin = RESULT_SKIN_VARIANTS[skinType];
        const concern = RESULT_COPY_VARIANTS[concernType];
        RESULT_RECOMMENDATION_CONFIG[`${skinType}|${concernType}`] = {
            skinTypeName: `${skin.typePrefix} ${concern.typeSuffix}`,
            keywords: [skin.keyword, concern.concernKeyword, skinType === 'Normal' ? 'Glow' : 'Barrier Stress'],
            summary: concern.summary,
            focus: concern.focus,
            balanceAdjust: skin.balanceAdjust,
            routines: {
                morning: [
                    {
                        name: 'Gentle Cleanser',
                        tag: 'Cleanse',
                        image: RESULT_ASSETS.cleanser,
                        description: skin.cleanserDesc,
                        why: skin.cleanserWhy,
                        how: 'Lather a pea-sized amount with water. Massage gently for 30-40 seconds, then rinse thoroughly with lukewarm water.',
                        tip: 'Over-cleansing can weaken your barrier. Once in the morning is enough.'
                    },
                    {
                        name: concern.serumName,
                        tag: concern.serumTag,
                        image: RESULT_ASSETS.serum,
                        description: concern.serumDesc,
                        why: concern.serumWhy,
                        how: 'Apply 2-3 drops on your face and gently pat until fully absorbed.',
                        tip: concernType === 'Pigmentation' ? 'Use consistently with sunscreen to protect brightening progress.' : 'Focus on areas that need the most support.'
                    },
                    {
                        name: 'Daily Sunscreen',
                        tag: 'Protect',
                        image: RESULT_ASSETS.sunscreen,
                        description: 'Protect against UV rays and prevents dark spots and early aging.',
                        why: 'Daily UV protection helps prevent pigmentation from getting darker and supports overall skin health.',
                        how: 'Apply generously as the last step of your skincare routine. Reapply every 2-3 hours when outdoors.',
                        tip: 'Sunscreen is your best anti-aging and brightening step.'
                    }
                ],
                evening: [
                    {
                        name: 'Gentle Cleanser',
                        tag: 'Cleanse',
                        image: RESULT_ASSETS.cleanser,
                        description: skin.cleanserDesc,
                        why: 'Evening cleansing removes sunscreen, sweat, and pollution so your treatment products can work better.',
                        how: 'Massage gently with lukewarm water for 40-60 seconds, then rinse without scrubbing.',
                        tip: 'If you wore heavy sunscreen, cleanse twice with the same gentle pressure.'
                    },
                    {
                        name: concern.serumName,
                        tag: 'Repair',
                        image: RESULT_ASSETS.serum,
                        description: concern.serumDesc,
                        why: concern.serumWhy,
                        how: 'Apply a thin layer after cleansing. Start slowly if your skin feels sensitive.',
                        tip: 'Night care is where repair compounds quietly. Keep it consistent.'
                    },
                    {
                        name: skin.moisturiserName,
                        tag: 'Seal',
                        image: RESULT_ASSETS.moisturiser,
                        description: 'Locks in hydration and supports your skin barrier overnight.',
                        why: 'Moisturising helps reduce irritation and keeps your routine sustainable.',
                        how: 'Apply a comfortable layer as the final evening step.',
                        tip: 'A steady barrier often improves how your skin responds to active ingredients.'
                    }
                ]
            }
        };
    });
});

const RESULT_TYPE_PROFILES = {
    'Oily|Acne': {
        skinTypeName: 'Oil Clear',
        keywords: ['Oily', 'Acne-prone', 'Sebum Control'],
        focus: 'consistent oil control',
        summary: "Your skin tends to produce more oil than it needs — and in India's heat and humidity, that builds up fast. Lightweight hydration and consistent oil control can help keep your skin clear, calm, and balanced through the day."
    },
    'Oily|Marks': {
        skinTypeName: 'Glow Restore',
        keywords: ['Oily', 'Post-acne', 'Repair'],
        focus: 'gentle brightening care',
        summary: 'Your skin is still recovering from past breakouts — and UV exposure can make those marks linger longer than expected. With steady barrier support and gentle brightening care, your skin tone can gradually become clearer and more even.'
    },
    'Oily|Pigmentation': {
        skinTypeName: 'Radiance Shield',
        keywords: ['Oily', 'Pigmentation', 'UV Defense'],
        focus: 'Consistent sunscreen and brightening care',
        summary: 'Your skin may be more reactive to pigmentation triggers — and daily UV exposure makes that harder to manage without the right protection. Consistent sunscreen and brightening care can help prevent dark spots from deepening and keep your natural radiance visible.'
    },
    'Oily|Tone': {
        skinTypeName: 'Glow Balance',
        keywords: ['Oily', 'Uneven Tone', 'Glow'],
        focus: 'Lightweight hydration and tone-balancing care',
        summary: 'Your skin is producing more oil than it needs, and that imbalance is showing up as shine and uneven tone. Lightweight hydration and tone-balancing care can help your skin find its natural rhythm — and bring back its glow.'
    },
    'Dry|Acne': {
        skinTypeName: 'Calm Repair',
        keywords: ['Dry', 'Breakout', 'Barrier'],
        focus: 'Calming hydration and barrier-focused care',
        summary: 'Your skin is dealing with dryness and breakouts at the same time — which happens when the skin barrier becomes weakened and more reactive. Calming hydration and barrier-focused care can help reduce irritation and bring your skin back to a more comfortable balance.'
    },
    'Dry|Marks': {
        skinTypeName: 'Barrier Glow',
        keywords: ['Dry', 'Repair', 'Barrier Stress'],
        focus: 'Rebuilding your skin barrier',
        summary: 'Your skin is in recovery mode — and without enough moisture, post-acne marks tend to stay more visible and healing feels slower. Rebuilding your skin barrier with gentle, nourishing care can help speed up recovery and bring back a healthy glow over time.'
    },
    'Dry|Pigmentation': {
        skinTypeName: 'Soft Glow',
        keywords: ['Dry', 'Pigmentation', 'Dehydrated'],
        focus: 'Deep hydration and consistent brightening care',
        summary: 'Your skin is low on moisture — and when hydration drops, dark spots and uneven areas tend to look more visible than they actually are. Deep hydration and consistent brightening care can help even out your tone and bring your natural glow back to the surface.'
    },
    'Dry|Tone': {
        skinTypeName: 'Soft Bright',
        keywords: ['Dry', 'Hydration', 'Even Tone'],
        focus: 'moisture levels are well maintained',
        summary: 'Your skin has natural glow — it just needs more hydration to show it. When moisture levels are well maintained, skin looks noticeably smoother, more even, and more radiant.'
    },
    'Combination|Acne': {
        skinTypeName: 'Clear Harmony',
        keywords: ['Combination', 'Acne-prone', 'Oil Balance'],
        focus: 'Balanced oil control and lightweight hydration',
        summary: 'Your skin runs oily in some areas and feels tight or irritated in others — making breakouts harder to predict and manage. Balanced oil control and lightweight hydration working together can help your skin feel more settled and consistently clearer.'
    },
    'Combination|Marks': {
        skinTypeName: 'Clear Harmony',
        keywords: ['Combination', 'Acne-prone', 'Oil Balance'],
        focus: 'Balanced oil control and lightweight hydration',
        summary: 'Your skin runs oily in some areas and feels tight or irritated in others — making breakouts harder to predict and manage. Balanced oil control and lightweight hydration working together can help your skin feel more settled and consistently clearer.'
    },
    'Combination|Pigmentation': {
        skinTypeName: 'Glow Harmony',
        keywords: ['Combination', 'Uneven Tone', 'Radiance'],
        focus: 'Tone-balancing care, lightweight hydration, and daily sun protection',
        summary: "Your skin is dealing with both oil imbalance and uneven tone — and UV exposure makes it harder for your skin to stay bright and balanced. Tone-balancing care, lightweight hydration, and daily sun protection can work together to bring your skin's radiance back into harmony."
    },
    'Combination|Tone': {
        skinTypeName: 'Glow Harmony',
        keywords: ['Combination', 'Uneven Tone', 'Radiance'],
        focus: 'Tone-balancing care, lightweight hydration, and daily sun protection',
        summary: "Your skin is dealing with both oil imbalance and uneven tone — and UV exposure makes it harder for your skin to stay bright and balanced. Tone-balancing care, lightweight hydration, and daily sun protection can work together to bring your skin's radiance back into harmony."
    },
    'Normal|Acne': {
        skinTypeName: 'Pure Radiance',
        keywords: ['Normal', 'Natural Glow', 'Balanced'],
        focus: 'hydration and sun protection',
        summary: 'Your skin is in a genuinely good place — balanced, resilient, and responding well to daily care. Keeping up with hydration and sun protection is what helps your natural radiance stay exactly where it is.'
    },
    'Normal|Marks': {
        skinTypeName: 'Pure Radiance',
        keywords: ['Normal', 'Natural Glow', 'Balanced'],
        focus: 'hydration and sun protection',
        summary: 'Your skin is in a genuinely good place — balanced, resilient, and responding well to daily care. Keeping up with hydration and sun protection is what helps your natural radiance stay exactly where it is.'
    },
    'Normal|Pigmentation': {
        skinTypeName: 'Pure Radiance',
        keywords: ['Normal', 'Natural Glow', 'Balanced'],
        focus: 'hydration and sun protection',
        summary: 'Your skin is in a genuinely good place — balanced, resilient, and responding well to daily care. Keeping up with hydration and sun protection is what helps your natural radiance stay exactly where it is.'
    },
    'Normal|Tone': {
        skinTypeName: 'Pure Radiance',
        keywords: ['Normal', 'Natural Glow', 'Balanced'],
        focus: 'hydration and sun protection',
        summary: 'Your skin is in a genuinely good place — balanced, resilient, and responding well to daily care. Keeping up with hydration and sun protection is what helps your natural radiance stay exactly where it is.'
    }
};

Object.entries(RESULT_TYPE_PROFILES).forEach(([profileKey, profile]) => {
    if (RESULT_RECOMMENDATION_CONFIG[profileKey]) {
        Object.assign(RESULT_RECOMMENDATION_CONFIG[profileKey], profile);
    }
});

const RESULT_PRODUCTS = [
    {
        id: 'cleanser-foam',
        name: 'Anua Heartleaf Pore Deep Cleansing Foam',
        image: RESULT_ASSETS.cleanserCard,
        discount: '15%',
        price: '₹1,500',
        original: '₹2,000',
        rating: '4.3',
        reviews: '1,000'
    },
    {
        id: 'niacin-essence',
        name: 'Nacific Phyto Niacin Whitening Essence',
        image: RESULT_ASSETS.serumCard,
        discount: '20%',
        price: '₹1,350',
        original: '₹2,000',
        rating: '4.5',
        reviews: '978'
    },
    {
        id: 'relief-sun',
        name: 'Beauty of Joseon Relief sun SPF50+ PA++++',
        image: RESULT_ASSETS.sunscreenCard,
        discount: '15%',
        price: '₹1,500',
        original: '₹2,000',
        rating: '4.8',
        reviews: '975'
    },
    {
        id: 'ceramide-cream',
        name: 'ILLIYOON Ceramide Ato Concentrate Cream',
        image: RESULT_ASSETS.creamCard,
        discount: '15%',
        price: '₹1,500',
        original: '₹2,000',
        rating: '4.5',
        reviews: '1,002'
    }
];


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

// ── js/repository/SheetRepository.js ──
// SheetRepository.js — Google Sheets 전송


function sendToSheet(payload) {
    // Google Apps Script는 POST JSON에 CORS 제한이 있어
    // GET + query params 방식으로 전송 (GAS doGet에서 처리)
    try {
        const params = new URLSearchParams();
        Object.entries(payload).forEach(([k, v]) => params.set(k, String(v)));
        const url = YUNN_SHEET_ENDPOINT + '?' + params.toString();
        // no-cors 이미지 픽셀 방식 — CORS 우회, 응답 불필요
        const img = new Image();
        img.src = url;
    } catch(e) {
        // 전송 실패 시 설문 흐름에 영향 없도록 silent fail
    }
}

// ── js/repository/SurveyRepository.js ──
// SurveyRepository.js — 설문 응답 임시 저장/조회


function readPendingResult() {
    try {
        return JSON.parse(getItem(STORAGE_KEYS.PENDING_RESULT) || '{}');
    } catch {
        return {};
    }
}

function savePendingResult(data) {
    try {
        setItem(STORAGE_KEYS.PENDING_RESULT, JSON.stringify(data));
    } catch { /* silent */ }
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

// ── js/service/SurveyService.js ──
// SurveyService.js — 스텝 유효성, 피부 타입 추론, 설문 페이로드 수집


function hasAnsweredInputGroup(groupName) {
    return Boolean(document.querySelector(`input[name="${groupName}"]:checked`));
}

function isStepTwoComplete() {
    return Boolean(
        document.querySelector('input[name="gender"]:checked') &&
        document.querySelector('input[name="age"]:checked')
    );
}

function isStepSevenComplete() {
    return Boolean(
        document.querySelector('input[name="outdoor"]:checked') &&
        document.querySelector('input[name="sunscreen"]:checked')
    );
}

function isStepEightComplete() {
    return Boolean(
        document.querySelector('input[name="sleep"]:checked') &&
        document.querySelector('input[name="stress"]:checked')
    );
}

function isStepComplete(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const stepKey = String(step);
    if (stepKey === '1') return validateStepOne();
    if (stepKey === '2') return isStepTwoComplete();
    const requiredGroups = REQUIRED_STEP_INPUT_GROUPS[stepKey];
    if (!requiredGroups) return true;
    return requiredGroups.every(hasAnsweredInputGroup);
}

function getStepPrimaryButton(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const activeStep = document.querySelector(`.survey-step[data-step="${String(step)}"]`);
    return activeStep ? activeStep.querySelector('.btn-primary') : null;
}

function updateStepActionState(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const button = getStepPrimaryButton(step);
    if (!button) return;
    button.disabled = !isStepComplete(step);
}

function normalizeEmail(value) {
    return value.trim().toLowerCase();
}

function isValidIndianMvpEmail(value) {
    const email = normalizeEmail(value);
    if (!email) return false;
    // Removed strict case-sensitive check: if (email !== value.trim()) return false;
    if (/\s/.test(value.trim())) return false; // Ensure no internal spaces
    if (/[^\x00-\x7F]/.test(email)) return false;

    const parts = email.split('@');
    if (parts.length !== 2) return false;

    const [local, domain] = parts;
    if (!local || !domain) return false;
    if (!/^[a-z0-9._%+-]+$/.test(local)) return false;
    if (!/^[a-z0-9.-]+$/.test(domain)) return false;
    if (/^[._%+-]|[._%+-]$/.test(local)) return false;
    if (local.includes('..') || domain.includes('..')) return false;
    if (!domain.includes('.')) return false;

    const domainLabels = domain.split('.');
    if (domainLabels.some(label => !label || label.startsWith('-') || label.endsWith('-'))) return false;

    const tld = domainLabels[domainLabels.length - 1];
    if (!/^[a-z]{2,}$/.test(tld)) return false;
    if (!ALLOWED_INDIAN_EMAIL_DOMAINS.includes(domain)) return false;

    return true;
}

function setFieldState(input, state) {
    const card = input.closest('.step-one-card');
    if (!card) return;
    card.classList.toggle('is-valid', state === 'valid');
    card.classList.toggle('is-invalid', state === 'invalid');
}

function validateStepOne(options = {}) {
    const revealEmailError = Boolean(options.revealEmailError);
    const revealPhoneError = Boolean(options.revealPhoneError);
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const phoneInput = document.getElementById('userWhatsApp');
    const btnNext1 = document.getElementById('btn-next-1');

    const nameValid = nameInput.value.trim().length >= 2;
    const emailValid = isValidIndianMvpEmail(emailInput.value);
    const phoneValid = /^[6-9]\d{9}$/.test(phoneInput.value.trim());

    setFieldState(nameInput, nameValid ? 'valid' : '');

    if (phoneValid) {
        setFieldState(phoneInput, 'valid');
    } else if (revealPhoneError && phoneInput.value.trim()) {
        setFieldState(phoneInput, 'invalid');
        if (typeof window.trackYunnEvent === 'function') {
            window.trackYunnEvent('validation_error', {
                field_name: 'phone',
                error_type: 'invalid_indian_phone_number'
            });
        }
    } else {
        setFieldState(phoneInput, '');
    }

    if (emailValid) {
        setFieldState(emailInput, 'valid');
    } else if (revealEmailError && emailInput.value.trim()) {
        setFieldState(emailInput, 'invalid');
        if (typeof window.trackYunnEvent === 'function') {
            window.trackYunnEvent('validation_error', {
                field_name: 'email',
                error_type: 'invalid_email_format_or_domain'
            });
        }
    } else {
        setFieldState(emailInput, '');
    }

    if (btnNext1) btnNext1.disabled = !(nameValid && emailValid && phoneValid);
    return nameValid && emailValid && phoneValid;
}

function inferSkinTypeFromHelper() {
    const values = ['skinHelperCleanse', 'skinHelperAfterHours', 'skinHelperDay', 'skinHelperTexture']
        .map(name => Number(document.querySelector(`input[name="${name}"]:checked`)?.value || 0));
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
    const hasTZonePattern = values.includes(3);
    let inferredType = 'Normal';

    if (avg <= 1.8) {
        inferredType = 'Dry';
    } else if (avg >= 4.2) {
        inferredType = 'Oily';
    } else if (hasTZonePattern || (avg > 2.6 && avg < 4.2)) {
        inferredType = 'Combination';
    }

    const targetInput = document.querySelector(`input[name="skinType"][value="${inferredType}"]`);
    if (targetInput) {
        document.querySelectorAll('input[name="skinType"]').forEach(input => {
            input.checked = false;
            input.closest('.option-card')?.classList.remove('selected');
        });
        targetInput.checked = true;
        targetInput.closest('.option-card')?.classList.add('selected');
    }

    return inferredType;
}

// DOM 읽기만 수행 (sessionId는 호출 측에서 전달)
function collectSurveyPayload(sessionId) {
    return {
        name:          document.getElementById('userName')?.value.trim()                          || '',
        email:         document.getElementById('userEmail')?.value.trim()                         || '',
        phone:         document.getElementById('userWhatsApp')?.value.trim()                      || '',
        gender:        document.querySelector('input[name="gender"]:checked')?.value              || '',
        age:           document.querySelector('input[name="age"]:checked')?.value                 || '',
        skinType:      document.querySelector('input[name="skinType"]:checked')?.value            || '',
        concerns:      [...document.querySelectorAll('input[name="concerns"]:checked')].map(i => i.value).join(', ') || '',
        triggers:      [...document.querySelectorAll('input[name="trigger"]:checked')].map(i => i.value).join(', ')  || '',
        sensitivity:   document.querySelector('input[name="sensitivity"]:checked')?.value         || '',
        outdoor:       document.querySelector('input[name="outdoor"]:checked')?.value             || '',
        sunscreen:     document.querySelector('input[name="sunscreen"]:checked')?.value           || '',
        sleep:         document.querySelector('input[name="sleep"]:checked')?.value               || '',
        stress:        document.querySelector('input[name="stress"]:checked')?.value              || '',
        routineLevel:  document.querySelector('input[name="routineLevel"]:checked')?.value        || '',
        photo_uploaded: Boolean(window.uploadedSkinPhotoData),
        session_id:    sessionId || getSessionId()
    };
}

// ── js/service/ResultService.js ──
// ResultService.js — 피부 밸런스 계산, 결과 설정 조합


function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));
}

function getPrimaryConcernType() {
    const checked = [...document.querySelectorAll('input[name="concerns"]:checked')];
    const values = checked.map(input => input.value);
    if (values.includes('Pigmentation')) return 'Pigmentation';
    if (values.includes('Uneven skin tone')) return 'Tone';
    if (values.includes('Acne marks')) return 'Marks';
    if (values.includes('Acne')) return 'Acne';
    return '';
}

function getResultSurveyData() {
    const saved = readPendingResult();
    const genderValue = document.querySelector('input[name="gender"]:checked')?.value || 'Female';
    const skinType = document.querySelector('input[name="skinType"]:checked')?.value || saved.skinType || 'Oily';
    return {
        name: document.getElementById('userName')?.value.trim() || saved.name || 'Guest',
        gender: document.querySelector('input[name="gender"]:checked')?.value || saved.gender || genderValue,
        skinType,
        concernType: getPrimaryConcernType() || saved.concernType || 'Acne',
        age: document.querySelector('input[name="age"]:checked')?.value || saved.age || '',
        sleep: document.querySelector('input[name="sleep"]:checked')?.value || saved.sleep || '',
        stress: document.querySelector('input[name="stress"]:checked')?.value || saved.stress || '',
        sensitivity: document.querySelector('input[name="sensitivity"]:checked')?.value || saved.sensitivity || '',
        outdoor: document.querySelector('input[name="outdoor"]:checked')?.value || saved.outdoor || '',
        sunscreen: document.querySelector('input[name="sunscreen"]:checked')?.value || saved.sunscreen || ''
    };
}

function getResultConfig(data) {
    const key = `${data.skinType}|${data.concernType}`;
    const baseConfig = RESULT_RECOMMENDATION_CONFIG[key] || RESULT_RECOMMENDATION_CONFIG['Oily|Acne'];
    return {
        ...baseConfig,
        ...(RESULT_TYPE_PROFILES[key] || RESULT_TYPE_PROFILES['Oily|Acne'])
    };
}

function getBalanceStatus(value) {
    if (value >= 78) return 'Good';
    if (value >= 52) return 'Needs Care';
    return 'Focus';
}

function computeSkinBalance(data, config) {
    const adjust = config.balanceAdjust || {};
    const metrics = [
        { key: 'hydration', label: 'Hydration Level', base: 70 },
        { key: 'barrier', label: 'Skin Barrier Resilience', base: 78 },
        { key: 'pigment', label: 'Pigmentation Tendency', base: data.concernType === 'Pigmentation' || data.concernType === 'Tone' ? 42 : 62 },
        { key: 'calmness', label: 'Skin Calmness', base: data.sensitivity === 'Very sensitive' ? 46 : 60 },
        { key: 'oil', label: 'Oil Balance', base: data.skinType === 'Oily' ? 58 : 72 },
        { key: 'environment', label: 'Environmental Stress', base: data.outdoor === '3h+' ? 48 : 64 }
    ];

    return metrics.map(metric => {
        let value = metric.base + (adjust[metric.key] || 0);
        if (data.sleep === 'Under 5h') value -= 7;
        if (data.stress === 'Very high') value -= 8;
        if (data.sunscreen === 'Rarely') value -= 8;
        value = Math.max(28, Math.min(92, Math.round(value)));
        return { ...metric, value, status: getBalanceStatus(value) };
    });
}

function formatResultSummary(config) {
    const focus = config.focus || '';
    const paragraphs = Array.isArray(config.summaryParagraphs)
        ? config.summaryParagraphs
        : [];

    const safeParagraphs = paragraphs.length ? paragraphs : (() => {
        const extracted = [];
        String(config.summary || '').replace(/[^.!?]+[.!?]+|[^.!?]+$/g, match => {
            const trimmed = match.trim();
            if (trimmed) extracted.push(trimmed);
            return match;
        });
        return extracted;
    })();

    return safeParagraphs.map(paragraph => {
        let safeParagraph = escapeHTML(paragraph);
        if (focus && paragraph.includes(focus)) {
            safeParagraph = safeParagraph.replace(
                escapeHTML(focus),
                `<strong>${escapeHTML(focus)}</strong>`
            );
        }
        return `<p>${safeParagraph}</p>`;
    }).join('');
}

// ── js/service/FeedbackService.js ──
// FeedbackService.js — 피드백 게이트 인증, 잠금 해제 흐름


function isFeedbackVerifiedLocally() {
    return getItem('yunn_feedback_verified_session') === getSessionId();
}
window.isFeedbackVerifiedLocally = isFeedbackVerifiedLocally;

function markFeedbackVerified() {
    setItem('yunn_feedback_verified_session', getSessionId());
    setItem('yunn_feedback_verified_at', new Date().toISOString());
}

function buildFeedbackSurveyUrl() {
    const url = new URL(YUNN_FEEDBACK_FORM_URL);
    url.searchParams.set('usp', 'pp_url');
    if (YUNN_FEEDBACK_SESSION_ENTRY_ID) {
        url.searchParams.set(YUNN_FEEDBACK_SESSION_ENTRY_ID, getSessionId());
    }
    return url.toString();
}

function openFeedbackSurvey() {
    savePendingResult(getResultSurveyData());
    setItem('yunn_feedback_gate_started_at', new Date().toISOString());
    setItem('yunn_feedback_gate_session', getSessionId());
    if (typeof window.trackYunnEvent === 'function') {
        window.trackYunnEvent('feedback_survey_open', {
            session_id: getSessionId(),
            destination: 'google_form'
        });
    }
    window.open(buildFeedbackSurveyUrl(), '_blank');

    if (typeof window.setFeedbackGateStatus === 'function') {
        window.setFeedbackGateStatus(
            'ph ph-clock-countdown',
            'Form open in another tab',
            "Fill out the survey there, then come back to this tab — we'll unlock your routine automatically."
        );
    }

    let hasBeenHidden = false;
    const handleVisibilityChange = () => {
        if (document.hidden) {
            hasBeenHidden = true;
        } else if (hasBeenHidden) {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            markFeedbackVerified();
            if (typeof window.openFeedbackGateModal === 'function') window.openFeedbackGateModal('verified');
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    setTimeout(() => document.removeEventListener('visibilitychange', handleVisibilityChange), 600000);
}
window.openFeedbackSurvey = openFeedbackSurvey;

function requestFeedbackVerification() {
    return new Promise((resolve) => {
        if (isFeedbackVerifiedLocally()) {
            resolve({ completed: true, source: 'local' });
            return;
        }

        if (!YUNN_FEEDBACK_VERIFY_URL) {
            resolve({
                completed: false,
                reason: 'verification_not_configured'
            });
            return;
        }

        const callbackName = `yunnFeedbackVerify_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        const script = document.createElement('script');
        const cleanup = () => {
            delete window[callbackName];
            script.remove();
        };

        window[callbackName] = (payload) => {
            cleanup();
            resolve(payload || { completed: false });
        };

        const url = new URL(YUNN_FEEDBACK_VERIFY_URL);
        url.searchParams.set('sessionId', getSessionId());
        url.searchParams.set('callback', callbackName);
        script.src = url.toString();
        script.onerror = () => {
            cleanup();
            resolve({ completed: false, reason: 'verification_request_failed' });
        };
        document.body.appendChild(script);
    });
}

async function verifyFeedbackAndUnlock() {
    if (typeof window.openFeedbackGateModal === 'function') window.openFeedbackGateModal('checking');
    const result = await requestFeedbackVerification();
    if (result.completed === true) {
        markFeedbackVerified();
        if (typeof window.closeFeedbackGateModal === 'function') window.closeFeedbackGateModal();
        if (typeof window.setRoutineUnlockState === 'function') window.setRoutineUnlockState(true);
        return;
    }

    if (result.reason === 'verification_not_configured') {
        const pageParams = new URLSearchParams(window.location.search);
        if (pageParams.has('returnFromSurvey')) {
            markFeedbackVerified();
            if (typeof window.openFeedbackGateModal === 'function') window.openFeedbackGateModal('verified');
            return;
        }
        if (typeof window.setFeedbackGateStatus === 'function') {
            window.setFeedbackGateStatus('ph ph-info', 'Verification setup needed', 'YUNN needs the Google Apps Script verification URL and Form session field before this gate can unlock automatically.');
        }
        return;
    }

    if (typeof window.openFeedbackGateModal === 'function') window.openFeedbackGateModal('pending');
}
window.verifyFeedbackAndUnlock = verifyFeedbackAndUnlock;

// ── js/ui/templates/BalanceRowTemplate.js ──
function balanceRowNode(metric) {
    const tpl = document.getElementById('tpl-balance-row');
    const node = tpl.content.cloneNode(true);
    const root = node.querySelector('.balance-row');
    root.dataset.metricName = metric.label;
    root.querySelector('.balance-label').textContent = metric.label;
    root.querySelector('.balance-fill').style.width = metric.value + '%';
    root.querySelector('.balance-score').textContent = metric.value + '%';
    root.querySelector('.balance-status').textContent = metric.status;
    return root;
}

// ── js/ui/templates/RoutineCardTemplate.js ──
function routineCardNode(step, index) {
    const tpl = document.getElementById('tpl-routine-card');
    const node = tpl.content.cloneNode(true);
    const root = node.querySelector('.routine-card');
    root.querySelector('.routine-step-label').textContent = 'STEP ' + (index + 1);
    const img = root.querySelector('.routine-product-image img');
    img.src = step.image;
    img.alt = step.name;
    root.querySelector('.routine-product-title').textContent = step.name;
    root.querySelector('.routine-tag').textContent = step.tag;
    root.querySelector('.routine-product-desc').textContent = step.description;
    root.querySelector('.routine-why').textContent = step.why;
    root.querySelector('.routine-how').textContent = step.how;
    root.querySelector('.routine-tip-copy').textContent = step.tip;
    return root;
}

// ── js/ui/templates/ProductCardTemplate.js ──
function productCardNode(product) {
    const tpl = document.getElementById('tpl-product-card');
    const node = tpl.content.cloneNode(true);
    const root = node.querySelector('.product-card');
    root.dataset.productId = product.id;
    const img = root.querySelector('.product-image-wrap img');
    img.src = product.image;
    img.alt = product.name;
    root.querySelector('.product-name').textContent = product.name;
    root.querySelector('.product-discount').textContent = product.discount;
    root.querySelector('.product-price').textContent = product.price;
    root.querySelector('.product-original').textContent = product.original;
    root.querySelector('.product-rating-text').textContent = product.rating + ' (' + product.reviews + ')';
    root.querySelector('.cart-action').dataset.productId = product.id;
    return root;
}

// ── js/ui/ModalManager.js ──
// ModalManager.js — Beta Service Modal + Feedback Gate Modal + 카트 이벤트


class ModalManager {
    #betaCloseTimer = null;
    #resultScreen = null;

    setDeps(resultScreen) {
        this.#resultScreen = resultScreen;
    }

    init() {
        this.#bindEvents();
    }

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

    addRecommendedToCart(productId, source = 'single') {
        const product = RESULT_PRODUCTS.find(p => p.id === productId);
        if (!product) return;
        this.#recordCartEvent(product, source);
        this.openBetaModal(source, product.id);
    }

    addAllToCart() {
        RESULT_PRODUCTS.forEach(product => this.#recordCartEvent(product, 'all'));
        trackYunnEvent('add_all_to_cart_click', { product_count: RESULT_PRODUCTS.length });
        this.openBetaModal('all', 'all-products');
    }

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

// ── js/ui/IntroScreen.js ──
// IntroScreen.js — 인트로 화면, 사이드바, 모바일 크롬 상태바


class IntroScreen {
    #isLoggedIn = false;
    #surveyScreen = null;
    #modalManager = null;

    setDeps(surveyScreen, modalManager) {
        this.#surveyScreen = surveyScreen;
        this.#modalManager = modalManager;
    }

    init() {
        this.#isLoggedIn = Boolean(this.#getSurveyUser());
        this.#initMobileChrome();
        this.#bindEvents();
    }

    startSurvey() {
        trackYunnEvent('landing_cta_click', {
            button_name: 'Start My Skin Analysis',
            scroll_position: getScrollPercent(),
            time_before_click: Math.round((Date.now() - yunnAnalyticsState.screenStartedAt) / 1000)
        });
        emitCurrentScreenTime('survey_start');
        trackYunnEvent('survey_start', {
            start_source: 'landing_cta',
            current_step: '1',
            user_id: getSessionId()
        });
        document.getElementById('intro-screen').classList.remove('active');
        document.getElementById('survey-screen').classList.add('active');
        this.#surveyScreen?.updateProgress();
        trackSurveyStepView('1');
        window.scrollTo(0, 0);
    }

    debugLogin() {
        this.#isLoggedIn = true;
        document.getElementById('cart-badge').style.display = 'flex';
        alert("Simulated Login: Success. Cart badge is now visible.");
    }

    #getSurveyUser() {
        try {
            const savedUser = JSON.parse(getItem('yunnUser') || 'null');
            if (savedUser && savedUser.nickname) return savedUser;
        } catch { }
        const nickname = getItem('yunnUserNickname');
        return nickname ? { nickname } : null;
    }

    #initMobileChrome() {
        const timeEl            = document.getElementById('diagnosis-current-time');
        const networkEl         = document.getElementById('diagnosis-network-status');
        const batteryEl         = document.getElementById('diagnosis-battery-status');
        const surveyTimeEl      = document.getElementById('survey-current-time');
        const surveyNetworkEl   = document.getElementById('survey-network-slot');
        const surveyBatteryEl   = document.getElementById('survey-battery-level');

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        const updateIosClass = () => {
            document.body.classList.toggle('is-ios-mobile', isIOS && window.matchMedia('(max-width: 767px)').matches);
        };
        updateIosClass();

        const updateTime = () => {
            const value = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
            if (timeEl) timeEl.textContent = value;
            if (surveyTimeEl) surveyTimeEl.textContent = value;
        };

        const updateNetwork = () => {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const connectionType = conn && (conn.effectiveType || conn.type);
            const value = navigator.onLine && connectionType ? connectionType.toUpperCase() : (navigator.onLine ? 'Online' : 'Offline');
            if (networkEl) {
                networkEl.textContent = value;
                networkEl.classList.add('active');
                networkEl.classList.toggle('is-muted', !connectionType);
            }
            if (surveyNetworkEl) {
                const norm = String(value).toUpperCase();
                if (['4G', '5G', '3G', '2G', 'CELLULAR'].some(t => norm.includes(t))) {
                    surveyNetworkEl.textContent = norm.replace('CELLULAR', '5G');
                } else if (navigator.onLine) {
                    const icon = document.createElement('i');
                    icon.className = 'ph-fill ph-wifi-high survey-wifi-mark';
                    icon.setAttribute('aria-hidden', 'true');
                    surveyNetworkEl.replaceChildren(icon);
                } else {
                    surveyNetworkEl.textContent = 'Off';
                }
            }
        };

        const updateBattery = (battery) => {
            const percent = Math.round(battery.level * 100);
            if (batteryEl) {
                batteryEl.textContent = `${percent}%`;
                batteryEl.classList.add('active');
                batteryEl.classList.toggle('is-muted', !battery.charging);
            }
            if (surveyBatteryEl) {
                surveyBatteryEl.style.width = `${Math.max(4, Math.round(18 * battery.level))}px`;
            }
        };

        updateTime();
        updateNetwork();
        setInterval(updateTime, 10000);
        window.addEventListener('online', updateNetwork);
        window.addEventListener('offline', updateNetwork);
        window.addEventListener('resize', updateIosClass);

        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        conn?.addEventListener('change', updateNetwork);

        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                updateBattery(battery);
                battery.addEventListener('levelchange', () => updateBattery(battery));
                battery.addEventListener('chargingchange', () => updateBattery(battery));
            }).catch(() => {
                if (batteryEl) batteryEl.classList.remove('active');
                if (surveyBatteryEl) surveyBatteryEl.style.width = '14px';
            });
        } else if (surveyBatteryEl) {
            surveyBatteryEl.style.width = '14px';
        }
    }

    #toggleSidebar() {
        document.getElementById('sidebar-menu').classList.toggle('active');
        document.getElementById('sidebar-overlay').classList.toggle('active');
    }

    #handleUserClick() {
        window.location.href = this.#isLoggedIn ? '../index.html' : 'login.html';
    }

    #handleCartClick() {
        if (!this.#isLoggedIn) {
            window.location.href = 'login.html';
        } else {
            this.#modalManager?.openBetaModal('header_cart', 'header-cart');
        }
    }

    #bindEvents() {
        const onToggle = () => this.#toggleSidebar();

        document.getElementById('sidebar-overlay')?.addEventListener('click', onToggle);
        document.getElementById('btn-sidebar-close')?.addEventListener('click', onToggle);

        document.getElementById('intro-sidebar-toggle')?.addEventListener('click', onToggle);
        document.getElementById('intro-btn-logo')?.addEventListener('click', () => { window.location.href = '../index.html'; });
        document.getElementById('intro-btn-user')?.addEventListener('click', () => this.#handleUserClick());
        document.getElementById('intro-btn-cart')?.addEventListener('click', () => this.#handleCartClick());
        document.getElementById('btn-start-survey')?.addEventListener('click', () => this.startSurvey());

        document.getElementById('survey-sidebar-toggle')?.addEventListener('click', onToggle);
        document.getElementById('survey-btn-logo')?.addEventListener('click', () => { window.location.href = '../index.html'; });
        document.getElementById('survey-btn-user')?.addEventListener('click', () => this.#handleUserClick());
        document.getElementById('survey-btn-cart')?.addEventListener('click', () => this.#handleCartClick());
    }
}

// ── js/ui/SurveyScreen.js ──
// SurveyScreen.js — 설문 네비게이션, 스텝 전환, 사진 업로드


const TOTAL_STEPS = 10;
const DISPLAYED_PAGES = 10;

class SurveyScreen {
    #currentStep = '1';
    #skinHelperCompleted = false;
    #uploadedSkinPhotoData = '';
    #resultScreen = null;

    #progressBar = null;
    #steps = null;

    setDeps(resultScreen) {
        this.#resultScreen = resultScreen;
    }

    init() {
        this.#progressBar = document.getElementById('progress-bar');
        this.#steps = document.querySelectorAll('.survey-step');
        this.#initState();
        this.#bindEvents();
        this.#handleUrlParams();
    }

    updateProgress() {
        const isHelper = SKIN_HELPER_STEPS.includes(String(this.#currentStep));
        const displayStep = isHelper
            ? String(this.#currentStep)
            : String(Math.min(Number(this.#currentStep), DISPLAYED_PAGES));
        const progressStep = isHelper ? 3 : Math.min(Number(this.#currentStep), DISPLAYED_PAGES);
        this.#progressBar.style.width = (progressStep / DISPLAYED_PAGES) * 100 + '%';
        const indicator = document.getElementById('step-indicator');
        if (indicator) {
            indicator.innerText = isHelper
                ? 'Page ' + displayStep
                : 'Page ' + displayStep + ' of ' + DISPLAYED_PAGES;
        }
    }

    goToStep(step) {
        const target = String(step);
        if (!document.querySelector(`.survey-step[data-step="${target}"]`)) return;
        emitCurrentScreenTime('step_change');
        this.#steps.forEach(s => s.classList.remove('active'));
        document.querySelector(`.survey-step[data-step="${target}"]`).classList.add('active');
        this.#currentStep = target;
        window.currentStep = target;
        this.updateProgress();
        updateStepActionState(target);
        trackSurveyStepView(target);
        window.scrollTo(0, 0);
    }

    #isSkinHelperStep(step = this.#currentStep) {
        return SKIN_HELPER_STEPS.includes(String(step));
    }

    #isHelperStepComplete() {
        const active = document.querySelector(`.survey-step[data-step="${this.#currentStep}"]`);
        return Boolean(active?.querySelector('input[type="radio"]:checked'));
    }

    #nextStep() {
        trackStepNextClick(this.#currentStep);

        if (this.#currentStep === '1') {
            if (!validateStepOne({ revealEmailError: true, revealPhoneError: true })) {
                trackYunnEvent('next_button_disabled_click', {
                    missing_fields: ['name', 'email', 'phone'].filter(f => {
                        if (f === 'name')  return !document.getElementById('userName').value.trim();
                        if (f === 'email') return !isValidIndianMvpEmail(document.getElementById('userEmail').value);
                        return !/^[6-9]\d{9}$/.test(document.getElementById('userWhatsApp').value.trim());
                    })
                });
                alert("Please fill out all fields.");
                return;
            }
        }

        if (this.#currentStep === '2' && !isStepTwoComplete()) {
            trackYunnEvent('next_button_disabled_click', {
                missing_selection: ['gender', 'age'].filter(n => !document.querySelector(`input[name="${n}"]:checked`))
            });
            alert("Please select your gender and age.");
            return;
        }

        if (this.#currentStep === '3') {
            const selected = document.querySelector('input[name="skinType"]:checked')?.value;
            if (!selected) { alert("Please select your skin type."); return; }
            if (selected === 'NotSure') { this.goToStep('3-1'); return; }
        }

        const guards = {
            '4': ['concerns', "Please select your biggest skin concern."],
            '5': ['trigger',  "Please select at least one trigger."],
            '6': ['sensitivity', "Please choose one option."],
            '9': ['routineLevel', "Please choose one option."],
        };
        if (guards[this.#currentStep]) {
            const [name, msg] = guards[this.#currentStep];
            if (!document.querySelector(`input[name="${name}"]:checked`)) {
                trackYunnEvent('next_button_disabled_click', { missing_selection: [name] });
                alert(msg);
                return;
            }
        }

        if (this.#currentStep === '7' && !isStepSevenComplete()) {
            trackYunnEvent('next_button_disabled_click', {
                missing_selection: ['outdoor', 'sunscreen'].filter(n => !document.querySelector(`input[name="${n}"]:checked`))
            });
            alert("Please answer both sun habit questions.");
            return;
        }

        if (this.#currentStep === '8' && !isStepEightComplete()) {
            trackYunnEvent('next_button_disabled_click', {
                missing_selection: ['sleep', 'stress'].filter(n => !document.querySelector(`input[name="${n}"]:checked`))
            });
            alert("Please answer both lifestyle questions.");
            return;
        }

        if (this.#isSkinHelperStep()) {
            if (!this.#isHelperStepComplete()) {
                trackYunnEvent('next_button_disabled_click', { missing_selection: [`skinHelper:${this.#currentStep}`] });
                alert("Please choose one option.");
                return;
            }
            const idx = SKIN_HELPER_STEPS.indexOf(this.#currentStep);
            if (idx < SKIN_HELPER_STEPS.length - 1) {
                this.goToStep(SKIN_HELPER_STEPS[idx + 1]);
            } else {
                inferSkinTypeFromHelper();
                this.#skinHelperCompleted = true;
                this.goToStep('4');
            }
            return;
        }

        if (Number(this.#currentStep) === TOTAL_STEPS) {
            this.#startAnalysis();
        } else {
            this.goToStep(String(Number(this.#currentStep) + 1));
        }
    }

    #goBack() {
        trackStepBackClick(this.#currentStep);
        if (this.#isSkinHelperStep()) {
            const idx = SKIN_HELPER_STEPS.indexOf(this.#currentStep);
            this.goToStep(idx === 0 ? '3' : SKIN_HELPER_STEPS[idx - 1]);
        } else if (Number(this.#currentStep) > 1) {
            const prev = this.#currentStep === '4' && this.#skinHelperCompleted
                ? '3-4'
                : String(Number(this.#currentStep) - 1);
            this.goToStep(prev);
        } else {
            document.getElementById('survey-screen').classList.remove('active');
            document.getElementById('intro-screen').classList.add('active');
        }
    }

    #startAnalysis() {
        sendToSheet(collectSurveyPayload(getSessionId()));
        const surveyValues = getCurrentStepSelectedValues('10');
        trackYunnEvent('photo_upload_conversion', { upload_completed: Boolean(this.#uploadedSkinPhotoData) });
        trackYunnEvent('analysis_completion_success', { all_answers_completed: true });
        trackYunnEvent('survey_complete', {
            user_id: getSessionId(),
            final_step: this.#currentStep,
            skin_type: surveyValues.skinType || '',
            skin_concern: surveyValues.concerns || '',
            photo_uploaded: Boolean(this.#uploadedSkinPhotoData)
        });
        emitCurrentScreenTime('analysis_start');
        document.getElementById('survey-screen').style.display = 'none';
        document.getElementById('analysis-screen').style.display = 'block';
        markAnalyticsScreen('analysis');

        const messages = [
            "Analysing skin concern patterns...",
            "Mapping daily environment...",
            "Calibrating routine intensity...",
            "Finalising your plan..."
        ];
        let i = 0;
        const interval = setInterval(() => {
            document.getElementById('cycling-status').innerText = messages[i % messages.length];
            i++;
            if (i === 4) {
                clearInterval(interval);
                this.#resultScreen?.show();
            }
        }, 600);
    }

    #previewPhoto(event) {
        const file = event.target.files[0];
        yunnAnalyticsState.uploadStartedAt = Date.now();
        yunnAnalyticsState.uploadAttemptCount += 1;
        if (!file) {
            trackYunnEvent('skin_photo_upload_cancel', { cancel_stage: 'file_picker' });
            return;
        }
        trackYunnEvent('skin_photo_upload_start', {
            file_type: file.type || 'unknown',
            device_type: window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop',
            attempt_count: yunnAnalyticsState.uploadAttemptCount
        });
        const reader = new FileReader();
        reader.onload = (e) => {
            this.#uploadedSkinPhotoData = e.target.result;
            window.uploadedSkinPhotoData = this.#uploadedSkinPhotoData;
            const preview = document.getElementById('photo-preview');
            preview.src = this.#uploadedSkinPhotoData;
            preview.style.display = 'block';
            trackYunnEvent('skin_photo_upload_success', {
                file_size: file.size,
                file_type: file.type || 'unknown',
                upload_duration_sec: Math.max(0, Math.round((Date.now() - yunnAnalyticsState.uploadStartedAt) / 1000))
            });
            trackYunnEvent('skin_photo_quality_check', { brightness_score: 'not_measured_mvp', face_detected: 'not_measured_mvp' });
            if (yunnAnalyticsState.uploadAttemptCount > 1) {
                trackYunnEvent('skin_photo_multiple_attempts', { attempt_count: yunnAnalyticsState.uploadAttemptCount });
            }
        };
        reader.onerror = () => trackYunnEvent('skin_photo_upload_fail', { error_type: 'file_read_error' });
        reader.readAsDataURL(file);
    }

    #initState() {
        window.currentStep = this.#currentStep;
        window.uploadedSkinPhotoData = '';
        document.getElementById('btn-next-2') && (document.getElementById('btn-next-2').disabled = !isStepTwoComplete());
        document.getElementById('btn-next-7') && (document.getElementById('btn-next-7').disabled = !isStepSevenComplete());
        document.getElementById('btn-next-8') && (document.getElementById('btn-next-8').disabled = !isStepEightComplete());
        Object.keys(REQUIRED_STEP_INPUT_GROUPS).forEach(step => updateStepActionState(step));
        validateStepOne();
    }

    #bindEvents() {
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (card.classList.contains('checkbox-card')) {
                    const cb = card.querySelector('input[type="checkbox"]');
                    cb.checked = !cb.checked;
                    card.classList.toggle('selected', cb.checked);
                    trackInputSelection(cb, '', cb.value, cb.checked);
                    updateStepActionState(this.#currentStep);
                    return;
                }

                const radio = card.querySelector('input[type="radio"]');
                if (!radio) return;
                const stepEl = card.closest('.survey-step');
                const previousValue = stepEl.querySelector(`input[name="${radio.name}"]:checked`)?.value || '';
                stepEl.querySelectorAll(`input[name="${radio.name}"]`).forEach(input => {
                    input.closest('.option-card')?.classList.remove('selected');
                });
                card.classList.add('selected');
                radio.checked = true;
                trackInputSelection(radio, previousValue, radio.value, true);
                updateStepActionState(this.#currentStep);

                const autoAdvanceSteps = {
                    '2': () => {
                        const btn = document.getElementById('btn-next-2');
                        if (btn) btn.disabled = !isStepTwoComplete();
                        if (isStepTwoComplete()) setTimeout(() => this.goToStep('3'), 300);
                    },
                    '7': () => {
                        const btn = document.getElementById('btn-next-7');
                        if (btn) btn.disabled = !isStepSevenComplete();
                        if (isStepSevenComplete()) setTimeout(() => this.goToStep('8'), 300);
                    },
                    '8': () => {
                        const btn = document.getElementById('btn-next-8');
                        if (btn) btn.disabled = !isStepEightComplete();
                        if (isStepEightComplete()) setTimeout(() => this.goToStep('9'), 300);
                    },
                };
                if (autoAdvanceSteps[this.#currentStep]) {
                    autoAdvanceSteps[this.#currentStep]();
                } else {
                    setTimeout(() => this.#nextStep(), 300);
                }
            });
        });

        document.querySelectorAll('#userName, #userEmail, #userWhatsApp').forEach(input => {
            input.addEventListener('input', () => {
                if (input.id === 'userWhatsApp') {
                    input.value = input.value.replace(/\D/g, '').slice(0, 10);
                }
                validateStepOne({ revealEmailError: false, revealPhoneError: false });
            });
        });
        document.getElementById('userEmail')?.addEventListener('blur', () => {
            validateStepOne({ revealEmailError: true, revealPhoneError: false });
        });
        document.getElementById('userWhatsApp')?.addEventListener('blur', () => {
            validateStepOne({ revealEmailError: false, revealPhoneError: true });
        });

        document.querySelector('.photo-upload-container')?.addEventListener('click', () => {
            trackYunnEvent('skin_photo_upload_click', { upload_source: 'photo_upload_container' });
        });
        document.getElementById('bareFacePhoto')?.addEventListener('click', () => {
            trackYunnEvent('skin_photo_upload_click', { upload_source: 'file_input' });
        });
        document.getElementById('bareFacePhoto')?.addEventListener('change', e => this.#previewPhoto(e));

        document.querySelectorAll('.step10-actions button').forEach(button => {
            button.addEventListener('click', () => {
                const label = button.innerText.trim().toLowerCase();
                if (label.includes('skip')) {
                    trackYunnEvent('skip_photo_click', { photo_uploaded: false });
                } else if (label.includes('complete')) {
                    trackYunnEvent('complete_analysis_click', { photo_uploaded: Boolean(this.#uploadedSkinPhotoData) });
                }
            });
        });

        document.getElementById('assessment-form')?.addEventListener('click', e => {
            const btn = e.target.closest('button[data-action]');
            if (!btn || btn.disabled) return;
            const action = btn.getAttribute('data-action');
            if (action === 'next') this.#nextStep();
            else if (action === 'back') this.#goBack();
        });
    }

    #handleUrlParams() {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('survey')) return;
        document.getElementById('intro-screen').classList.remove('active');
        document.getElementById('survey-screen').classList.add('active');
        this.updateProgress();
        trackSurveyStepView(this.#currentStep);
        window.scrollTo(0, 0);
        const requestedStep = params.get('step');
        if (requestedStep) this.goToStep(requestedStep);
    }
}

// ── js/ui/ResultScreen.js ──
// ResultScreen.js — 결과 화면 DOM 조작 및 이벤트. 계산·HTML 생성 없음.


class ResultScreen {
    #currentConfig = null;
    #activePeriod = 'morning';
    #observer = null;
    #visitedSections = new Set();
    #unlockTracked = false;
    #modalManager = null;
    #surveyScreen = null;

    setDeps(modalManager, surveyScreen) {
        this.#modalManager = modalManager;
        this.#surveyScreen = surveyScreen;
    }

    init() {
        this.#bindEvents();
        this.#handleUrlParams();
    }

    show() {
        const data = getResultSurveyData();
        const config = getResultConfig(data);
        savePendingResult(data);
        this.#modalManager?.closeFeedbackGateModal();
        this.#render(data, config);
    }

    setUnlockState(isUnlocked) {
        const el = document.getElementById('locked-result-content');
        if (!el) return;
        el.classList.toggle('locked', !isUnlocked);
        el.setAttribute('data-unlocked', isUnlocked ? 'true' : 'false');
        if (isUnlocked && !this.#unlockTracked) {
            this.#unlockTracked = true;
            trackYunnEvent('unlock_conversion', { plan_type: 'full_routine' });
        }
    }

    #render(data, config) {
        this.#currentConfig = config;
        emitCurrentScreenTime('result_render');
        markAnalyticsScreen('result');
        trackYunnEvent('result_page_view', {
            user_id: getSessionId(), skin_type: config.skinTypeName,
            skin_concern: data.concernType, result_keywords: config.keywords
        });
        trackYunnEvent('result_view', {
            user_id: getSessionId(), skin_type: config.skinTypeName,
            skin_concern: data.concernType, result_keywords: config.keywords
        });

        document.getElementById('intro-screen').classList.remove('active');
        document.getElementById('survey-screen').classList.remove('active');
        document.getElementById('survey-screen').style.display = 'none';
        document.getElementById('analysis-screen').style.display = 'none';
        document.getElementById('result-screen').style.display = 'block';

        this.#setChromeStatus();
        this.#renderHeader(data, config);
        this.#renderBalance(data, config);
        this.#renderRoutine('morning');
        this.#renderProducts();
        this.setUnlockState(isFeedbackVerifiedLocally());
        this.#setupAnalytics(data, config);
        window.scrollTo(0, 0);
    }

    #setChromeStatus() {
        const timeEl = document.getElementById('result-current-time');
        const networkEl = document.getElementById('result-network-status');
        if (timeEl) {
            timeEl.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
        }
        if (networkEl) {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const value = conn?.effectiveType ? conn.effectiveType.toUpperCase() : '4G';
            networkEl.textContent = value.includes('WIFI') ? '' : value.replace('CELLULAR', '5G');
        }
    }

    #renderHeader(data, config) {
        document.getElementById('result-user-name').textContent = data.name;
        document.querySelector('#result-type-name .result-type-main').textContent = config.skinTypeName;
        const fallback = data.gender === 'Male' ? RESULT_ASSETS.userFallbackMale : RESULT_ASSETS.userFallbackFemale;
        document.getElementById('result-face-image').src = window.uploadedSkinPhotoData || fallback;
        const keywordNodes = config.keywords.map(kw => {
            const span = document.createElement('span');
            span.className = 'result-keyword';
            span.textContent = kw;
            return span;
        });
        document.getElementById('result-keywords').replaceChildren(...keywordNodes);
        document.getElementById('result-summary').innerHTML = formatResultSummary(config);
    }

    #renderBalance(data, config) {
        const nodes = computeSkinBalance(data, config).map(balanceRowNode);
        nodes.forEach(row => {
            row.addEventListener('click', () => {
                trackYunnEvent('metric_detail_click', { metric_name: row.dataset.metricName || '', skin_type: config.skinTypeName });
            }, { once: true });
        });
        document.getElementById('skin-balance-list').replaceChildren(...nodes);
    }

    #renderRoutine(period = this.#activePeriod) {
        if (!this.#currentConfig) return;
        this.#activePeriod = period;
        trackYunnEvent('routine_preview_view', { routine_type: period });
        document.getElementById('morning-tab').classList.toggle('active', period === 'morning');
        document.getElementById('evening-tab').classList.toggle('active', period === 'evening');
        const steps = this.#currentConfig.routines[period] || [];
        document.getElementById('result-routine-list').replaceChildren(...steps.map(routineCardNode));
    }

    #renderProducts() {
        document.getElementById('result-product-grid').replaceChildren(...RESULT_PRODUCTS.map(productCardNode));
    }

    #retake() {
        trackYunnEvent('retake_quiz_click', { source: yunnAnalyticsState.currentScreen || 'unknown' });
        ['feedback-gate-modal', 'beta-service-modal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.classList.remove('active', 'closing'); el.setAttribute('aria-hidden', 'true'); }
        });
        document.getElementById('result-screen').style.display = 'none';
        document.getElementById('analysis-screen').style.display = 'none';
        document.getElementById('survey-screen').classList.remove('active');
        document.getElementById('survey-screen').style.display = '';
        document.getElementById('intro-screen').classList.add('active');
        markAnalyticsScreen('intro');
        window.scrollTo(0, 0);
    }

    #goBackToSurvey() {
        document.getElementById('result-screen').style.display = 'none';
        document.getElementById('survey-screen').style.display = '';
        document.getElementById('survey-screen').classList.add('active');
        this.#surveyScreen?.goToStep('10');
    }

    #share() {
        const text = `My YUNN Skin Insight: ${this.#currentConfig ? this.#currentConfig.skinTypeName : 'Skin Analysis'}`;
        trackYunnEvent('share_result_click', { share_channel: navigator.share ? 'native_share' : 'fallback_alert' });
        if (navigator.share) {
            navigator.share({ title: 'YUNN Skin Analysis', text }).catch(() => {});
        } else {
            alert(text);
        }
    }

    #setupAnalytics(data, config) {
        if (this.#observer) this.#observer.disconnect();
        this.#visitedSections = new Set();

        const sections = [
            { selector: '.result-insight',      name: 'skin_type',    event: 'skin_type_section_view' },
            { selector: '.balance-card',        name: 'skin_balance', event: 'skin_balance_section_view' },
            { selector: '.routine-tabs',        name: 'routine_tabs', event: 'routine_preview_view' },
            { selector: '.products-section',    name: 'products',     event: 'product_recommendation_section_view' },
            { selector: '.unlock-preview-card', name: 'unlock_cta',   event: 'unlock_cta_view' }
        ];

        this.#observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const sectionName = entry.target.getAttribute('data-analytics-section');
                const eventName   = entry.target.getAttribute('data-analytics-event');
                if (!sectionName || !eventName || this.#visitedSections.has(sectionName)) return;

                this.#visitedSections.add(sectionName);
                yunnAnalyticsState.lastVisibleResultSection = sectionName;
                const payload = { section_name: sectionName, skin_type: config.skinTypeName };

                if (sectionName === 'skin_balance') {
                    Object.assign(payload, {
                        balance_scores: computeSkinBalance(data, config).reduce((acc, m) => {
                            acc[m.key] = m.value; return acc;
                        }, {})
                    });
                }
                if (sectionName === 'routine_tabs') payload.routine_type = this.#activePeriod;
                if (sectionName === 'unlock_cta') {
                    payload.cta_id = 'unlock_full_routine';
                    payload.cta_position = 'routine_unlock_preview';
                }
                trackYunnEvent(eventName, payload);
            });
        }, { threshold: 0.35 });

        sections.forEach(({ selector, name, event }) => {
            const el = document.querySelector(selector);
            if (!el) return;
            el.setAttribute('data-analytics-section', name);
            el.setAttribute('data-analytics-event', event);
            this.#observer.observe(el);
        });
    }

    #bindEvents() {
        document.getElementById('btn-back-from-result')
            ?.addEventListener('click', () => this.#goBackToSurvey());
        document.getElementById('btn-share-result')
            ?.addEventListener('click', () => this.#share());
        document.getElementById('morning-tab')
            ?.addEventListener('click', () => {
                trackYunnEvent('routine_preview_expand', { section_name: 'morning_routine' });
                this.#renderRoutine('morning');
            });
        document.getElementById('evening-tab')
            ?.addEventListener('click', () => {
                trackYunnEvent('routine_preview_expand', { section_name: 'evening_routine' });
                this.#renderRoutine('evening');
            });
        document.getElementById('btn-retake-quiz')
            ?.addEventListener('click', () => this.#retake());
        document.getElementById('btn-retake-quiz-nav')
            ?.addEventListener('click', () => this.#retake());
    }

    #handleUrlParams() {
        const p = new URLSearchParams(window.location.search);
        if (p.has('returnFromSurvey')) {
            this.show();
            verifyFeedbackAndUnlock();
        } else if (p.has('resultDemo')) {
            this.show();
        }
    }
}

// ── js/app.js ──
// app.js — 클래스 인스턴스 생성 및 의존성 주입


const modal  = new ModalManager();
const result = new ResultScreen();
const survey = new SurveyScreen();
const intro  = new IntroScreen();

modal.setDeps(result);
result.setDeps(modal, survey);
survey.setDeps(result);
intro.setDeps(survey, modal);

// FeedbackService(service 레이어)는 window.*를 통해 UI를 호출한다.
// 클래스 메서드로 라우팅하여 전역 노출을 최소화.
window.setRoutineUnlockState  = (v)       => result.setUnlockState(v);
window.openFeedbackGateModal  = (mode)    => modal.openFeedbackGateModal(mode);
window.closeFeedbackGateModal = ()        => modal.closeFeedbackGateModal();
window.setFeedbackGateStatus  = (i, t, c) => modal.setFeedbackGateStatus(i, t, c);

document.addEventListener('DOMContentLoaded', () => {
    intro.init();
    survey.init();
    result.init();
    modal.init();
});

