// AppController.js — 앱 초기화, 의존성 연결, 화면 라우팅
// 비즈니스 로직 처리 금지(CLAUDE.md). 사용자 상태를 보고 4개 스크린 중 하나로 전환만 담당.
// 날짜 계산·저장·GTM 전송은 각각 Domain/Repository/AnalyticsService에 위임한다.

import { trackRoutineStarted } from '../service/AnalyticsService.js';

export class AppController {
    // 주입받는 협력 객체 (private 필드)
    #domain;         // 날짜·진행률 등 비즈니스 로직
    #repo;           // 루틴 데이터 접근
    #routineScreen;  // 메인 루틴 화면 렌더링
    #reminderModal;  // 시간 기반 알림 모달
    #photoManager;   // Before/After 사진
    #result = null;  // 설문 진단 결과 (skinType·concernType 등)

    // routine.js에서 호출 — 협력 객체들을 연결한다.
    setDeps(domain, repo, routineScreen, reminderModal, photoManager) {
        this.#domain        = domain;
        this.#repo          = repo;
        this.#routineScreen = routineScreen;
        this.#reminderModal = reminderModal;
        this.#photoManager  = photoManager;
    }

    // 앱 시작: 결과 로드 → 하위 컴포넌트 초기화 → 사진 저장 콜백 연결 → 버튼 바인딩 → 라우팅.
    init() {
        this.#result = this.#loadResult();
        this.#reminderModal.init();
        this.#photoManager.init();
        // 사진 저장 완료 시 다음 화면으로 자동 전환 (콜백 위임)
        this.#photoManager.onBeforeSaved(() => this.#goToRoutineScreen());
        this.#photoManager.onAfterSaved(()  => this.#goToCompareScreen());

        this.#bindStartButton();
        this.#bindAfterPhotoBanner();
        this.#route();
    }

    // 설문 결과(yunn_pending_result_data)를 읽는다. 없거나 파싱 실패 시 null → guard 화면으로 유도.
    #loadResult() {
        try {
            return JSON.parse(localStorage.getItem('yunn_pending_result_data') || 'null');
        } catch {
            return null;
        }
    }

    // 화면 라우팅 (CLAUDE.md 전환 조건):
    //   진단 결과 없음 → guard / 루틴 미시작 → start
    //   Day14+ & After사진 있음 → compare / 그 외 → routine
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

    // 모든 .screen을 숨기고 지정한 id 화면만 활성화한다 (SPA 화면 전환).
    #showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id)?.classList.add('active');
    }

    // 메인 루틴 화면으로 전환하고, 알림 표시 조건이면 리마인더 모달도 띄운다.
    #goToRoutineScreen() {
        this.#showScreen('routine-screen');
        this.#routineScreen.init(this.#result);
        if (this.#reminderModal.shouldShow()) {
            this.#reminderModal.show();
        }
    }

    // Before/After 비교 화면으로 전환하고 두 사진을 렌더링한다.
    #goToCompareScreen() {
        this.#showScreen('compare-screen');
        this.#photoManager.renderCompare();
    }

    // start 화면의 "루틴 시작" 버튼: 시작일 저장 → routine_started 이벤트 → 루틴 화면 진입.
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

    // 루틴 화면 상단의 After 사진 업로드 배너 버튼 → 숨겨진 파일 input을 대신 클릭.
    #bindAfterPhotoBanner() {
        document.getElementById('after-photo-banner-btn')
            ?.addEventListener('click', () => {
                document.getElementById('after-photo-input')?.click();
            });
    }
}
