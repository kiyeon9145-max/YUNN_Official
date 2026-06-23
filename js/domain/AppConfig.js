// AppConfig.js — URL 상수, GTM ID, 엔드포인트

export const YUNN_FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeaZgxM0-jGhdBJzJARLwAHCnyyvQaYfFw3QsP4iYq_5M5C3Q/viewform';
export const YUNN_FEEDBACK_SESSION_ENTRY_ID = '';
export const YUNN_FEEDBACK_VERIFY_URL = '';
export const YUNN_FEEDBACK_RETURN_PARAM = 'returnFromSurvey';

export const YUNN_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyVf7nkwjveU5rWg3iE363zg8wsWhXdba47-C0HKSfpjZYMJ62-p4tetm4RADGT11MNfQ/exec';

export const YUNN_ANALYTICS_STORAGE_KEY = 'yunn_analytics_events';
export const YUNN_ANALYTICS_MAX_EVENTS = 1000;
export const YUNN_ANALYTICS_ENDPOINT = '';
export const YUNN_SCROLL_THRESHOLDS = [25, 50, 75, 100];
export const YUNN_LONG_STAY_SECONDS = 45;

export const STORAGE_KEYS = {
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

export const ROUTINE_CONFIG = {
    BEFORE_AFTER_UNLOCK_DAY: 14,
    MORNING_START_HOUR:      6,
    MORNING_END_HOUR:        10,
    EVENING_START_HOUR:      20,
    EVENING_END_HOUR:        23,
};

export const YUNN_GTM_ID = 'GTM-P2NX3N5K';
