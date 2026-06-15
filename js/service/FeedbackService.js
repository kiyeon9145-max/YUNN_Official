// FeedbackService.js — 피드백 게이트 인증, 잠금 해제 흐름

import {
    YUNN_FEEDBACK_FORM_URL,
    YUNN_FEEDBACK_SESSION_ENTRY_ID,
    YUNN_FEEDBACK_VERIFY_URL
} from '../domain/AppConfig.js';
import { getSessionId, getItem, setItem } from '../repository/SessionRepository.js';
import { savePendingResult } from '../repository/SurveyRepository.js';
import { getResultSurveyData } from './ResultService.js';

export function isFeedbackVerifiedLocally() {
    return getItem('yunn_feedback_verified_session') === getSessionId();
}
window.isFeedbackVerifiedLocally = isFeedbackVerifiedLocally;

export function markFeedbackVerified() {
    setItem('yunn_feedback_verified_session', getSessionId());
    setItem('yunn_feedback_verified_at', new Date().toISOString());
}

export function buildFeedbackSurveyUrl() {
    const url = new URL(YUNN_FEEDBACK_FORM_URL);
    url.searchParams.set('usp', 'pp_url');
    if (YUNN_FEEDBACK_SESSION_ENTRY_ID) {
        url.searchParams.set(YUNN_FEEDBACK_SESSION_ENTRY_ID, getSessionId());
    }
    return url.toString();
}

export function openFeedbackSurvey() {
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

export function requestFeedbackVerification() {
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
