// app.js — survey.html 진입점: UI 클래스 인스턴스 생성 및 의존성 주입(setDeps 패턴)
// 화면 흐름: IntroScreen → SurveyScreen(10스텝) → ResultScreen(+ ModalManager 베타/피드백)
// service 레이어(FeedbackService 등)는 클래스를 직접 참조하지 않고 window.* 콜백으로만 UI를 호출한다.

import { IntroScreen }  from './ui/IntroScreen.js';
import { SurveyScreen } from './ui/SurveyScreen.js';
import { ResultScreen } from './ui/ResultScreen.js';
import { ModalManager } from './ui/ModalManager.js';

// 인스턴스 생성 (생성 순서는 무관 — 연결은 아래 setDeps에서 일괄 처리)
const modal  = new ModalManager();
const result = new ResultScreen();
const survey = new SurveyScreen();
const intro  = new IntroScreen();

// 의존성 주입: 각 화면이 필요로 하는 다른 화면 참조를 연결한다.
modal.setDeps(result);          // 모달 → 결과 화면(잠금 해제 등)
result.setDeps(modal, survey);  // 결과 → 모달, 설문(재시작)
survey.setDeps(result);         // 설문 → 결과(완료 시 전환)
intro.setDeps(survey, modal);   // 인트로 → 설문(시작), 모달

// FeedbackService(service 레이어)는 window.*를 통해 UI를 호출한다.
// 클래스 메서드로 라우팅하여 전역 노출을 최소화.
window.setRoutineUnlockState  = (v)       => result.setUnlockState(v);
window.openFeedbackGateModal  = (mode)    => modal.openFeedbackGateModal(mode);
window.closeFeedbackGateModal = ()        => modal.closeFeedbackGateModal();
window.setFeedbackGateStatus  = (i, t, c) => modal.setFeedbackGateStatus(i, t, c);

document.addEventListener('DOMContentLoaded', () => {
    intro.init();
    survey.init();
    result.init();
    modal.init();
});
