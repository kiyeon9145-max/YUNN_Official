// RoutineRepository.js — 루틴 데이터 접근 계층
// SessionRepository를 통해서만 저장/조회한다. localStorage 직접 접근 금지.

import { STORAGE_KEYS } from '../domain/AppConfig.js';
import { getItem, setItem } from './SessionRepository.js';

export class RoutineRepository {
    getRoutineStart() {
        return getItem(STORAGE_KEYS.ROUTINE_START);
    }

    saveRoutineStart(dateStr) {
        setItem(STORAGE_KEYS.ROUTINE_START, dateStr);
    }

    getChecks() {
        try {
            return JSON.parse(getItem(STORAGE_KEYS.ROUTINE_CHECKS) || '{}');
        } catch {
            return {};
        }
    }

    saveChecks(checks) {
        setItem(STORAGE_KEYS.ROUTINE_CHECKS, JSON.stringify(checks));
    }

    getBeforePhoto() {
        try {
            return JSON.parse(getItem(STORAGE_KEYS.PHOTO_BEFORE) || 'null');
        } catch {
            return null;
        }
    }

    saveBeforePhoto(photo) {
        setItem(STORAGE_KEYS.PHOTO_BEFORE, JSON.stringify(photo));
    }

    getAfterPhoto() {
        try {
            return JSON.parse(getItem(STORAGE_KEYS.PHOTO_AFTER) || 'null');
        } catch {
            return null;
        }
    }

    saveAfterPhoto(photo) {
        setItem(STORAGE_KEYS.PHOTO_AFTER, JSON.stringify(photo));
    }
}
