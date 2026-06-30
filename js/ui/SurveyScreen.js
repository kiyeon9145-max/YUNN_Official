// SurveyScreen.js — 설문 스텝 네비게이션, 화면 전환, 사진 업로드 처리
// 10개 스텝 + 4개 헬퍼 스텝(3-1~3-4)으로 구성된 설문 SPA의 UI 흐름을 담당한다.
// 유효성 검사는 SurveyService, 분석 이벤트는 AnalyticsService, 저장은 SheetRepository에 위임한다.

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

// 실제 설문 스텝 수 (헬퍼 스텝 제외). #nextStep의 마지막 스텝 판별에 사용.
const TOTAL_STEPS = 10;
// 프로그레스 바 계산 기준 페이지 수 (헬퍼 스텝도 3번으로 표시).
const DISPLAYED_PAGES = 10;

export class SurveyScreen {
    #currentStep = '1';           // 현재 활성 스텝 ID (문자열로 관리 — '3-1' 등 서브스텝 때문)
    #skinHelperCompleted = false; // 헬퍼 플로우(3-1~3-4)를 거쳐 Step 4로 넘어왔는지 여부
    #uploadedSkinPhotoData = '';  // Step 10 피부 사진 데이터 URL (FileReader 결과)
    #resultScreen = null;         // 설문 완료 후 결과 화면으로 전환하기 위해 참조

    #progressBar = null;          // 상단 프로그레스 바 DOM 요소
    #steps = null;                // 모든 .survey-step 요소 목록 (NodeList)

    // ResultScreen 의존성을 주입받는다. 설문 완료 후 ResultScreen.show()를 호출하기 위해 필요하다.
    setDeps(resultScreen) {
        this.#resultScreen = resultScreen;
    }

    // DOM 요소를 캐싱하고 초기 상태 설정 및 이벤트 바인딩을 실행한다.
    init() {
        this.#progressBar = document.getElementById('progress-bar');
        this.#steps = document.querySelectorAll('.survey-step');
        this.#initState();
        this.#bindEvents();
        this.#handleUrlParams();
    }

    // 프로그레스 바 너비와 "Page N of 10" 인디케이터 텍스트를 현재 스텝에 맞게 갱신한다.
    // 헬퍼 스텝(3-1~3-4)은 Step 3으로 표시해 사용자에게 "몇 페이지 더 남음" 혼란을 줄인다.
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

    // 지정된 스텝으로 직접 이동한다.
    // 이전 스텝의 체류 시간을 먼저 기록한 뒤, active 클래스를 교체하고 Analytics를 발행한다.
    // window.currentStep을 전역에 노출해 AnalyticsService가 현재 스텝을 참조할 수 있게 한다.
    goToStep(step) {
        const target = String(step);
        if (!document.querySelector(`.survey-step[data-step="${target}"]`)) return;
        emitCurrentScreenTime('step_change'); // 이전 스텝 체류 시간 기록
        this.#steps.forEach(s => s.classList.remove('active'));
        document.querySelector(`.survey-step[data-step="${target}"]`).classList.add('active');
        this.#currentStep = target;
        window.currentStep = target; // AnalyticsService와 SurveyService가 참조하는 전역 값
        this.updateProgress();
        updateStepActionState(target); // 해당 스텝의 '다음' 버튼 활성화 상태 갱신
        trackSurveyStepView(target);
        window.scrollTo(0, 0);
    }

