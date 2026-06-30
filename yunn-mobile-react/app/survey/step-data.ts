// step-data.ts — 설문 각 스텝의 질문·선택지 데이터
//
// 값은 반드시 js/domain/SurveyAnswer.js 및 pages/survey.html의 option value와 동일하게 유지한다.
// ResultService, AnalyticsService가 이 값을 키로 사용하기 때문에 임의로 변경하지 않는다.
//
// 구현된 스텝 데이터만 export한다. 스텝 추가 시 이 파일에만 추가하면 된다.

import type { OptionGroup } from './components/survey-component'
import type { ImageOptionItem } from './components/image-survey-component'

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

// ── Step 3: 피부 타입 이미지 카드 ──────────────────────────────────────────
export const STEP3_IMAGE_OPTIONS: ImageOptionItem[] = [
  {
    value: 'Oily',
    title: 'Oily Skin',
    description: 'Shiny face, visible pores, gets greasy easily',
    imageSrc: '/images/oily skin.png',
    imageAlt: 'Oily Skin',
    variant: 'image',
  },
  {
    value: 'Dry',
    title: 'Dry Skin',
    description: 'Feels tight, flaky or rough, looks dull',
    imageSrc: '/images/Dry skin.png',
    imageAlt: 'Dry Skin',
    variant: 'image',
  },
  {
    value: 'Combination',
    title: 'Combination Skin',
    description: 'Oily in the T-zone, dry or normal on cheeks',
    imageSrc: '/images/combination skin .png',
    imageAlt: 'Combination Skin',
    variant: 'image',
  },
  {
    value: 'Normal',
    title: 'Normal Skin',
    description: 'Balanced — not too oily, not too dry',
    imageSrc: '/images/normal skin.png',
    imageAlt: 'Normal Skin',
    variant: 'image',
  },
  {
    value: 'NotSure',
    title: 'Not sure',
    description: "We'll help you figure it out",
    variant: 'not-sure',
  },
]

// ── Step 4: 주요 피부 고민 이미지 카드 ─────────────────────────────────────
export const STEP4_IMAGE_OPTIONS: ImageOptionItem[] = [
  {
    value: 'Acne',
    title: 'Acne / Breakouts',
    description: 'Active pimples, redness, inflamed bumps',
    imageSrc: '/images/Acne : Breaksout .png',
    imageAlt: 'Acne and breakouts',
    variant: 'image',
  },
  {
    value: 'Acne marks',
    title: 'Acne Marks',
    description: 'Dark spots or marks left after breakouts',
    imageSrc: '/images/Acne Marks.png',
    imageAlt: 'Acne marks',
    variant: 'image',
  },
  {
    value: 'Pigmentation',
    title: 'Pigmentation / Dark Spots',
    description: 'Brown spots, sun spots, or hyperpigmentation',
    imageSrc: '/images/Pigmentation : Dark Spots.png',
    imageAlt: 'Pigmentation and dark spots',
    variant: 'image',
  },
  {
    value: 'Uneven skin tone',
    title: 'Uneven Skin Tone',
    description: 'Dullness, blotchiness, uneven or patchy skin tone',
    imageSrc: '/images/Uneven_skin_tone.png',
    imageAlt: 'Uneven skin tone',
    variant: 'image',
  },
]

// ── Step 5: 피부 악화 트리거 ───────────────────────────────────────────────
export const STEP5_GROUPS: OptionGroup[] = [
  {
    name: 'trigger',
    question: 'Select all that apply.',
    type: 'checkbox',
    options: [
      { value: 'Sun',          label: 'After sun exposure' },
      { value: 'Stress',       label: 'During stressful periods' },
      { value: 'Period',       label: 'Around my period' },
      { value: 'Sleep',        label: "When I don't sleep enough" },
      { value: 'New skincare', label: 'After trying new skincare' },
      { value: 'Same',         label: 'It stays the same most of the time' },
    ],
  },
]

// ── Step 6: 피부 민감도 ───────────────────────────────────────────────────
export const STEP6_GROUPS: OptionGroup[] = [
  {
    name: 'sensitivity',
    question: 'Choose the closest one.',
    options: [
      { value: 'Rarely',         label: 'Rarely reacts' },
      { value: 'Sometimes',      label: 'Sometimes gets irritated' },
      { value: 'Easily',         label: 'Reacts easily' },
      { value: 'Very sensitive', label: 'Very sensitive to products' },
    ],
  },
]

// ── Step 9: 현재 루틴 수준 ────────────────────────────────────────────────
export const STEP9_GROUPS: OptionGroup[] = [
  {
    name: 'routineLevel',
    question: 'Choose your current routine level.',
    options: [
      { value: 'Nothing',   label: "Nothing — I don't have one" },
      { value: 'Wash only', label: "I wash my face, that's it" },
      { value: 'Basic',     label: 'A basic routine (1-2 products)' },
      { value: 'Multi',     label: 'A multi-step routine (3+ products)' },
    ],
  },
]

// ── Step 7, 8: 구현 시 여기에 추가 ────────────────────────────────────────
