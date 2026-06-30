// AppConfig.js — 앱 전체에서 사용하는 URL 상수, GTM ID, 엔드포인트, localStorage 키, 정책값
// 모든 정책값은 이 파일 한 곳에서만 관리. 다른 파일에서 하드코딩 금지.

// ── 피드백 설문 관련 URL 상수 ─────────────────────────────────────────────────
// 사용자가 설문을 완료한 뒤 Full Routine을 잠금 해제하는 Google Form URL.
export const YUNN_FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeaZgxM0-jGhdBJzJARLwAHCnyyvQaYfFw3QsP4iYq_5M5C3Q/viewform';

// Google Form 내에서 세션 ID를 숨겨진 필드로 전달할 entry ID.
// 미설정 시 세션 ID 자동 주입이 비활성화된다.
export const YUNN_FEEDBACK_SESSION_ENTRY_ID = '';

// 피드백 완료 여부를 서버에서 확인하는 Apps Script 엔드포인트.
// 미설정 시 URL 파라미터(returnFromSurvey) 기반 로컬 검증으로 폴백된다.
export const YUNN_FEEDBACK_VERIFY_URL = '';

// 피드백 설문 완료 후 앱으로 리다이렉트할 때 붙는 URL 파라미터 키.
// Google Form의 "확인 URL"에 ?returnFromSurvey=1 형태로 설정해야 한다.
export const YUNN_FEEDBACK_RETURN_PARAM = 'returnFromSurvey';

// ── Google Sheets 리드 수집 엔드포인트 ──────────────────────────────────────────
// 설문 완료 시 사용자 응답을 Google Sheets로 전송하는 Apps Script Web App URL.
// GAS doGet 함수가 GET 요청을 처리하도록 배포되어 있어야 한다.
export const YUNN_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyVf7nkwjveU5rWg3iE363zg8wsWhXdba47-C0HKSfpjZYMJ62-p4tetm4RADGT11MNfQ/exec';

// ── Analytics 설정 상수 ─────────────────────────────────────────────────────────
// localStorage에 이벤트 로그를 저장할 키 이름.
export const YUNN_ANALYTICS_STORAGE_KEY = 'yunn_analytics_events';

// localStorage에 보관할 이벤트 최대 개수. 초과 시 오래된 이벤트부터 삭제된다.
export const YUNN_ANALYTICS_MAX_EVENTS = 1000;

// 이벤트를 원격 서버로 전송할 엔드포인트. 미설정 시 GTM dataLayer와 localStorage에만 기록된다.
export const YUNN_ANALYTICS_ENDPOINT = '';

// 스크롤 깊이 이벤트를 발행할 % 구간 목록.
// 예: 사용자가 페이지의 25%, 50%, 75%, 100% 지점에 도달할 때 각각 이벤트 발행.
export const YUNN_SCROLL_THRESHOLDS = [25, 50, 75, 100];

// 한 화면에 45초 이상 머물면 "사용자가 막혀 있다(friction)"고 판단하는 기준 시간(초).
export const YUNN_LONG_STAY_SECONDS = 45;

// ── localStorage 키 목록 ────────────────────────────────────────────────────────
// 모든 로컬 저장소 접근은 SessionRepository를 경유하며,
// 키 이름은 반드시 이 객체에서만 참조한다.
export const STORAGE_KEYS = {
    SESSION_ID:        'yunn_session_id',       // UUID 기반 세션 식별자
    FEEDBACK_VERIFIED: 'yunn_feedback_verified', // 피드백 게이트 완료 여부
    PENDING_RESULT:    'yunn_pending_result_data', // 설문 결과 임시 저장 (skinType, concernType 등)
    ANALYTICS_EVENTS:  'yunn_analytics_events',  // 이벤트 로그 배열 (최대 1000건)
    CART_EVENTS:       'yunn_cart_events',        // 장바구니 클릭 이벤트 로그
    BETA_EVENTS:       'yunn_beta_events',        // 베타 모달 열람 이벤트 로그
    ROUTINE_START:     'yunn_routine_start',      // 루틴 시작일 "YYYY-MM-DD"
    ROUTINE_CHECKS:    'yunn_routine_checks',     // 일자별 스텝 완료 상태 (boolean 배열)
    PHOTO_BEFORE:      'yunn_photo_before',       // Before 사진 { dataUrl, date }
    PHOTO_AFTER:       'yunn_photo_after',        // After 사진 { dataUrl, date }
};

// ── 루틴 화면 정책값 ─────────────────────────────────────────────────────────────
// 직접 숫자를 코드에 쓰지 않고 이 상수를 통해서만 참조해야 한다.
export const ROUTINE_CONFIG = {
    BEFORE_AFTER_UNLOCK_DAY: 14,  // Day 14 이상이 되어야 After 사진 업로드 버튼이 활성화됨
    MORNING_START_HOUR:      6,   // 아침 루틴 알림 시작 시각 (6:00)
    MORNING_END_HOUR:        10,  // 아침 루틴 알림 종료 시각 (10:00)
    EVENING_START_HOUR:      20,  // 저녁 루틴 알림 시작 시각 (20:00)
    EVENING_END_HOUR:        23,  // 저녁 루틴 알림 종료 시각 (23:00)
};

// GTM 컨테이너 ID. survey.html, routine.html의 <head> 최상단 GTM 스니펫에서 사용.
export const YUNN_GTM_ID = 'GTM-P2NX3N5K';
