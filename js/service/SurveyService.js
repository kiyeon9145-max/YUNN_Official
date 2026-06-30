// SurveyService.js — 설문 스텝 유효성 검사, 피부 타입 추론, 설문 페이로드 수집
// DOM을 읽어 현재 선택 상태를 검사하는 순수 함수 모음.
// 저장·GTM 전송은 하지 않는다. 검사 결과(boolean 또는 값)만 반환한다.

import { REQUIRED_STEP_INPUT_GROUPS } from '../domain/SkinType.js';
import { ALLOWED_INDIAN_EMAIL_DOMAINS } from '../domain/SurveyAnswer.js';
import { getSessionId } from '../repository/SessionRepository.js';

// 지정한 name 속성을 가진 radio 또는 checkbox 중 하나 이상이 선택됐는지 확인한다.
// REQUIRED_STEP_INPUT_GROUPS의 그룹 이름을 인자로 받아 isStepComplete에서 반복 호출된다.
export function hasAnsweredInputGroup(groupName) {
    return Boolean(document.querySelector(`input[name="${groupName}"]:checked`));
}

// Step 2(성별 + 나이)가 모두 선택됐는지 확인한다.
// Step 2는 두 항목 모두 필수이므로 별도 함수로 처리한다.
export function isStepTwoComplete() {
    return Boolean(
        document.querySelector('input[name="gender"]:checked') &&
        document.querySelector('input[name="age"]:checked')
    );
}

// Step 7(외출 시간 + 선크림)이 모두 선택됐는지 확인한다.
export function isStepSevenComplete() {
    return Boolean(
        document.querySelector('input[name="outdoor"]:checked') &&
        document.querySelector('input[name="sunscreen"]:checked')
    );
}

// Step 8(수면 + 스트레스)이 모두 선택됐는지 확인한다.
export function isStepEightComplete() {
    return Boolean(
        document.querySelector('input[name="sleep"]:checked') &&
        document.querySelector('input[name="stress"]:checked')
    );
}

// 지정된 스텝의 모든 필수 항목이 응답됐는지 확인한다.
// 'next' 버튼 활성화 여부와 클릭 시 가드 모두 이 함수를 사용한다.
// Step 1, 2, 7, 8은 복합 조건이므로 전용 함수로 위임하고, 나머지는 REQUIRED_STEP_INPUT_GROUPS를 사용.
// requiredGroups가 없는 스텝(Step 10 등)은 항상 true를 반환해 이동을 막지 않는다.
export function isStepComplete(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const stepKey = String(step);
    if (stepKey === '1') return validateStepOne();
    if (stepKey === '2') return isStepTwoComplete();
    const requiredGroups = REQUIRED_STEP_INPUT_GROUPS[stepKey];
    if (!requiredGroups) return true;
    return requiredGroups.every(hasAnsweredInputGroup);
}

// 현재 스텝의 primary 버튼(.btn-primary)을 DOM에서 찾아 반환한다.
// 찾지 못하면 null. updateStepActionState에서 disabled 상태를 조작할 때 사용한다.
export function getStepPrimaryButton(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const activeStep = document.querySelector(`.survey-step[data-step="${String(step)}"]`);
    return activeStep ? activeStep.querySelector('.btn-primary') : null;
}

// 현재 스텝 완료 여부에 따라 primary 버튼의 disabled 상태를 갱신한다.
// 라디오/체크박스 클릭 이벤트가 발생할 때마다 SurveyScreen이 이 함수를 호출한다.
export function updateStepActionState(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const button = getStepPrimaryButton(step);
    if (!button) return;
    button.disabled = !isStepComplete(step);
}

// 이메일 주소를 소문자·공백 제거로 정규화해 반환한다.
// isValidIndianMvpEmail에서 대소문자 구분 없이 검증하기 위해 먼저 적용된다.
export function normalizeEmail(value) {
    return value.trim().toLowerCase();
}

