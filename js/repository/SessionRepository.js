// SessionRepository.js — localStorage / 세션 ID 관리

import { STORAGE_KEYS } from '../domain/AppConfig.js';

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

export function getItem(key)        { return yunnStorage.getItem(key); }
export function setItem(key, value) { yunnStorage.setItem(key, String(value)); }
export function removeItem(key)     { yunnStorage.removeItem(key); }

export function getSessionId() {
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
export const getYunnSessionId = getSessionId;
