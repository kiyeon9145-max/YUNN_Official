// ResultService.js — 피부 밸런스 계산, 결과 설정 조합

import { RESULT_RECOMMENDATION_CONFIG, RESULT_TYPE_PROFILES } from '../domain/RoutineConfig.js';
import { readPendingResult } from '../repository/SurveyRepository.js';

export function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));
}

export function getPrimaryConcernType() {
    const checked = [...document.querySelectorAll('input[name="concerns"]:checked')];
    const values = checked.map(input => input.value);
    if (values.includes('Pigmentation')) return 'Pigmentation';
    if (values.includes('Uneven skin tone')) return 'Tone';
    if (values.includes('Acne marks')) return 'Marks';
    if (values.includes('Acne')) return 'Acne';
    return '';
}

export function getResultSurveyData() {
    const saved = readPendingResult();
    const genderValue = document.querySelector('input[name="gender"]:checked')?.value || 'Female';
    const skinType = document.querySelector('input[name="skinType"]:checked')?.value || saved.skinType || 'Oily';
    return {
        name: document.getElementById('userName')?.value.trim() || saved.name || 'Guest',
        gender: document.querySelector('input[name="gender"]:checked')?.value || saved.gender || genderValue,
        skinType,
        concernType: getPrimaryConcernType() || saved.concernType || 'Acne',
        age: document.querySelector('input[name="age"]:checked')?.value || saved.age || '',
        sleep: document.querySelector('input[name="sleep"]:checked')?.value || saved.sleep || '',
        stress: document.querySelector('input[name="stress"]:checked')?.value || saved.stress || '',
        sensitivity: document.querySelector('input[name="sensitivity"]:checked')?.value || saved.sensitivity || '',
        outdoor: document.querySelector('input[name="outdoor"]:checked')?.value || saved.outdoor || '',
        sunscreen: document.querySelector('input[name="sunscreen"]:checked')?.value || saved.sunscreen || ''
    };
}

export function getResultConfig(data) {
    const key = `${data.skinType}|${data.concernType}`;
    const baseConfig = RESULT_RECOMMENDATION_CONFIG[key] || RESULT_RECOMMENDATION_CONFIG['Oily|Acne'];
    return {
        ...baseConfig,
        ...(RESULT_TYPE_PROFILES[key] || RESULT_TYPE_PROFILES['Oily|Acne'])
    };
}

export function getBalanceStatus(value) {
    if (value >= 78) return 'Good';
    if (value >= 52) return 'Needs Care';
    return 'Focus';
}

export function computeSkinBalance(data, config) {
    const adjust = config.balanceAdjust || {};
    const metrics = [
        { key: 'hydration', label: 'Hydration Level', base: 70 },
        { key: 'barrier', label: 'Skin Barrier Resilience', base: 78 },
        { key: 'pigment', label: 'Pigmentation Tendency', base: data.concernType === 'Pigmentation' || data.concernType === 'Tone' ? 42 : 62 },
        { key: 'calmness', label: 'Skin Calmness', base: data.sensitivity === 'Very sensitive' ? 46 : 60 },
        { key: 'oil', label: 'Oil Balance', base: data.skinType === 'Oily' ? 58 : 72 },
        { key: 'environment', label: 'Environmental Stress', base: data.outdoor === '3h+' ? 48 : 64 }
    ];

    return metrics.map(metric => {
        let value = metric.base + (adjust[metric.key] || 0);
        if (data.sleep === 'Under 5h') value -= 7;
        if (data.stress === 'Very high') value -= 8;
        if (data.sunscreen === 'Rarely') value -= 8;
        value = Math.max(28, Math.min(92, Math.round(value)));
        return { ...metric, value, status: getBalanceStatus(value) };
    });
}

export function formatResultSummary(config) {
    const focus = config.focus || '';
    const paragraphs = Array.isArray(config.summaryParagraphs)
        ? config.summaryParagraphs
        : [];

    const safeParagraphs = paragraphs.length ? paragraphs : (() => {
        const extracted = [];
        String(config.summary || '').replace(/[^.!?]+[.!?]+|[^.!?]+$/g, match => {
            const trimmed = match.trim();
            if (trimmed) extracted.push(trimmed);
            return match;
        });
        return extracted;
    })();

    return safeParagraphs.map(paragraph => {
        let safeParagraph = escapeHTML(paragraph);
        if (focus && paragraph.includes(focus)) {
            safeParagraph = safeParagraph.replace(
                escapeHTML(focus),
                `<strong>${escapeHTML(focus)}</strong>`
            );
        }
        return `<p>${safeParagraph}</p>`;
    }).join('');
}
