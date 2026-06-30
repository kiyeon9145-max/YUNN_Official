// ResultService.js — 피부 밸런스 계산, 결과 설정 조합, HTML 생성 유틸
// DOM 조작과 GTM 전송은 하지 않는다. 데이터를 받아 계산값을 반환하는 순수 함수 모음.

import { RESULT_RECOMMENDATION_CONFIG, RESULT_TYPE_PROFILES } from '../domain/RoutineConfig.js';
import { readPendingResult } from '../repository/SurveyRepository.js';

// XSS 방어를 위해 HTML 특수문자를 이스케이프한다.
// 사용자 이름 등 외부 입력값을 innerHTML에 주입하기 전에 반드시 이 함수를 거쳐야 한다.
// null/undefined는 빈 문자열로 처리한다.
export function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));
}

// 복수 선택된 concerns 중 대표 고민 타입을 우선순위에 따라 반환한다.
// 우선순위: Pigmentation > Uneven skin tone > Acne marks > Acne
// 이 우선순위는 결과 화면에서 가장 임상적으로 중요한 고민을 먼저 다루기 위함이다.
// 아무것도 체크되지 않으면 빈 문자열을 반환한다.
export function getPrimaryConcernType() {
    const checked = [...document.querySelectorAll('input[name="concerns"]:checked')];
    const values = checked.map(input => input.value);
    if (values.includes('Pigmentation')) return 'Pigmentation';
    if (values.includes('Uneven skin tone')) return 'Tone';
    if (values.includes('Acne marks')) return 'Marks';
    if (values.includes('Acne')) return 'Acne';
    return '';
}

// 결과 화면 렌더링에 필요한 설문 데이터를 조합한다.
// DOM에서 직접 읽은 값을 우선하고, 없으면 localStorage(readPendingResult)에서 복원한다.
// 이중 소스 전략으로 피드백 게이트 완료 후 복귀 시에도 결과를 올바르게 표시할 수 있다.
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

// "skinType|concernType" 키로 RESULT_RECOMMENDATION_CONFIG와 RESULT_TYPE_PROFILES를 합쳐
// 해당 피부 타입·고민 조합의 전체 설정 객체를 반환한다.
// 매칭되는 키가 없으면 기본값 'Oily|Acne'를 사용한다.
export function getResultConfig(data) {
    const key = `${data.skinType}|${data.concernType}`;
    const baseConfig = RESULT_RECOMMENDATION_CONFIG[key] || RESULT_RECOMMENDATION_CONFIG['Oily|Acne'];
    return {
        ...baseConfig,
        ...(RESULT_TYPE_PROFILES[key] || RESULT_TYPE_PROFILES['Oily|Acne'])
    };
}

// 피부 밸런스 지수 값(0~100)을 상태 레이블로 변환한다.
// 78 이상: Good (초록), 52~77: Needs Care (주황), 51 이하: Focus (빨강)
export function getBalanceStatus(value) {
    if (value >= 78) return 'Good';
    if (value >= 52) return 'Needs Care';
    return 'Focus';
}

// 6개 피부 밸런스 지표를 계산해 배열로 반환한다.
// 각 지표는 기준값(base)에서 시작해 피부 타입·고민·생활 습관에 따라 가감된다.
// config.balanceAdjust: 피부 타입별 조정값 (예: Oily → oil -12)
// 생활 습관 페널티: 수면 부족(-7), 고스트레스(-8), 선크림 미사용(-8)
// 최솟값 28, 최댓값 92로 클램핑해 극단값을 방지한다.
export function computeSkinBalance(data, config) {
    const adjust = config.balanceAdjust || {};
    const metrics = [
        { key: 'hydration',   label: 'Hydration Level',          base: 70 },
        { key: 'barrier',     label: 'Skin Barrier Resilience',   base: 78 },
        // 색소 고민(Pigmentation/Tone)이면 기준값을 낮춰 더 낮은 상태임을 강조한다.
        { key: 'pigment',     label: 'Pigmentation Tendency',     base: data.concernType === 'Pigmentation' || data.concernType === 'Tone' ? 42 : 62 },
        // 매우 민감한 피부면 기준값을 낮춰 calmness 지수가 낮게 계산된다.
        { key: 'calmness',    label: 'Skin Calmness',             base: data.sensitivity === 'Very sensitive' ? 46 : 60 },
        // 지성 피부면 oil balance 기준값이 낮다 (이미 조정값으로 추가 감소됨).
        { key: 'oil',         label: 'Oil Balance',               base: data.skinType === 'Oily' ? 58 : 72 },
        // 외출이 많으면 환경 스트레스 기준값을 낮게 시작한다.
        { key: 'environment', label: 'Environmental Stress',      base: data.outdoor === '3h+' ? 48 : 64 }
    ];

    return metrics.map(metric => {
        let value = metric.base + (adjust[metric.key] || 0);
        if (data.sleep === 'Under 5h') value -= 7;       // 수면 부족 페널티
        if (data.stress === 'Very high') value -= 8;     // 고스트레스 페널티
        if (data.sunscreen === 'Rarely') value -= 8;     // 선크림 미사용 페널티
        value = Math.max(28, Math.min(92, Math.round(value))); // 범위 클램핑
        return { ...metric, value, status: getBalanceStatus(value) };
    });
}

// 결과 요약 텍스트를 HTML 문자열로 변환한다.
// config.summaryParagraphs가 있으면 배열 항목을 각각 <p>로 감싸고,
// 없으면 config.summary 문자열을 문장 단위로 분리해 동일하게 처리한다.
// config.focus 키워드가 포함된 문장에서 해당 키워드를 <strong>으로 강조한다.
// 사용자 입력이 아닌 config 데이터지만, 향후 CMS 연동 가능성을 고려해 escapeHTML을 적용한다.
export function formatResultSummary(config) {
    const focus = config.focus || '';
    const paragraphs = Array.isArray(config.summaryParagraphs)
        ? config.summaryParagraphs
        : [];

    // summaryParagraphs가 없으면 summary 문자열을 문장 부호 기준으로 자동 분리한다.
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
        // focus 키워드가 포함된 경우 해당 부분을 <strong>으로 강조한다.
        if (focus && paragraph.includes(focus)) {
            safeParagraph = safeParagraph.replace(
                escapeHTML(focus),
                `<strong>${escapeHTML(focus)}</strong>`
            );
        }
        return `<p>${safeParagraph}</p>`;
    }).join('');
}
