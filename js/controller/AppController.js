// AppController.js — 앱 초기화, 의존성 연결, 화면 라우팅
// 비즈니스 로직 처리 금지. 상태 확인 후 화면 전환만 담당.

import { trackRoutineStarted } from '../service/AnalyticsService.js';

export class AppController {
    #domain;
    #repo;
    #routineScreen;
    #reminderModal;
    #photoManager;
    #result = null;

    setDeps(domain, repo, routineScreen, reminderModal, photoManager) {
        this.#domain        = domain;
        this.#repo          = repo;
        this.#routineScreen = routineScreen;
        this.#reminderModal = reminderModal;
        this.#photoManager  = photoManager;
    }

    init() {
        this.#result = this.#loadResult();
        this.#reminderModal.init();
        this.#photoManager.init();
        this.#photoManager.onBeforeSaved(() => this.#goToRoutineScreen());
        this.#photoManager.onAfterSaved(()  => this.#goToCompareScreen());

        this.#bindStartButton();
        this.#bindAfterPhotoBanner();
        this.#route();
    }

    #loadResult() {
        try {
            return JSON.parse(localStorage.getItem('yunn_pending_result_data') || 'null');
        } catch {
            return null;
        }
    }

    #route() {
        if (!this.#result?.skinType) {
            this.#showScreen('guard-screen');
            return;
        }
        if (!this.#domain.isStarted()) {
            this.#showScreen('start-screen');
            return;
        }
        if (this.#domain.isBeforeAfterUnlocked() && this.#photoManager.hasAfterPhoto()) {
            this.#goToCompareScreen();
            return;
        }
        this.#goToRoutineScreen();
    }

    #showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id)?.classList.add('active');
    }

    #goToRoutineScreen() {
        this.#showScreen('routine-screen');
        this.#routineScreen.init(this.#result);
        if (this.#reminderModal.shouldShow()) {
            this.#reminderModal.show();
        }
    }

    #goToCompareScreen() {
        this.#showScreen('compare-screen');
        this.#photoManager.renderCompare();
    }

    #bindStartButton() {
        document.getElementById('btn-start-routine')?.addEventListener('click', () => {
            this.#domain.startRoutine();
            trackRoutineStarted(this.#result?.skinType, this.#result?.concernType);
            this.#showScreen('routine-screen');
            this.#routineScreen.init(this.#result);
            if (this.#reminderModal.shouldShow()) {
                this.#reminderModal.show();
            }
        });
    }

    #bindAfterPhotoBanner() {
        document.getElementById('after-photo-banner-btn')
            ?.addEventListener('click', () => {
                document.getElementById('after-photo-input')?.click();
            });
    }
}