// 인도 MVP 이메일 유효성을 검사한다. 아래 조건을 모두 만족해야 true를 반환한다:
// 1) 빈 문자열이 아님
// 2) 내부 공백 없음
// 3) ASCII 문자만 포함
// 4) @ 기준 local + domain 두 부분으로 정확히 분리
// 5) local 파트: 영숫자·점·%·+·- 만 허용, 시작/끝에 특수문자 불가, 연속 점(..) 불가
// 6) domain 파트: 영숫자·점·하이픈 만 허용, 연속 점 불가, TLD 2자 이상
// 7) ALLOWED_INDIAN_EMAIL_DOMAINS 목록에 포함된 도메인만 허용
export function isValidIndianMvpEmail(value) {
    const email = normalizeEmail(value);
    if (!email) return false;
    if (/\s/.test(value.trim())) return false; // 내부 공백 불가
    if (/[^\x00-\x7F]/.test(email)) return false; // 비 ASCII 불가

    const parts = email.split('@');
    if (parts.length !== 2) return false;

    const [local, domain] = parts;
    if (!local || !domain) return false;
    if (!/^[a-z0-9._%+-]+$/.test(local)) return false;
    if (!/^[a-z0-9.-]+$/.test(domain)) return false;
    if (/^[._%+-]|[._%+-]$/.test(local)) return false; // 시작/끝 특수문자 불가
    if (local.includes('..') || domain.includes('..')) return false; // 연속 점 불가
    if (!domain.includes('.')) return false; // 최소 1개의 점 필요

    const domainLabels = domain.split('.');
    if (domainLabels.some(label => !label || label.startsWith('-') || label.endsWith('-'))) return false;

    const tld = domainLabels[domainLabels.length - 1];
    if (!/^[a-z]{2,}$/.test(tld)) return false; // TLD는 영문자 2자 이상
    if (!ALLOWED_INDIAN_EMAIL_DOMAINS.includes(domain)) return false; // 허용 도메인 목록 검사

    return true;
}

// 텍스트 입력 필드(input)에 유효성 상태 클래스를 토글한다.
// 가장 가까운 .step-one-card 부모 요소에 is-valid / is-invalid 클래스를 적용한다.
// state: 'valid', 'invalid', '' (빈 문자열이면 두 클래스 모두 제거)
export function setFieldState(input, state) {
    const card = input.closest('.step-one-card');
    if (!card) return;
    card.classList.toggle('is-valid', state === 'valid');
    card.classList.toggle('is-invalid', state === 'invalid');
}

// Step 1(이름, 이메일, 전화번호)의 전체 유효성을 검사하고 버튼 상태를 업데이트한다.
// options.revealEmailError=true 일 때만 이메일 필드에 invalid 클래스를 표시한다.
// options.revealPhoneError=true 일 때만 전화 필드에 invalid 클래스를 표시한다.
// → 포커스 해제(blur) 전까지는 에러 표시를 억제해 UX 마찰을 줄인다.
// 유효성 통과 여부(boolean)를 반환하므로 nextStep 가드에서도 사용된다.
export function validateStepOne(options = {}) {
    const revealEmailError = Boolean(options.revealEmailError);
    const revealPhoneError = Boolean(options.revealPhoneError);
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const phoneInput = document.getElementById('userWhatsApp');
    const btnNext1 = document.getElementById('btn-next-1');

    const nameValid  = nameInput.value.trim().length >= 2;
    const emailValid = isValidIndianMvpEmail(emailInput.value);
    const phoneValid = /^[6-9]\d{9}$/.test(phoneInput.value.trim());

    // 이름: 항상 실시간으로 is-valid 클래스를 표시한다.
    setFieldState(nameInput, nameValid ? 'valid' : '');

    // 전화: valid이면 즉시 표시. invalid는 revealPhoneError=true이고 값이 있을 때만 표시.
    if (phoneValid) {
        setFieldState(phoneInput, 'valid');
    } else if (revealPhoneError && phoneInput.value.trim()) {
        setFieldState(phoneInput, 'invalid');
        if (typeof window.trackYunnEvent === 'function') {
            window.trackYunnEvent('validation_error', {
                field_name: 'phone',
                error_type: 'invalid_indian_phone_number'
            });
        }
    } else {
        setFieldState(phoneInput, '');
    }

    // 이메일: valid이면 즉시 표시. invalid는 revealEmailError=true이고 값이 있을 때만 표시.
    if (emailValid) {
        setFieldState(emailInput, 'valid');
    } else if (revealEmailError && emailInput.value.trim()) {
        setFieldState(emailInput, 'invalid');
        if (typeof window.trackYunnEvent === 'function') {
            window.trackYunnEvent('validation_error', {
                field_name: 'email',
                error_type: 'invalid_email_format_or_domain'
            });
        }
    } else {
        setFieldState(emailInput, '');
    }

    // 세 항목 모두 valid일 때만 '다음' 버튼을 활성화한다.
    if (btnNext1) btnNext1.disabled = !(nameValid && emailValid && phoneValid);
    return nameValid && emailValid && phoneValid;
}

