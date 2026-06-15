// SurveyScreen.js — 설문 네비게이션, 스텝 전환, 사진 업로드

import { REQUIRED_STEP_INPUT_GROUPS, SKIN_HELPER_STEPS } from '../domain/SkinType.js';
import {
    isStepComplete,
    isStepTwoComplete,
    isStepSevenComplete,
    isStepEightComplete,
    validateStepOne,
    isValidIndianMvpEmail,
    collectSurveyPayload,
    inferSkinTypeFromHelper,
    updateStepActionState
} from '../service/SurveyService.js';
import {
    trackYunnEvent,
    trackInputSelection,
    markAnalyticsScreen,
    trackSurveyStepView,
    trackStepNextClick,
    trackStepBackClick,
    emitCurrentScreenTime,
    yunnAnalyticsState,
    getCurrentStepSelectedValues
} from '../service/AnalyticsService.js';
import { getSessionId } from '../repository/SessionRepository.js';
import { sendToSheet } from '../repository/SheetRepository.js';

// 전역 상태 (원본 그대로)
let currentStep = '1';
const totalSteps = 10;
const displayedSurveyPages = 10;
const progressBar = document.getElementById('progress-bar');
const steps = document.querySelectorAll('.survey-step');
const skinHelperSteps = SKIN_HELPER_STEPS;
let skinHelperCompleted = false;

// AnalyticsService가 window.currentStep을 읽을 수 있도록 노출
window.currentStep = currentStep;

// 업로드된 피부 사진 (AnalyticsService + SurveyService가 window를 통해 읽음)
window.uploadedSkinPhotoData = '';
let uploadedSkinPhotoData = '';

window.validateStepOne = validateStepOne;
window.updateProgress  = updateProgress;

function updateProgress() {
    const isSkinHelper = skinHelperSteps.includes(String(currentStep));
    const displayStep = isSkinHelper ? String(currentStep) : String(Math.min(Number(currentStep), displayedSurveyPages));
    const progressStep = isSkinHelper ? 3 : Math.min(Number(currentStep), displayedSurveyPages);
    const percent = (progressStep / displayedSurveyPages) * 100;
    progressBar.style.width = percent + '%';
    const indicator = document.getElementById('step-indicator');
    if (indicator) indicator.innerText = isSkinHelper ? 'Page ' + displayStep : 'Page ' + displayStep + ' of ' + displayedSurveyPages;
}

function goToStep(step) {
    const targetStep = String(step);
    if (!document.querySelector(`.survey-step[data-step="${targetStep}"]`)) return;
    emitCurrentScreenTime('step_change');
    steps.forEach(s => s.classList.remove('active'));
    document.querySelector(`.survey-step[data-step="${targetStep}"]`).classList.add('active');
    currentStep = targetStep;
    window.currentStep = currentStep;
    updateProgress();
    updateStepActionState(targetStep);
    trackSurveyStepView(targetStep);
    window.scrollTo(0, 0);
}

function isSkinHelperStep(step) {
    if (step === undefined) step = currentStep;
    return skinHelperSteps.includes(String(step));
}

function isCurrentSkinHelperStepComplete() {
    const activeStep = document.querySelector(`.survey-step[data-step="${currentStep}"]`);
    return Boolean(activeStep && activeStep.querySelector('input[type="radio"]:checked'));
}

