// app.js — 클래스 인스턴스 생성 및 의존성 주입

import { IntroScreen }  from './ui/IntroScreen.js';
import { SurveyScreen } from './ui/SurveyScreen.js';
import { ResultScreen } from './ui/ResultScreen.js';
import { ModalManager } from './ui/ModalManager.js';

const modal  = new ModalManager();
const result = new ResultScreen();
const survey = new SurveyScreen();
const intro  = new IntroScreen();

modal.setDeps(result);
result.setDeps(modal, survey);
survey.setDeps(result);
intro.setDeps(survey, modal);

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
