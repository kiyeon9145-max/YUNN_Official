// SurveyScreen.js — 설문 네비게이션, 스텝 전환, 사진 업로드

import { REQUIRED_STEP_INPUT_GROUPS, SKIN_HELPER_STEPS } from '../domain/SkinType.js';
import {
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

const TOTAL_STEPS = 10;
const DISPLAYED_PAGES = 10;

export class SurveyScreen {
    #currentStep = '1';
    #skinHelperCompleted = false;
    #uploadedSkinPhotoData = '';
    #resultScreen = null;

    #progressBar = null;
    #steps = null;

    setDeps(resultScreen) {
        this.#resultScreen = resultScreen;
    }

    init() {
        this.#progressBar = document.getElementById('progress-bar');
        this.#steps = document.querySelectorAll('.survey-step');
        this.#initState();
        this.#bindEvents();
        this.#handleUrlParams();
    }

    updateProgress() {
        const isHelper = SKIN_HELPER_STEPS.includes(String(this.#currentStep));
        const displayStep = isHelper
            ? String(this.#currentStep)
            : String(Math.min(Number(this.#currentStep), DISPLAYED_PAGES));
        const progressStep = isHelper ? 3 : Math.min(Number(this.#currentStep), DISPLAYED_PAGES);
        this.#progressBar.style.width = (progressStep / DISPLAYED_PAGES) * 100 + '%';
        const indicator = document.getElementById('step-indicator');
        if (indicator) {
            indicator.innerText = isHelper
                ? 'Page ' + displayStep
                : 'Page ' + displayStep + ' of ' + DISPLAYED_PAGES;
        }
    }

    goToStep(step) {
        const target = String(step);
        if (!document.querySelector(`.survey-step[data-step="${target}"]`)) return;
        emitCurrentScreenTime('step_change');
        this.#steps.forEach(s => s.classList.remove('active'));
        document.querySelector(`.survey-step[data-step="${target}"]`).classList.add('active');
        this.#currentStep = target;
        window.currentStep = target;
        this.updateProgress();
        updateStepActionState(target);
        trackSurveyStepView(target);
        window.scrollTo(0, 0);
    }

    #isSkinHelperStep(step = this.#currentStep) {
        return SKIN_HELPER_STEPS.includes(String(step));
    }

    #isHelperStepComplete() {
        const active = document.querySelector(`.survey-step[data-step="${this.#currentStep}"]`);
        return Boolean(active?.querySelector('input[type="radio"]:checked'));
    }

    #nextStep() {
        trackStepNextClick(this.#currentStep);

        if (this.#currentStep === '1') {
            if (!validateStepOne({ revealEmailError: true, revealPhoneError: true })) {
                trackYunnEvent('next_button_disabled_click', {
                    missing_fields: ['name', 'email', 'phone'].filter(f => {
                        if (f === 'name')  return !document.getElementById('userName').value.trim();
                        if (f === 'email') return !isValidIndianMvpEmail(document.getElementById('userEmail').value);
                        return !/^[6-9]\d{9}$/.test(document.getElementById('userWhatsApp').value.trim());
                    })
                });
                alert("Please fill out all fields.");
                return;
            }
        }

        if (this.#currentStep === '2' && !isStepTwoComplete()) {
            trackYunnEvent('next_button_disabled_click', {
                missing_selection: ['gender', 'age'].filter(n => !document.querySelector(`input[name="${n}"]:checked`))
            });
            alert("Please select your gender and age.");
            return;
        }

        if (this.#currentStep === '3') {
            const selected = document.querySelector('input[name="skinType"]:checked')?.value;
            if (!selected) { alert("Please select your skin type."); return; }
            if (selected === 'NotSure') { this.goToStep('3-1'); return; }
        }

        const guards = {
            '4': ['concerns', "Please select your biggest skin concern."],
            '5': ['trigger',  "Please select at least one trigger."],
            '6': ['sensitivity', "Please choose one option."],
            '9': ['routineLevel', "Please choose one option."],
        };
        if (guards[this.#currentStep]) {
            const [name, msg] = guards[this.#currentStep];
            if (!document.querySelector(`input[name="${name}"]:checked`)) {
                trackYunnEvent('next_button_disabled_click', { missing_selection: [name] });
                alert(msg);
                return;
            }
        }

        if (this.#currentStep === '7' && !isStepSevenComplete()) {
            trackYunnEvent('next_button_disabled_click', {
                missing_selection: ['outdoor', 'sunscreen'].filter(n => !document.querySelector(`input[name="${n}"]:checked`))
            });
            alert("Please answer both sun habit questions.");
            return;
        }

        if (this.#currentStep === '8' && !isStepEightComplete()) {
            trackYunnEvent('next_button_disabled_click', {
                missing_selection: ['sleep', 'stress'].filter(n => !document.querySelector(`input[name="${n}"]:checked`))
            });
            alert("Please answer both lifestyle questions.");
            return;
        }

        if (this.#isSkinHelperStep()) {
            if (!this.#isHelperStepComplete()) {
                trackYunnEvent('next_button_disabled_click', { missing_selection: [`skinHelper:${this.#currentStep}`] });
                alert("Please choose one option.");
                return;
            }
            const idx = SKIN_HELPER_STEPS.indexOf(this.#currentStep);
            if (idx < SKIN_HELPER_STEPS.length - 1) {
                this.goToStep(SKIN_HELPER_STEPS[idx + 1]);
            } else {
                inferSkinTypeFromHelper();
                this.#skinHelperCompleted = true;
                this.goToStep('4');
            }
            return;
        }

        if (Number(this.#currentStep) === TOTAL_STEPS) {
            this.#startAnalysis();
        } else {
            this.goToStep(String(Number(this.#currentStep) + 1));
        }
    }

    #goBack() {
        trackStepBackClick(this.#currentStep);
        if (this.#isSkinHelperStep()) {
            const idx = SKIN_HELPER_STEPS.indexOf(this.#currentStep);
            this.goToStep(idx === 0 ? '3' : SKIN_HELPER_STEPS[idx - 1]);
        } else if (Number(this.#currentStep) > 1) {
            const prev = this.#currentStep === '4' && this.#skinHelperCompleted
                ? '3-4'
                : String(Number(this.#currentStep) - 1);
            this.goToStep(prev);
        } else {
            document.getElementById('survey-screen').classList.remove('active');
            document.getElementById('intro-screen').classList.add('active');
        }
    }

    #startAnalysis() {
        sendToSheet(collectSurveyPayload(getSessionId()));
        const surveyValues = getCurrentStepSelectedValues('10');
        trackYunnEvent('photo_upload_conversion', { upload_completed: Boolean(this.#uploadedSkinPhotoData) });
        trackYunnEvent('analysis_completion_success', { all_answers_completed: true });
        trackYunnEvent('survey_complete', {
            user_id: getSessionId(),
            final_step: this.#currentStep,
            skin_type: surveyValues.skinType || '',
            skin_concern: surveyValues.concerns || '',
            photo_uploaded: Boolean(this.#uploadedSkinPhotoData)
        });
        emitCurrentScreenTime('analysis_start');
        document.getElementById('survey-screen').style.display = 'none';
        document.getElementById('analysis-screen').style.display = 'block';
        markAnalyticsScreen('analysis');

        const messages = [
            "Analysing skin concern patterns...",
            "Mapping daily environment...",
            "Calibrating routine intensity...",
            "Finalising your plan..."
        ];
        let i = 0;
        const interval = setInterval(() => {
            document.getElementById('cycling-status').innerText = messages[i % messages.length];
            i++;
            if (i === 4) {
                clearInterval(interval);
                this.#resultScreen?.show();
            }
        }, 600);
    }

    #previewPhoto(event) {
        const file = event.target.files[0];
        yunnAnalyticsState.uploadStartedAt = Date.now();
        yunnAnalyticsState.uploadAttemptCount += 1;
        if (!file) {
            trackYunnEvent('skin_photo_upload_cancel', { cancel_stage: 'file_picker' });
            return;
        }
        trackYunnEvent('skin_photo_upload_start', {
            file_type: file.type || 'unknown',
            device_type: window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop',
            attempt_count: yunnAnalyticsState.uploadAttemptCount
        });
        const reader = new FileReader();
        reader.onload = (e) => {
            this.#uploadedSkinPhotoData = e.target.result;
            window.uploadedSkinPhotoData = this.#uploadedSkinPhotoData;
            const preview = document.getElementById('photo-preview');
            preview.src = this.#uploadedSkinPhotoData;
            preview.style.display = 'block';
            trackYunnEvent('skin_photo_upload_success', {
                file_size: file.size,
                file_type: file.type || 'unknown',
                upload_duration_sec: Math.max(0, Math.round((Date.now() - yunnAnalyticsState.uploadStartedAt) / 1000))
            });
            trackYunnEvent('skin_photo_quality_check', { brightness_score: 'not_measured_mvp', face_detected: 'not_measured_mvp' });
            if (yunnAnalyticsState.uploadAttemptCount > 1) {
                trackYunnEvent('skin_photo_multiple_attempts', { attempt_count: yunnAnalyticsState.uploadAttemptCount });
            }
        };
        reader.onerror = () => trackYunnEvent('skin_photo_upload_fail', { error_type: 'file_read_error' });
        reader.readAsDataURL(file);
    }

    #initState() {
        window.currentStep = this.#currentStep;
        window.uploadedSkinPhotoData = '';
        document.getElementById('btn-next-2') && (document.getElementById('btn-next-2').disabled = !isStepTwoComplete());
        document.getElementById('btn-next-7') && (document.getElementById('btn-next-7').disabled = !isStepSevenComplete());
        document.getElementById('btn-next-8') && (document.getElementById('btn-next-8').disabled = !isStepEightComplete());
        Object.keys(REQUIRED_STEP_INPUT_GROUPS).forEach(step => updateStepActionState(step));
        validateStepOne();
    }

    #bindEvents() {
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (card.classList.contains('checkbox-card')) {
                    const cb = card.querySelector('input[type="checkbox"]');
                    cb.checked = !cb.checked;
                    card.classList.toggle('selected', cb.checked);
                    trackInputSelection(cb, '', cb.value, cb.checked);
                    updateStepActionState(this.#currentStep);
                    return;
                }

                const radio = card.querySelector('input[type="radio"]');
                if (!radio) return;
                const stepEl = card.closest('.survey-step');
                const previousValue = stepEl.querySelector(`input[name="${radio.name}"]:checked`)?.value || '';
                stepEl.querySelectorAll(`input[name="${radio.name}"]`).forEach(input => {
                    input.closest('.option-card')?.classList.remove('selected');
                });
                card.classList.add('selected');
                radio.checked = true;
                trackInputSelection(radio, previousValue, radio.value, true);
                updateStepActionState(this.#currentStep);

                const autoAdvanceSteps = {
                    '2': () => {
                        const btn = document.getElementById('btn-next-2');
                        if (btn) btn.disabled = !isStepTwoComplete();
                        if (isStepTwoComplete()) setTimeout(() => this.goToStep('3'), 300);
                    },
                    '7': () => {
                        const btn = document.getElementById('btn-next-7');
                        if (btn) btn.disabled = !isStepSevenComplete();
                        if (isStepSevenComplete()) setTimeout(() => this.goToStep('8'), 300);
                    },
                    '8': () => {
                        const btn = document.getElementById('btn-next-8');
                        if (btn) btn.disabled = !isStepEightComplete();
                        if (isStepEightComplete()) setTimeout(() => this.goToStep('9'), 300);
                    },
                };
                if (autoAdvanceSteps[this.#currentStep]) {
                    autoAdvanceSteps[this.#currentStep]();
                } else {
                    setTimeout(() => this.#nextStep(), 300);
                }
            });
        });

        document.querySelectorAll('#userName, #userEmail, #userWhatsApp').forEach(input => {
            input.addEventListener('input', () => {
                if (input.id === 'userWhatsApp') {
                    input.value = input.value.replace(/\D/g, '').slice(0, 10);
                }
                validateStepOne({ revealEmailError: false, revealPhoneError: false });
            });
        });
        document.getElementById('userEmail')?.addEventListener('blur', () => {
            validateStepOne({ revealEmailError: true, revealPhoneError: false });
        });
        document.getElementById('userWhatsApp')?.addEventListener('blur', () => {
            validateStepOne({ revealEmailError: false, revealPhoneError: true });
        });

        document.querySelector('.photo-upload-container')?.addEventListener('click', () => {
            trackYunnEvent('skin_photo_upload_click', { upload_source: 'photo_upload_container' });
        });
        document.getElementById('bareFacePhoto')?.addEventListener('click', () => {
            trackYunnEvent('skin_photo_upload_click', { upload_source: 'file_input' });
        });
        document.getElementById('bareFacePhoto')?.addEventListener('change', e => this.#previewPhoto(e));

        document.querySelectorAll('.step10-actions button').forEach(button => {
            button.addEventListener('click', () => {
                const label = button.innerText.trim().toLowerCase();
                if (label.includes('skip')) {
                    trackYunnEvent('skip_photo_click', { photo_uploaded: false });
                } else if (label.includes('complete')) {
                    trackYunnEvent('complete_analysis_click', { photo_uploaded: Boolean(this.#uploadedSkinPhotoData) });
                }
            });
        });

        document.getElementById('assessment-form')?.addEventListener('click', e => {
            const btn = e.target.closest('button[data-action]');
            if (!btn || btn.disabled) return;
            const action = btn.getAttribute('data-action');
            if (action === 'next') this.#nextStep();
            else if (action === 'back') this.#goBack();
        });
    }

    #handleUrlParams() {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('survey')) return;
        document.getElementById('intro-screen').classList.remove('active');
        document.getElementById('survey-screen').classList.add('active');
        this.updateProgress();
        trackSurveyStepView(this.#currentStep);
        window.scrollTo(0, 0);
        const requestedStep = params.get('step');
        if (requestedStep) this.goToStep(requestedStep);
    }
}