function nextStep() {
    trackStepNextClick(currentStep);
    // Very simple validation
    if (currentStep === '1') {
        const stepOneReady = validateStepOne({ revealEmailError: true, revealPhoneError: true });
        if (!stepOneReady) {
            trackYunnEvent('next_button_disabled_click', {
                missing_fields: ['name', 'email', 'phone'].filter(field => {
                    if (field === 'name') return !document.getElementById('userName').value.trim();
                    if (field === 'email') return !isValidIndianMvpEmail(document.getElementById('userEmail').value);
                    return !/^[6-9]\d{9}$/.test(document.getElementById('userWhatsApp').value.trim());
                })
            });
            alert("Please fill out all fields.");
            return;
        }
    }
    if (currentStep === '2' && !isStepTwoComplete()) {
        trackYunnEvent('next_button_disabled_click', {
            missing_selection: ['gender', 'age'].filter(name => !document.querySelector(`input[name="${name}"]:checked`))
        });
        alert("Please select your gender and age.");
        return;
    }

    if (currentStep === '3') {
        const selectedSkinType = document.querySelector('input[name="skinType"]:checked')?.value;
        if (!selectedSkinType) {
            trackYunnEvent('next_button_disabled_click', { missing_selection: ['skinType'] });
            alert("Please select your skin type.");
            return;
        }
        if (selectedSkinType === 'NotSure') {
            goToStep('3-1');
            return;
        }
    }

    if (currentStep === '4' && !document.querySelector('input[name="concerns"]:checked')) {
        trackYunnEvent('next_button_disabled_click', { missing_selection: ['concerns'] });
        alert("Please select your biggest skin concern.");
        return;
    }

    if (currentStep === '5' && !document.querySelector('input[name="trigger"]:checked')) {
        trackYunnEvent('next_button_disabled_click', { missing_selection: ['trigger'] });
        alert("Please select at least one trigger.");
        return;
    }

    if (currentStep === '6' && !document.querySelector('input[name="sensitivity"]:checked')) {
        trackYunnEvent('next_button_disabled_click', { missing_selection: ['sensitivity'] });
        alert("Please choose one option.");
        return;
    }

    if (currentStep === '7' && !isStepSevenComplete()) {
        trackYunnEvent('next_button_disabled_click', {
            missing_selection: ['outdoor', 'sunscreen'].filter(name => !document.querySelector(`input[name="${name}"]:checked`))
        });
        alert("Please answer both sun habit questions.");
        return;
    }

    if (currentStep === '8' && !isStepEightComplete()) {
        trackYunnEvent('next_button_disabled_click', {
            missing_selection: ['sleep', 'stress'].filter(name => !document.querySelector(`input[name="${name}"]:checked`))
        });
        alert("Please answer both lifestyle questions.");
        return;
    }

    if (currentStep === '9' && !document.querySelector('input[name="routineLevel"]:checked')) {
        trackYunnEvent('next_button_disabled_click', { missing_selection: ['routineLevel'] });
        alert("Please choose one option.");
        return;
    }

    if (isSkinHelperStep()) {
        if (!isCurrentSkinHelperStepComplete()) {
            trackYunnEvent('next_button_disabled_click', { missing_selection: [`skinHelper:${currentStep}`] });
            alert("Please choose one option.");
            return;
        }

        const helperIndex = skinHelperSteps.indexOf(currentStep);
        if (helperIndex < skinHelperSteps.length - 1) {
            goToStep(skinHelperSteps[helperIndex + 1]);
        } else {
            inferSkinTypeFromHelper();
            skinHelperCompleted = true;
            goToStep('4');
        }
        return;
    }

    if (Number(currentStep) === totalSteps) {
        startAnalysis();
    } else {
        goToStep(String(Number(currentStep) + 1));
    }
}

function goBack() {
    trackStepBackClick(currentStep);
    if (isSkinHelperStep()) {
        const helperIndex = skinHelperSteps.indexOf(currentStep);
        goToStep(helperIndex === 0 ? '3' : skinHelperSteps[helperIndex - 1]);
    } else if (Number(currentStep) > 1) {
        if (currentStep === '4' && skinHelperCompleted) {
            goToStep('3-4');
        } else {
            goToStep(String(Number(currentStep) - 1));
        }
    } else {
        // Go back to intro
        document.getElementById('survey-screen').classList.remove('active');
        document.getElementById('intro-screen').classList.add('active');
    }
}

