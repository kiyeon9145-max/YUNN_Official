// FeedbackService.js — 피드백 게이트 인증 및 Full Routine 잠금 해제 흐름
// 사용자가 Google Form 설문을 완료한 것이 확인될 때 Full Routine을 잠금 해제한다.
// UI 업데이트는 window.* 콜백을 통해 ModalManager/ResultScreen으로 위임한다.

import {
    YUNN_FEEDBACK_FORM_URL,
    YUNN_FEEDBACK_SESSION_ENTRY_ID,
    YUNN_FEEDBACK_VERIFY_URL
} from '../domain/AppConfig.js';
import { getSessionId, getItem, setItem } from '../repository/SessionRepository.js';
import { savePendingResult } from '../repository/SurveyRepository.js';
import { getResultSurveyData } from './ResultService.js';

// 현재 세션이 피드백을 완료한 것으로 로컬에 기록됐는지 확인한다.
// 세션 ID를 함께 저장해 다른 기기나 다른 세션에서 잘못 unlock되는 것을 방지한다.
export function isFeedbackVerifiedLocally() {
    return getItem('yunn_feedback_verified_session') === getSessionId();
}
// AnalyticsService의 emitPageAbandon이 window를 통해 이 함수를 호출한다.
window.isFeedbackVerifiedLocally = isFeedbackVerifiedLocally;

// 현재 세션의 피드백 완료를 로컬에 기록한다.
// 세션 ID와 완료 시각을 함께 저장해 추후 디버깅에 활용한다.
export function markFeedbackVerified() {
    setItem('yunn_feedback_verified_session', getSessionId());
    setItem('yunn_feedback_verified_at', new Date().toISOString());
}

// 세션 ID가 pre-fill된 Google Form URL을 생성한다.
// YUNN_FEEDBACK_SESSION_ENTRY_ID가 설정된 경우, 해당 hidden entry에 세션 ID를 주입한다.
// Apps Script가 이 세션 ID를 Sheets에 기록해 서버 측 검증에 사용할 수 있다.
export function buildFeedbackSurveyUrl() {
    const url = new URL(YUNN_FEEDBACK_FORM_URL);
    url.searchParams.set('usp', 'pp_url');
    if (YUNN_FEEDBACK_SESSION_ENTRY_ID) {
        url.searchParams.set(YUNN_FEEDBACK_SESSION_ENTRY_ID, getSessionId());
    }
    return url.toString();
}

// 피드백 Google Form을 새 탭에서 열고, 사용자가 다시 돌아왔을 때 자동으로 잠금 해제한다.
// visibilitychange 이벤트를 활용한다:
//   1) 새 탭 열림 → 현재 탭이 숨겨짐(hidden) → hasBeenHidden=true 기록
//   2) 사용자가 현재 탭으로 복귀 → visible → markFeedbackVerified() 호출
// 서버 검증 없이 "탭을 떠났다 돌아옴" 자체를 완료 신호로 간주하는 낙관적 방식이다.
// (서버 검증은 YUNN_FEEDBACK_VERIFY_URL이 설정됐을 때 requestFeedbackVerification에서 처리)
export function openFeedbackSurvey() {
    // 복귀 후 결과를 올바르게 복원하기 위해 현재 설문 데이터를 저장한다.
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

    // 모달 상태를 "다른 탭에서 설문 진행 중"으로 업데이트한다.
    if (typeof window.setFeedbackGateStatus === 'function') {
        window.setFeedbackGateStatus(
            'ph ph-clock-countdown',
            'Form open in another tab',
            "Fill out the survey there, then come back to this tab — we'll unlock your routine automatically."
        );
    }

    // visibilitychange 리스너로 탭 복귀를 감지한다.
    let hasBeenHidden = false;
    const handleVisibilityChange = () => {
        if (document.hidden) {
            hasBeenHidden = true; // 다른 탭으로 이동한 사실을 기록
        } else if (hasBeenHidden) {
            // 한 번이라도 숨겨진 후 다시 보이면 설문 완료로 간주
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            markFeedbackVerified();
            if (typeof window.openFeedbackGateModal === 'function') window.openFeedbackGateModal('verified');
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    // 10분(600000ms) 후에 리스너를 자동 제거해 메모리 누수를 방지한다.
    setTimeout(() => document.removeEventListener('visibilitychange', handleVisibilityChange), 600000);
}
window.openFeedbackSurvey = openFeedbackSurvey;

// YUNN_FEEDBACK_VERIFY_URL을 통해 서버에서 피드백 완료 여부를 비동기로 확인한다.
// JSONP 방식으로 요청한다: Apps Script가 콜백 함수를 호출하는 JS를 반환하는 방식.
//   이유: fetch CORS 제한 우회. Apps Script Web App은 CORS 헤더 조작이 불편하다.
// 반환값: { completed: true/false, source?, reason? }
export function requestFeedbackVerification() {
    return new Promise((resolve) => {
        // 이미 로컬에서 검증된 세션이면 서버 요청 없이 즉시 완료 처리한다.
        if (isFeedbackVerifiedLocally()) {
            resolve({ completed: true, source: 'local' });
            return;
        }

        // 서버 URL이 없으면 미설정 상태를 알리는 결과를 반환한다.
        if (!YUNN_FEEDBACK_VERIFY_URL) {
            resolve({
                completed: false,
                reason: 'verification_not_configured'
            });
            return;
        }

        // 충돌을 피하기 위해 고유한 전역 콜백 이름을 생성한다.
        const callbackName = `yunnFeedbackVerify_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        const script = document.createElement('script');
        const cleanup = () => {
            delete window[callbackName]; // 전역 오염 정리
            script.remove();
        };

        // Apps Script가 callbackName({...}) 형태로 호출한다.
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

// 피드백 완료를 확인하고 Full Routine 잠금을 해제하는 메인 흐름.
// 1) 모달을 "확인 중" 상태로 전환
// 2) 서버(또는 로컬)에서 완료 여부 확인
// 3a) 완료 확인 → 잠금 해제 + 모달 닫기
// 3b) 미설정(verification_not_configured) + returnFromSurvey 파라미터 존재 → 낙관적 잠금 해제
// 3c) 그 외 → "아직 미완료" 상태 모달 표시
export async function verifyFeedbackAndUnlock() {
    if (typeof window.openFeedbackGateModal === 'function') window.openFeedbackGateModal('checking');
    const result = await requestFeedbackVerification();
    if (result.completed === true) {
        markFeedbackVerified();
        if (typeof window.closeFeedbackGateModal === 'function') window.closeFeedbackGateModal();
        if (typeof window.setRoutineUnlockState === 'function') window.setRoutineUnlockState(true);
        return;
    }

    if (result.reason === 'verification_not_configured') {
        // 서버 검증이 설정되지 않은 경우, URL에 returnFromSurvey가 있으면 낙관적으로 잠금 해제한다.
        // Google Form 확인 URL에 ?returnFromSurvey=1을 설정하면 Form 완료 후 여기로 돌아온다.
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

    // 완료 확인이 안 된 경우 "아직 완료되지 않음" 모달을 표시한다.
    if (typeof window.openFeedbackGateModal === 'function') window.openFeedbackGateModal('pending');
}
window.verifyFeedbackAndUnlock = verifyFeedbackAndUnlock;