// 헬퍼 플로우(Step 3-1 ~ 3-4)의 응답을 분석해 피부 타입을 자동 추론한다.
// 4개 질문 응답값(1~5 스케일)의 평균과 T존 패턴 여부를 기준으로 Dry/Oily/Combination/Normal 결정.
// 결정된 타입에 해당하는 skinType 라디오 버튼을 자동으로 체크하고 'selected' 클래스를 추가한다.
// 추론된 타입 문자열을 반환한다.
export function inferSkinTypeFromHelper() {
    const values = ['skinHelperCleanse', 'skinHelperAfterHours', 'skinHelperDay', 'skinHelperTexture']
        .map(name => Number(document.querySelector(`input[name="${name}"]:checked`)?.value || 0));
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
    const hasTZonePattern = values.includes(3); // value=3이 하나라도 있으면 T존 패턴
    let inferredType = 'Normal';

    if (avg <= 1.8) {
        inferredType = 'Dry';
    } else if (avg >= 4.2) {
        inferredType = 'Oily';
    } else if (hasTZonePattern || (avg > 2.6 && avg < 4.2)) {
        inferredType = 'Combination';
    }

    // Step 3에서 해당 skinType 라디오를 자동 선택 상태로 만든다.
    const targetInput = document.querySelector(`input[name="skinType"][value="${inferredType}"]`);
    if (targetInput) {
        document.querySelectorAll('input[name="skinType"]').forEach(input => {
            input.checked = false;
            input.closest('.option-card')?.classList.remove('selected');
        });
        targetInput.checked = true;
        targetInput.closest('.option-card')?.classList.add('selected');
    }

    return inferredType;
}

// 현재 DOM에서 설문 응답을 읽어 Google Sheets 전송용 객체를 조합한다.
// sessionId는 호출부(SurveyScreen)에서 주입해 이 함수의 DOM 의존성을 최소화한다.
// 응답이 없는 항목은 빈 문자열('')로 처리해 Sheets에서 빈 셀로 저장된다.
export function collectSurveyPayload(sessionId) {
    return {
        name:          document.getElementById('userName')?.value.trim()                          || '',
        email:         document.getElementById('userEmail')?.value.trim()                         || '',
        phone:         document.getElementById('userWhatsApp')?.value.trim()                      || '',
        gender:        document.querySelector('input[name="gender"]:checked')?.value              || '',
        age:           document.querySelector('input[name="age"]:checked')?.value                 || '',
        skinType:      document.querySelector('input[name="skinType"]:checked')?.value            || '',
        // checkbox 다중 선택값은 쉼표로 연결해 단일 문자열로 만든다.
        concerns:      [...document.querySelectorAll('input[name="concerns"]:checked')].map(i => i.value).join(', ') || '',
        triggers:      [...document.querySelectorAll('input[name="trigger"]:checked')].map(i => i.value).join(', ')  || '',
        sensitivity:   document.querySelector('input[name="sensitivity"]:checked')?.value         || '',
        outdoor:       document.querySelector('input[name="outdoor"]:checked')?.value             || '',
        sunscreen:     document.querySelector('input[name="sunscreen"]:checked')?.value           || '',
        sleep:         document.querySelector('input[name="sleep"]:checked')?.value               || '',
        stress:        document.querySelector('input[name="stress"]:checked')?.value              || '',
        routineLevel:  document.querySelector('input[name="routineLevel"]:checked')?.value        || '',
        photo_uploaded: Boolean(window.uploadedSkinPhotoData), // 피부 사진 업로드 여부
        session_id:    sessionId || getSessionId()
    };
}