function startAnalysis() {
    // 구글 시트로 설문 데이터 전송
    sendToSheet(collectSurveyPayload(getSessionId()));

    const surveyValues = getCurrentStepSelectedValues('10');
    trackYunnEvent('photo_upload_conversion', {
        upload_completed: Boolean(uploadedSkinPhotoData)
    });
    trackYunnEvent('analysis_completion_success', {
        all_answers_completed: true
    });
    trackYunnEvent('survey_complete', {
        user_id: getSessionId(),
        final_step: currentStep,
        skin_type: surveyValues.skinType || '',
        skin_concern: surveyValues.concerns || '',
        photo_uploaded: Boolean(uploadedSkinPhotoData)
    });
    emitCurrentScreenTime('analysis_start');
    document.getElementById('survey-screen').style.display = 'none';
    document.getElementById('analysis-screen').style.display = 'block';
    markAnalyticsScreen('analysis');

    const statusMessages = ["Analysing skin concern patterns...", "Mapping daily environment...", "Calibrating routine intensity...", "Finalising your plan..."];
    let i = 0;
    const interval = setInterval(() => {
        document.getElementById('cycling-status').innerText = statusMessages[i % statusMessages.length];
        i++;
        if (i === 4) {
            clearInterval(interval);
            if (typeof window.showResults === 'function') window.showResults();
        }
    }, 600);
}

function updateStepTwoState() {
    const btnNext2 = document.getElementById('btn-next-2');
    if (btnNext2) btnNext2.disabled = !isStepTwoComplete();
}

function updateStepSevenState() {
    const btnNext7 = document.getElementById('btn-next-7');
    if (btnNext7) btnNext7.disabled = !isStepSevenComplete();
}

function updateStepEightState() {
    const btnNext8 = document.getElementById('btn-next-8');
    if (btnNext8) btnNext8.disabled = !isStepEightComplete();
}

// 포토 업로드 핸들러 (HTML의 onchange="previewPhoto(event)")
function previewPhoto(event) {
    const file = event.target.files[0];
    yunnAnalyticsState.uploadStartedAt = Date.now();
    yunnAnalyticsState.uploadAttemptCount += 1;
    if (file) {
        trackYunnEvent('skin_photo_upload_start', {
            file_type: file.type || 'unknown',
            device_type: window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop',
            attempt_count: yunnAnalyticsState.uploadAttemptCount
        });
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedSkinPhotoData = e.target.result;
            window.uploadedSkinPhotoData = uploadedSkinPhotoData;
            const preview = document.getElementById('photo-preview');
            preview.src = uploadedSkinPhotoData;
            preview.style.display = 'block';
            trackYunnEvent('skin_photo_upload_success', {
                file_size: file.size,
                file_type: file.type || 'unknown',
                upload_duration_sec: Math.max(0, Math.round((Date.now() - yunnAnalyticsState.uploadStartedAt) / 1000))
            });
            trackYunnEvent('skin_photo_quality_check', {
                brightness_score: 'not_measured_mvp',
                face_detected: 'not_measured_mvp'
            });
            if (yunnAnalyticsState.uploadAttemptCount > 1) {
                trackYunnEvent('skin_photo_multiple_attempts', {
                    attempt_count: yunnAnalyticsState.uploadAttemptCount
                });
            }
        };
        reader.onerror = function() {
            trackYunnEvent('skin_photo_upload_fail', {
                error_type: 'file_read_error'
            });
        };
        reader.readAsDataURL(file);
    } else {
        trackYunnEvent('skin_photo_upload_cancel', {
            cancel_stage: 'file_picker'
        });
    }
}

