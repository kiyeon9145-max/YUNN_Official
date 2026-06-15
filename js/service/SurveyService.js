// SurveyService.js — 스텝 유효성, 피부 타입 추론, 설문 페이로드 수집

import { REQUIRED_STEP_INPUT_GROUPS } from '../domain/SkinType.js';
import { ALLOWED_INDIAN_EMAIL_DOMAINS } from '../domain/SurveyAnswer.js';
import { getSessionId } from '../repository/SessionRepository.js';

export function hasAnsweredInputGroup(groupName) {
    return Boolean(document.querySelector(`input[name="${groupName}"]:checked`));
}

export function isStepTwoComplete() {
    return Boolean(
        document.querySelector('input[name="gender"]:checked') &&
        document.querySelector('input[name="age"]:checked')
    );
}

export function isStepSevenComplete() {
    return Boolean(
        document.querySelector('input[name="outdoor"]:checked') &&
        document.querySelector('input[name="sunscreen"]:checked')
    );
}

export function isStepEightComplete() {
    return Boolean(
        document.querySelector('input[name="sleep"]:checked') &&
        document.querySelector('input[name="stress"]:checked')
    );
}

export function isStepComplete(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const stepKey = String(step);
    if (stepKey === '1') return validateStepOne();
    if (stepKey === '2') return isStepTwoComplete();
    const requiredGroups = REQUIRED_STEP_INPUT_GROUPS[stepKey];
    if (!requiredGroups) return true;
    return requiredGroups.every(hasAnsweredInputGroup);
}

export function getStepPrimaryButton(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const activeStep = document.querySelector(`.survey-step[data-step="${String(step)}"]`);
    return activeStep ? activeStep.querySelector('.btn-primary') : null;
}

export function updateStepActionState(step) {
    if (step === undefined) step = window.currentStep !== undefined ? String(window.currentStep) : '';
    const button = getStepPrimaryButton(step);
    if (!button) return;
    button.disabled = !isStepComplete(step);
}

export function normalizeEmail(value) {
    return value.trim().toLowerCase();
}

export function isValidIndianMvpEmail(value) {
    const email = normalizeEmail(value);
    if (!email) return false;
    // Removed strict case-sensitive check: if (email !== value.trim()) return false;
    if (/\s/.test(value.trim())) return false; // Ensure no internal spaces
    if (/[^\x00-\x7F]/.test(email)) return false;

    const parts = email.split('@');
    if (parts.length !== 2) return false;

    const [local, domain] = parts;
    if (!local || !domain) return false;
    if (!/^[a-z0-9._%+-]+$/.test(local)) return false;
    if (!/^[a-z0-9.-]+$/.test(domain)) return false;
    if (/^[._%+-]|[._%+-]$/.test(local)) return false;
    if (local.includes('..') || domain.includes('..')) return false;
    if (!domain.includes('.')) return false;

    const domainLabels = domain.split('.');
    if (domainLabels.some(label => !label || label.startsWith('-') || label.endsWith('-'))) return false;

    const tld = domainLabels[domainLabels.length - 1];
    if (!/^[a-z]{2,}$/.test(tld)) return false;
    if (!ALLOWED_INDIAN_EMAIL_DOMAINS.includes(domain)) return false;

    return true;
}

export function setFieldState(input, state) {
    const card = input.closest('.step-one-card');
    if (!card) return;
    card.classList.toggle('is-valid', state === 'valid');
    card.classList.toggle('is-invalid', state === 'invalid');
}

export function validateStepOne(options = {}) {
    const revealEmailError = Boolean(options.revealEmailError);
    const revealPhoneError = Boolean(options.revealPhoneError);
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const phoneInput = document.getElementById('userWhatsApp');
    const btnNext1 = document.getElementById('btn-next-1');

    const nameValid = nameInput.value.trim().length >= 2;
    const emailValid = isValidIndianMvpEmail(emailInput.value);
    const phoneValid = /^[6-9]\d{9}$/.test(phoneInput.value.trim());

    setFieldState(nameInput, nameValid ? 'valid' : '');

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

    if (btnNext1) btnNext1.disabled = !(nameValid && emailValid && phoneValid);
    return nameValid && emailValid && phoneValid;
}

export function inferSkinTypeFromHelper() {
    const values = ['skinHelperCleanse', 'skinHelperAfterHours', 'skinHelperDay', 'skinHelperTexture']
        .map(name => Number(document.querySelector(`input[name="${name}"]:checked`)?.value || 0));
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
    const hasTZonePattern = values.includes(3);
    let inferredType = 'Normal';

    if (avg <= 1.8) {
        inferredType = 'Dry';
    } else if (avg >= 4.2) {
        inferredType = 'Oily';
    } else if (hasTZonePattern || (avg > 2.6 && avg < 4.2)) {
        inferredType = 'Combination';
    }

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

// DOM 읽기만 수행 (sessionId는 호출 측에서 전달)
export function collectSurveyPayload(sessionId) {
    return {
        name:          document.getElementById('userName')?.value.trim()                          || '',
        email:         document.getElementById('userEmail')?.value.trim()                         || '',
        phone:         document.getElementById('userWhatsApp')?.value.trim()                      || '',
        gender:        document.querySelector('input[name="gender"]:checked')?.value              || '',
        age:           document.querySelector('input[name="age"]:checked')?.value                 || '',
        skinType:      document.querySelector('input[name="skinType"]:checked')?.value            || '',
        concerns:      [...document.querySelectorAll('input[name="concerns"]:checked')].map(i => i.value).join(', ') || '',
        triggers:      [...document.querySelectorAll('input[name="trigger"]:checked')].map(i => i.value).join(', ')  || '',
        sensitivity:   document.querySelector('input[name="sensitivity"]:checked')?.value         || '',
        outdoor:       document.querySelector('input[name="outdoor"]:checked')?.value             || '',
        sunscreen:     document.querySelector('input[name="sunscreen"]:checked')?.value           || '',
        sleep:         document.querySelector('input[name="sleep"]:checked')?.value               || '',
        stress:        document.querySelector('input[name="stress"]:checked')?.value              || '',
        routineLevel:  document.querySelector('input[name="routineLevel"]:checked')?.value        || '',
        photo_uploaded: Boolean(window.uploadedSkinPhotoData),
        session_id:    sessionId || getSessionId()
    };
}
