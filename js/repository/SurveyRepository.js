// SurveyRepository.js — 설문 응답 임시 저장/조회

import { STORAGE_KEYS } from '../domain/AppConfig.js';
import { getItem, setItem } from './SessionRepository.js';

export function readPendingResult() {
    try {
        return JSON.parse(getItem(STORAGE_KEYS.PENDING_RESULT) || '{}');
    } catch {
        return {};
    }
}

export function savePendingResult(data) {
    try {
        setItem(STORAGE_KEYS.PENDING_RESULT, JSON.stringify(data));
    } catch { /* silent */ }
}
