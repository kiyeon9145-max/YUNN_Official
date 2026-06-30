// SurveyRepository.js — 설문 응답 임시 저장 및 조회
// 설문 완료 후 결과 화면으로 이동하거나, 피드백 게이트 후 복귀할 때
// localStorage에 저장된 설문 데이터를 복원하는 데 사용된다.

import { STORAGE_KEYS } from '../domain/AppConfig.js';
import { getItem, setItem } from './SessionRepository.js';

// 저장된 설문 결과를 객체로 반환한다.
// 저장값이 없거나 JSON 파싱에 실패하면 빈 객체 {}를 반환해 호출부를 보호한다.
// 반환 형태: { skinType, concernType, gender, name, email, ... }
export function readPendingResult() {
    try {
        return JSON.parse(getItem(STORAGE_KEYS.PENDING_RESULT) || '{}');
    } catch {
        return {};
    }
}

// 설문 결과를 JSON 문자열로 직렬화해 localStorage에 저장한다.
// FeedbackService.openFeedbackSurvey()와 ResultScreen.show()에서 호출된다.
// 저장 실패(localStorage 용량 초과 등)는 설문 흐름에 영향을 주지 않도록 조용히 무시한다.
export function savePendingResult(data) {
    try {
        setItem(STORAGE_KEYS.PENDING_RESULT, JSON.stringify(data));
    } catch { /* silent */ }
}
