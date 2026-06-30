// RoutineRepository.js — 루틴 데이터 접근 계층
// 루틴 관련 모든 데이터의 읽기/쓰기를 담당한다.
// 반드시 SessionRepository를 경유한다. localStorage를 직접 접근하면 안 된다.
// RoutineDomain이 비즈니스 로직을 처리하고, 이 클래스는 순수하게 저장·조회만 한다.

import { STORAGE_KEYS } from '../domain/AppConfig.js';
import { getItem, setItem } from './SessionRepository.js';

export class RoutineRepository {
    // 루틴 시작일 문자열("YYYY-MM-DD")을 반환한다. 시작 전이면 null.
    getRoutineStart() {
        return getItem(STORAGE_KEYS.ROUTINE_START);
    }

    // 루틴 시작일을 "YYYY-MM-DD" 형식으로 저장한다.
    // RoutineDomain.startRoutine()에서 최초 시작 시 한 번 호출된다.
    saveRoutineStart(dateStr) {
        setItem(STORAGE_KEYS.ROUTINE_START, dateStr);
    }

    // 모든 날짜의 스텝 완료 상태를 객체로 반환한다.
    // 반환 형태: { "2026-06-23": { morning: [true, false, true], evening: [true, true] }, ... }
    // 파싱 실패 시 빈 객체를 반환해 호출부를 보호한다.
    getChecks() {
        try {
            return JSON.parse(getItem(STORAGE_KEYS.ROUTINE_CHECKS) || '{}');
        } catch {
            return {};
        }
    }

    // 스텝 완료 상태 객체 전체를 JSON으로 직렬화해 저장한다.
    // RoutineDomain.setStepChecked()가 상태를 수정한 뒤 이 메서드로 영속화한다.
    saveChecks(checks) {
        setItem(STORAGE_KEYS.ROUTINE_CHECKS, JSON.stringify(checks));
    }

    // Before 사진 데이터를 반환한다.
    // 반환 형태: { dataUrl: "data:image/jpeg;base64,...", date: "YYYY-MM-DD" } 또는 null.
    getBeforePhoto() {
        try {
            return JSON.parse(getItem(STORAGE_KEYS.PHOTO_BEFORE) || 'null');
        } catch {
            return null;
        }
    }

    // Before 사진을 저장한다. JPEG 압축 후 base64 data URL 형태로 전달받는다.
    // localStorage 5MB 한도에 맞게 PhotoManager가 압축 후 이 메서드를 호출한다.
    saveBeforePhoto(photo) {
        setItem(STORAGE_KEYS.PHOTO_BEFORE, JSON.stringify(photo));
    }

    // After 사진 데이터를 반환한다. 반환 형태는 getBeforePhoto와 동일.
    getAfterPhoto() {
        try {
            return JSON.parse(getItem(STORAGE_KEYS.PHOTO_AFTER) || 'null');
        } catch {
            return null;
        }
    }

    // After 사진을 저장한다. Day 14 이상일 때만 UI에서 호출된다.
    saveAfterPhoto(photo) {
        setItem(STORAGE_KEYS.PHOTO_AFTER, JSON.stringify(photo));
    }
}
