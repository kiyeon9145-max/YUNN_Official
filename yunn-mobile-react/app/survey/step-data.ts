// step-data.ts — 설문 각 스텝의 질문·선택지 데이터
//
// 값은 반드시 js/domain/SurveyAnswer.js 및 pages/survey.html의 option value와 동일하게 유지한다.
// ResultService, AnalyticsService가 이 값을 키로 사용하기 때문에 임의로 변경하지 않는다.
//
// 구현된 스텝 데이터만 export한다. 스텝 추가 시 이 파일에만 추가하면 된다.

import type { OptionGroup } from './components/survey-component'

// ── Step 2: 성별 + 연령 ────────────────────────────────────────────────────
export const STEP2_GROUPS: OptionGroup[] = [
  {
    name: 'gender',
    question: "What's your gender?",
    options: [
      { value: 'Female',            label: 'Female' },
      { value: 'Male',              label: 'Male' },
      { value: 'Prefer not to say', label: 'Prefer not to say' },
    ],
  },
  {
    name: 'age',
    question: 'How old are you?',
    options: [
      { value: '18-24', label: '18 - 24' },
      { value: '25-34', label: '25 - 34' },
      { value: '35-44', label: '35 - 44' },
      { value: '45-54', label: '45 - 54' },
      { value: '55+',   label: '55+' },
    ],
  },
]

// ── Step 4, 5, 6, 7, 8, 9: 구현 시 여기에 추가 ────────────────────────────