// 옵션 카드 클릭 → 자동 다음 스텝
document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (this.classList.contains('checkbox-card')) {
            const cb = this.querySelector('input[type="checkbox"]');
            const nextCheckedState = !cb.checked;
            cb.checked = !cb.checked;
            if (cb.checked) {
                this.classList.add('selected');
            } else {
                this.classList.remove('selected');
            }
            trackInputSelection(cb, '', cb.value, nextCheckedState);
            updateStepActionState(currentStep);
            return;
        }

        const radio = this.querySelector('input[type="radio"]');
        if (radio) {
            const step = this.closest('.survey-step');
            const previousValue = step.querySelector(`input[name="${radio.name}"]:checked`)?.value || '';
            step.querySelectorAll(`input[name="${radio.name}"]`).forEach(input => {
                input.closest('.option-card')?.classList.remove('selected');
            });
            this.classList.add('selected');
            radio.checked = true;
            trackInputSelection(radio, previousValue, radio.value, true);
            updateStepActionState(currentStep);

            if (currentStep === '2') {
                updateStepTwoState();
                if (isStepTwoComplete()) {
                    setTimeout(() => { goToStep('3'); }, 300);
                }
                return;
            }

            if (currentStep === '7') {
                updateStepSevenState();
                if (isStepSevenComplete()) {
                    setTimeout(() => { goToStep('8'); }, 300);
                }
                return;
            }

            if (currentStep === '8') {
                updateStepEightState();
                if (isStepEightComplete()) {
                    setTimeout(() => { goToStep('9'); }, 300);
                }
                return;
            }

            setTimeout(() => { nextStep(); }, 300);
        }
    });
});

// 스텝1 입력 이벤트
const step1Inputs = document.querySelectorAll('#userName, #userEmail, #userWhatsApp');
step1Inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.id === 'userWhatsApp') {
            input.value = input.value.replace(/\D/g, '').slice(0, 10);
        }
        validateStepOne({ revealEmailError: false, revealPhoneError: false });
    });
});
document.getElementById('userEmail').addEventListener('blur', () => {
    validateStepOne({ revealEmailError: true, revealPhoneError: false });
});
document.getElementById('userWhatsApp').addEventListener('blur', () => {
    validateStepOne({ revealEmailError: false, revealPhoneError: true });
});

// 포토 업로드 analytics 이벤트
const photoUploadContainer = document.querySelector('.photo-upload-container');
const photoUploadInput = document.getElementById('bareFacePhoto');
if (photoUploadContainer) {
    photoUploadContainer.addEventListener('click', () => {
        trackYunnEvent('skin_photo_upload_click', { upload_source: 'photo_upload_container' });
    });
}
if (photoUploadInput) {
    photoUploadInput.addEventListener('click', () => {
        trackYunnEvent('skin_photo_upload_click', { upload_source: 'file_input' });
    });
}
document.querySelectorAll('.step10-actions button').forEach(button => {
    button.addEventListener('click', () => {
        const label = button.innerText.trim().toLowerCase();
        if (label.includes('skip')) {
            trackYunnEvent('skip_photo_click', { photo_uploaded: false });
        } else if (label.includes('complete')) {
            trackYunnEvent('complete_analysis_click', {
                photo_uploaded: Boolean(uploadedSkinPhotoData)
            });
        }
    });
});

// 초기화
updateStepTwoState();
updateStepSevenState();
updateStepEightState();
Object.keys(REQUIRED_STEP_INPUT_GROUPS).forEach(step => updateStepActionState(step));
validateStepOne();

// URL 파라미터 처리
const pageParams = new URLSearchParams(window.location.search);
if (pageParams.has('survey')) {
    if (typeof window.startSurvey === 'function') {
        window.startSurvey();
    } else {
        document.getElementById('intro-screen').classList.remove('active');
        document.getElementById('survey-screen').classList.add('active');
        updateProgress();
        trackSurveyStepView(currentStep);
        window.scrollTo(0, 0);
    }
    const requestedStep = pageParams.get('step');
    if (requestedStep) goToStep(requestedStep);
}

// Next/Back 버튼 이벤트 위임 (data-action="next" / data-action="back")
document.getElementById('assessment-form')?.addEventListener('click', e => {
    const btn = e.target.closest('button[data-action]');
    if (!btn || btn.disabled) return;
    const action = btn.getAttribute('data-action');
    if (action === 'next') nextStep();
    else if (action === 'back') goBack();
});

// 사진 업로드 change 이벤트 (HTML onchange= 제거 대응)
document.getElementById('bareFacePhoto')?.addEventListener('change', previewPhoto);

// window 노출 (하위 호환)
window.nextStep     = nextStep;
window.goBack       = goBack;
window.goToStep     = goToStep;
window.previewPhoto = previewPhoto;
