// SurveyAnswer.js — 설문 각 스텝의 선택지 목록 및 입력값 검증 상수
// 모든 option-card의 value는 이 파일 상수와 일치해야 한다.
// ResultService, SurveyService가 이 값을 키로 설정 맵을 조회한다.

// ── 이메일 도메인 허용 목록 ──────────────────────────────────────────────────────
// MVP 범위: 인도에서 주로 사용하는 이메일 도메인만 허용.
// rediffmail.com, yahoo.in은 인도 특화 도메인.
// SurveyService.isValidIndianMvpEmail()이 이 목록으로 도메인을 검증한다.
export const ALLOWED_INDIAN_EMAIL_DOMAINS = [
    'gmail.com',
    'outlook.com',
    'yahoo.com',
    'yahoo.in',
    'hotmail.com',
    'rediffmail.com',
    'icloud.com',
];

// 인도 휴대폰 번호 정규식.
// 인도 번호는 6~9로 시작하는 10자리 숫자. SurveyService.validateStepOne()에서 사용.
export const PHONE_REGEX = /^[6-9]\d{9}$/;

// ── 각 스텝 선택지 목록 ─────────────────────────────────────────────────────────
// HTML option-card의 input value와 반드시 동일하게 유지해야 한다.
// AnalyticsService, ResultService가 이 값을 그대로 GTM 이벤트 속성으로 기록한다.

// Step 2: 성별 (결과 화면 프로필 이미지 및 RoutineDatabase 키 조합에 사용)
export const GENDER_OPTIONS    = ['Female', 'Male'];

// Step 2: 나이 구간
export const AGE_OPTIONS       = ['Under 18', '18–24', '25–30', '31–40', '40+'];

// Step 3: 피부 타입 (ResultService.getResultConfig()의 조합 키로 사용됨)
export const SKIN_TYPE_OPTIONS = ['Oily', 'Dry', 'Combination', 'Normal', 'Not Sure'];

// Step 4: 피부 고민 (복수 선택 가능 — checkbox)
// ResultService.getPrimaryConcernType()이 우선순위(Pigmentation > Tone > Marks > Acne)로 대표값을 선택
export const CONCERN_OPTIONS   = ['Acne', 'Acne marks', 'Pigmentation', 'Uneven skin tone'];

// Step 5: 트러블 유발 요인 (복수 선택 가능 — checkbox)
export const TRIGGER_OPTIONS   = ['Sun', 'Stress', 'Period', 'Sleep', 'New skincare', 'Nothing specific'];

// Step 6: 피부 민감도 (ResultService.computeSkinBalance()의 calmness 기준값 조정에 사용)
export const SENSITIVITY_OPTIONS = [
    'Rarely reacts', 'Sometimes reacts', 'Often reacts', 'Very sensitive',
];

// Step 7-1: 하루 평균 외출 시간 (환경 스트레스 지수 계산에 사용)
export const OUTDOOR_OPTIONS   = ['Less than 1 hour', '1–3 hours', '3–5 hours', '5+ hours'];

// Step 7-2: 선크림 사용 빈도 (computeSkinBalance에서 -8 페널티 계산에 사용)
export const SUNSCREEN_OPTIONS = ['Every day', 'Most days', 'Occasionally', 'Rarely or never'];

// Step 8-1: 수면 시간 (computeSkinBalance에서 'Under 5h'일 때 -7 페널티 계산에 사용)
export const SLEEP_OPTIONS     = ['Less than 5 hours', '5–6 hours', '7–8 hours', '9+ hours'];

// Step 8-2: 스트레스 수준 (computeSkinBalance에서 'Very high'일 때 -8 페널티 계산에 사용)
export const STRESS_OPTIONS    = ['Low', 'Moderate', 'High', 'Very high'];

// Step 9: 현재 스킨케어 루틴 수준 (결과 화면 루틴 복잡도 결정에 참고)
export const ROUTINE_LEVEL_OPTIONS = ['Nothing', 'Wash only', 'Basic', 'Multi-step'];
