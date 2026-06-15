// SurveyAnswer.js — 각 스텝 선택지 정의

export const ALLOWED_INDIAN_EMAIL_DOMAINS = [
    'gmail.com',
    'outlook.com',
    'yahoo.com',
    'yahoo.in',
    'hotmail.com',
    'rediffmail.com',
    'icloud.com',
];

export const PHONE_REGEX = /^[6-9]\d{9}$/;

export const GENDER_OPTIONS    = ['Female', 'Male'];
export const AGE_OPTIONS       = ['Under 18', '18–24', '25–30', '31–40', '40+'];
export const SKIN_TYPE_OPTIONS = ['Oily', 'Dry', 'Combination', 'Normal', 'Not Sure'];
export const CONCERN_OPTIONS   = ['Acne', 'Acne marks', 'Pigmentation', 'Uneven skin tone'];
export const TRIGGER_OPTIONS   = ['Sun', 'Stress', 'Period', 'Sleep', 'New skincare', 'Nothing specific'];
export const SENSITIVITY_OPTIONS = [
    'Rarely reacts', 'Sometimes reacts', 'Often reacts', 'Very sensitive',
];
export const OUTDOOR_OPTIONS   = ['Less than 1 hour', '1–3 hours', '3–5 hours', '5+ hours'];
export const SUNSCREEN_OPTIONS = ['Every day', 'Most days', 'Occasionally', 'Rarely or never'];
export const SLEEP_OPTIONS     = ['Less than 5 hours', '5–6 hours', '7–8 hours', '9+ hours'];
export const STRESS_OPTIONS    = ['Low', 'Moderate', 'High', 'Very high'];
export const ROUTINE_LEVEL_OPTIONS = ['Nothing', 'Wash only', 'Basic', 'Multi-step'];