    // 현재 스텝이 헬퍼 플로우(3-1~3-4) 중 하나인지 확인한다.
    #isSkinHelperStep(step = this.#currentStep) {
        return SKIN_HELPER_STEPS.includes(String(step));
    }

    // 현재 헬퍼 스텝에서 라디오 버튼이 선택됐는지 확인한다.
    #isHelperStepComplete() {
        const active = document.querySelector(`.survey-step[data-step="${this.#currentStep}"]`);
        return Boolean(active?.querySelector('input[type="radio"]:checked'));
    }

    // '다음' 버튼 클릭 또는 라디오 선택 후 자동 진행 시 호출되는 네비게이션 핵심 함수.
    // 각 스텝별 유효성 검사를 통과해야 다음으로 이동하며, 실패 시 alert로 안내한다.
    #nextStep() {
        trackStepNextClick(this.#currentStep); // 다음 버튼 클릭 이벤트 기록

        // Step 1: 이름·이메일·전화번호 모두 유효해야 한다. 여기서만 에러 메시지를 공개한다.
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

        // Step 2: 성별과 나이 모두 선택돼야 한다.
        if (this.#currentStep === '2' && !isStepTwoComplete()) {
            trackYunnEvent('next_button_disabled_click', {
                missing_selection: ['gender', 'age'].filter(n => !document.querySelector(`input[name="${n}"]:checked`))
            });
            alert("Please select your gender and age.");
            return;
        }

        // Step 3: "Not Sure" 선택 시 헬퍼 플로우(3-1)로 분기한다.
        if (this.#currentStep === '3') {
            const selected = document.querySelector('input[name="skinType"]:checked')?.value;
            if (!selected) { alert("Please select your skin type."); return; }
            if (selected === 'NotSure') { this.goToStep('3-1'); return; }
        }

        // Step 4, 5, 6, 9: 필수 선택 항목 가드.
        // 객체 맵으로 처리해 반복 코드를 줄인다.
        const guards = {
            '4': ['concerns',     "Please select your biggest skin concern."],
            '5': ['trigger',      "Please select at least one trigger."],
            '6': ['sensitivity',  "Please choose one option."],
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

        // Step 7: 외출 시간 + 선크림 두 항목 모두 선택돼야 한다.
        if (this.#currentStep === '7' && !isStepSevenComplete()) {
            trackYunnEvent('next_button_disabled_click', {
                missing_selection: ['outdoor', 'sunscreen'].filter(n => !document.querySelector(`input[name="${n}"]:checked`))
            });
            alert("Please answer both sun habit questions.");
            return;
        }

        // Step 8: 수면 + 스트레스 두 항목 모두 선택돼야 한다.
        if (this.#currentStep === '8' && !isStepEightComplete()) {
            trackYunnEvent('next_button_disabled_click', {
                missing_selection: ['sleep', 'stress'].filter(n => !document.querySelector(`input[name="${n}"]:checked`))
            });
            alert("Please answer both lifestyle questions.");
            return;
        }

        // 헬퍼 플로우(3-1~3-4): 마지막 헬퍼 스텝이면 피부 타입을 추론하고 Step 4로 이동한다.
        if (this.#isSkinHelperStep()) {
            if (!this.#isHelperStepComplete()) {
                trackYunnEvent('next_button_disabled_click', { missing_selection: [`skinHelper:${this.#currentStep}`] });
                alert("Please choose one option.");
                return;
            }
            const idx = SKIN_HELPER_STEPS.indexOf(this.#currentStep);
            if (idx < SKIN_HELPER_STEPS.length - 1) {
                this.goToStep(SKIN_HELPER_STEPS[idx + 1]); // 다음 헬퍼 스텝으로
            } else {
                inferSkinTypeFromHelper(); // 4개 응답으로 피부 타입 자동 선택
                this.#skinHelperCompleted = true;
                this.goToStep('4');
            }
            return;
        }

        // 마지막 스텝(Step 10)이면 분석 화면으로 전환하고, 그 외에는 다음 번호 스텝으로 이동한다.
        if (Number(this.#currentStep) === TOTAL_STEPS) {
            this.#startAnalysis();
        } else {
            this.goToStep(String(Number(this.#currentStep) + 1));
        }
    }

    // '뒤로' 버튼 클릭 처리.
    // 헬퍼 플로우 중이면 헬퍼 스텝 내에서 뒤로 이동하고, Step 1에서 뒤로 가면 인트로 화면으로 돌아간다.
    // Step 4에서 뒤로 가면서 헬퍼를 거쳤다면 헬퍼의 마지막 스텝(3-4)으로 돌아간다.
    #goBack() {
        trackStepBackClick(this.#currentStep);
        if (this.#isSkinHelperStep()) {
            const idx = SKIN_HELPER_STEPS.indexOf(this.#currentStep);
            this.goToStep(idx === 0 ? '3' : SKIN_HELPER_STEPS[idx - 1]);
        } else if (Number(this.#currentStep) > 1) {
            const prev = this.#currentStep === '4' && this.#skinHelperCompleted
                ? '3-4' // 헬퍼를 거쳐 Step 4로 왔다면 3-4로 복귀
                : String(Number(this.#currentStep) - 1);
            this.goToStep(prev);
        } else {
            // Step 1에서 뒤로: 설문 화면 제거, 인트로 화면 복귀
            document.getElementById('survey-screen').classList.remove('active');
            document.getElementById('intro-screen').classList.add('active');
        }
    }

    // 설문 완료 후 분석 화면을 표시하고, 데이터를 Google Sheets로 전송한다.
    // 600ms 간격으로 4개 분석 메시지를 순환 표시하며 AI 분석 중인 것처럼 연출한다.
    // 마지막 메시지 후 ResultScreen.show()를 호출해 결과 화면으로 전환한다.
    #startAnalysis() {
        sendToSheet(collectSurveyPayload(getSessionId())); // 설문 데이터를 Google Sheets로 전송
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
        emitCurrentScreenTime('analysis_start'); // 마지막 스텝 체류 시간 기록

        // 설문 화면을 숨기고 분석 화면을 표시한다.
        document.getElementById('survey-screen').style.display = 'none';
        document.getElementById('analysis-screen').style.display = 'block';
        markAnalyticsScreen('analysis');

        // 4개 메시지를 600ms 간격으로 순환 표시해 분석 진행 중임을 시각적으로 표현한다.
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
                this.#resultScreen?.show(); // 4번째 메시지 후 결과 화면 표시
            }
        }, 600);
    }

    // Step 10의 피부 사진 파일을 선택했을 때 미리보기를 표시하고 Analytics 이벤트를 기록한다.
    // FileReader로 이미지를 Data URL로 변환해 <img> 태그에 직접 표시한다.
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
            window.uploadedSkinPhotoData = this.#uploadedSkinPhotoData; // AnalyticsService 참조용 전역 노출
            const preview = document.getElementById('photo-preview');
            preview.src = this.#uploadedSkinPhotoData;
            preview.style.display = 'block';
            trackYunnEvent('skin_photo_upload_success', {
                file_size: file.size,
                file_type: file.type || 'unknown',
                upload_duration_sec: Math.max(0, Math.round((Date.now() - yunnAnalyticsState.uploadStartedAt) / 1000))
            });
            trackYunnEvent('skin_photo_quality_check', { brightness_score: 'not_measured_mvp', face_detected: 'not_measured_mvp' });
            // 여러 번 시도했다면 재시도 횟수를 기록한다.
            if (yunnAnalyticsState.uploadAttemptCount > 1) {
                trackYunnEvent('skin_photo_multiple_attempts', { attempt_count: yunnAnalyticsState.uploadAttemptCount });
            }
        };
        reader.onerror = () => trackYunnEvent('skin_photo_upload_fail', { error_type: 'file_read_error' });
        reader.readAsDataURL(file);
    }

    // 앱 시작 시 버튼 상태를 초기화한다.
    // 다중 선택(Step 7, 8)과 모든 필수 그룹 스텝의 버튼을 비활성화 상태로 설정한다.
    #initState() {
        window.currentStep = this.#currentStep;
        window.uploadedSkinPhotoData = '';
        document.getElementById('btn-next-2') && (document.getElementById('btn-next-2').disabled = !isStepTwoComplete());
        document.getElementById('btn-next-7') && (document.getElementById('btn-next-7').disabled = !isStepSevenComplete());
        document.getElementById('btn-next-8') && (document.getElementById('btn-next-8').disabled = !isStepEightComplete());
        Object.keys(REQUIRED_STEP_INPUT_GROUPS).forEach(step => updateStepActionState(step));
        validateStepOne(); // Step 1 버튼 상태도 초기 검사
    }

    // 설문 전체 이벤트 리스너를 등록한다.
    // option-card 클릭, 텍스트 입력 검증, 사진 업로드, next/back 버튼을 처리한다.
    #bindEvents() {
        // ── 옵션 카드 클릭 이벤트 ────────────────────────────────────────────────
        // checkbox-card와 radio-card 두 가지 타입을 처리한다.
        // 클릭 이벤트를 카드 레벨에서 잡아 input change 이벤트와 충돌하지 않도록 한다.
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // checkbox-card: toggle 방식으로 선택/해제한다.
                if (card.classList.contains('checkbox-card')) {
                    const cb = card.querySelector('input[type="checkbox"]');
                    cb.checked = !cb.checked;
                    card.classList.toggle('selected', cb.checked);
                    trackInputSelection(cb, '', cb.value, cb.checked);
                    updateStepActionState(this.#currentStep);
                    return;
                }

                // radio-card: 같은 name 그룹의 기존 선택을 해제하고 현재 카드를 선택한다.
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

                // 자동 진행 스텝: 두 항목이 모두 선택됐을 때 300ms 딜레이 후 자동으로 다음 스텝으로 이동한다.
                // Step 2, 7, 8은 두 항목 모두 필요하므로 완료 여부를 확인 후 진행한다.
                // 딜레이 300ms: 선택 시각적 피드백(selected 클래스 CSS)을 사용자가 볼 수 있도록 한다.
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
                    // 그 외 단일 선택 스텝: 바로 다음으로 이동한다.
                    setTimeout(() => this.#nextStep(), 300);
                }
            });
        });

        // ── Step 1 텍스트 입력 이벤트 ────────────────────────────────────────────
        // 입력 중에는 에러를 표시하지 않고, 포커스 해제(blur) 시에만 에러를 공개한다.
        document.querySelectorAll('#userName, #userEmail, #userWhatsApp').forEach(input => {
            input.addEventListener('input', () => {
                // 전화번호: 숫자만 허용, 10자리로 자른다.
                if (input.id === 'userWhatsApp') {
                    input.value = input.value.replace(/\D/g, '').slice(0, 10);
                }
                validateStepOne({ revealEmailError: false, revealPhoneError: false });
            });
        });
        // blur 이벤트에서만 각 필드의 에러를 표시한다.
        document.getElementById('userEmail')?.addEventListener('blur', () => {
            validateStepOne({ revealEmailError: true, revealPhoneError: false });
        });
        document.getElementById('userWhatsApp')?.addEventListener('blur', () => {
            validateStepOne({ revealEmailError: false, revealPhoneError: true });
        });

        // ── Step 10 사진 업로드 이벤트 ───────────────────────────────────────────
        document.querySelector('.photo-upload-container')?.addEventListener('click', () => {
            trackYunnEvent('skin_photo_upload_click', { upload_source: 'photo_upload_container' });
        });
        document.getElementById('bareFacePhoto')?.addEventListener('click', () => {
            trackYunnEvent('skin_photo_upload_click', { upload_source: 'file_input' });
        });
        document.getElementById('bareFacePhoto')?.addEventListener('change', e => this.#previewPhoto(e));

        // Step 10 하단 버튼('Skip'/'Complete Analysis')의 의도를 Analytics로 구분한다.
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

        // ── 폼 내 next/back 버튼 이벤트 ─────────────────────────────────────────
        // data-action 속성으로 버튼 역할을 구분해 단일 리스너로 처리한다.
        document.getElementById('assessment-form')?.addEventListener('click', e => {
            const btn = e.target.closest('button[data-action]');
            if (!btn || btn.disabled) return;
            const action = btn.getAttribute('data-action');
            if (action === 'next') this.#nextStep();
            else if (action === 'back') this.#goBack();
        });
    }

    // URL에 ?survey 파라미터가 있으면 인트로를 건너뛰고 설문을 바로 표시한다.
    // ?step=3 등으로 특정 스텝으로 직접 진입할 수도 있다 (개발/QA 용도).
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
