// SessionRepository.js — localStorage 추상화 계층 및 세션 ID 관리
// 모든 로컬 데이터 읽기/쓰기는 이 파일의 함수를 통해서만 수행한다.
// 프라이버시 제한 브라우저(iOS Safari Private 등)에서 localStorage가 차단되는 경우
// in-memory 폴백으로 자동 전환되어 앱이 중단 없이 동작한다.

import { STORAGE_KEYS } from '../domain/AppConfig.js';

// in-memory 폴백 저장소: localStorage 접근이 차단된 환경에서 사용.
// 페이지 새로고침 시 데이터는 사라지지만, 단일 세션 내에서는 정상 작동한다.
const yunnMemoryStorage = {};

// localStorage를 사용할 수 있으면 그대로, 불가하면 in-memory 객체를 localStorage처럼 래핑.
// IIFE(즉시실행함수)로 초기화해 모듈 로드 시 한 번만 판단한다.
const yunnStorage = (() => {
    try {
        if (window.localStorage) return window.localStorage;
    } catch {
        // 일부 임베디드 브라우저나 개인정보 보호 모드에서 localStorage 접근 자체가 예외를 던진다.
    }
    // localStorage를 흉내 내는 in-memory 객체 반환.
    // hasOwnProperty 직접 호출로 프로토타입 체인 오염을 방지한다.
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

// ── 공개 API ────────────────────────────────────────────────────────────────────

// 지정 키의 저장된 문자열 값을 반환. 없으면 null.
export function getItem(key)        { return yunnStorage.getItem(key); }

// 지정 키에 값을 문자열로 저장. 모든 값은 String()으로 강제 변환된다.
export function setItem(key, value) { yunnStorage.setItem(key, String(value)); }

// 지정 키를 저장소에서 삭제.
export function removeItem(key)     { yunnStorage.removeItem(key); }

// ── 세션 ID 관리 ─────────────────────────────────────────────────────────────────
// 앱 전역에서 사용하는 익명 세션 식별자를 반환한다.
// 저장된 세션 ID가 있으면 그대로 사용하고, 없으면 새로 생성 후 저장한다.
// crypto.randomUUID()를 우선 사용하고(보안 컨텍스트 필요), 없으면 Date.now() + 난수로 폴백.
export function getSessionId() {
    let sessionId = yunnStorage.getItem(STORAGE_KEYS.SESSION_ID);
    if (!sessionId) {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            sessionId = `yunn_${crypto.randomUUID()}`;
        } else {
            // crypto.randomUUID가 없는 구형 브라우저(Android 4.x 등) 대응.
            sessionId = `yunn_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        }
        yunnStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
    }
    return sessionId;
}

// 이전 코드와의 하위 호환성을 위해 getSessionId의 별칭을 유지한다.
export const getYunnSessionId = getSessionId;
