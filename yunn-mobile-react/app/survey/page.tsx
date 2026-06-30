'use client'

// survey/page.tsx — 설문 SPA 오케스트레이터
//
// 구현된 스텝: intro → 1 → 2 → 3 → 4 → 5 → 6 → 9
// 추후 구현 순서: 3 helper branch → 7/8 → 10 → Analysis/Result
//
// 컴포넌트 구조:
//   input-component   → Step 1 (텍스트 입력: 이름/이메일/전화)
//   survey-component  → Step 2~9 (옵션 카드 선택 패턴 공용)
//   SurveyShell       → 설문 공통 껍데기 (상태바 + 헤더 + 프로그레스 바)

import { useState } from 'react'
import IntroScreen from './screens/IntroScreen'
import SurveyShell from './screens/SurveyShell'
import InputStep from './components/input-component'
import SurveyOptionStep from './components/survey-component'
import ImageSurveyStep from './components/image-survey-component'
import {
  STEP2_GROUPS,
  STEP3_IMAGE_OPTIONS,
  STEP4_IMAGE_OPTIONS,
  STEP5_GROUPS,
  STEP6_GROUPS,
  STEP9_GROUPS,
} from './step-data'

// ── 답변 타입 ──────────────────────────────────────────────────────────────
interface SurveyAnswers {
  name?: string
  email?: string
  phone?: string
  gender?: string
  age?: string
  skinType?: string
  concerns?: string
  trigger?: string[]
  sensitivity?: string
  routineLevel?: string
  // 이후 Step 3 helper/7/8/10 답변 필드 추가 예정
}

type SurveyStep = 'intro' | '1' | '2' | '3' | '4' | '5' | '6' | '9'

// ── 페이지 ─────────────────────────────────────────────────────────────────
export default function SurveyPage() {
  const [step, setStep] = useState<SurveyStep>('intro')
  const [answers, setAnswers] = useState<SurveyAnswers>({})
  void answers // 추후 결과 화면에 전달 예정

  const merge = (partial: Partial<SurveyAnswers>) =>
    setAnswers(prev => ({ ...prev, ...partial }))

  return (
    <>
      {/* ── 인트로 ──────────────────────────────────────────────── */}
      {step === 'intro' && (
        <IntroScreen onStart={() => setStep('1')} />
      )}

      {/* ── Step 1: 이름 / 이메일 / 전화번호 ────────────────────── */}
      {step === '1' && (
        <SurveyShell currentStep={1} totalSteps={10}>
          <InputStep
            onNext={ans => { merge(ans); setStep('2') }}
            onBack={() => setStep('intro')}
          />
        </SurveyShell>
      )}

      {/* ── Step 2: 성별 + 연령 ──────────────────────────────────── */}
      {step === '2' && (
        <SurveyShell currentStep={2} totalSteps={10}>
          <SurveyOptionStep
            title={<>Tell us <span className="text-primary">about you.</span></>}
            subtitle="Gender and age help us refine your routine."
            groups={STEP2_GROUPS}
            autoAdvance
            showSecure
            requiredMessage="Please select your gender and age."
            onNext={ans => {
              merge({ gender: ans.gender as string, age: ans.age as string })
              setStep('3')
            }}
            onBack={() => setStep('1')}
          />
        </SurveyShell>
      )}

      {/* ── Step 3: 피부 타입 이미지 카드 ───────────────────────── */}
      {step === '3' && (
        <SurveyShell currentStep={3} totalSteps={10}>
          <ImageSurveyStep
            title={<>Let&apos;s understand<br /><span className="text-primary">your skin</span></>}
            subtitle="This helps us create the perfect routine for you."
            question="Which one feels most like your skin?"
            helperText="There’s no right or wrong answer"
            options={STEP3_IMAGE_OPTIONS}
            showSecure
            requiredMessage="Please select your skin type."
            onNext={value => {
              merge({ skinType: value })
              // NotSure helper branch가 구현되면 value === 'NotSure'일 때 Step 3-1로 보낸다.
              setStep('4')
            }}
            onBack={() => setStep('2')}
          />
        </SurveyShell>
      )}

      {/* ── Step 4: 주요 피부 고민 ──────────────────────────────── */}
      {step === '4' && (
        <SurveyShell currentStep={4} totalSteps={10}>
          <ImageSurveyStep
            title={<>What&apos;s bothering<br /><span className="text-primary">your skin</span> the most?</>}
            subtitle={<>Select your biggest skin concern.<br />This helps us create a routine that targets your main priority.</>}
            options={STEP4_IMAGE_OPTIONS}
            showSecure
            requiredMessage="Please select your biggest skin concern."
            onNext={value => {
              merge({ concerns: value })
              setStep('5')
            }}
            onBack={() => setStep('3')}
          />
        </SurveyShell>
      )}

      {/* ── Step 5: 피부 악화 트리거 ─────────────────────────────── */}
      {step === '5' && (
        <SurveyShell currentStep={5} totalSteps={10}>
          <SurveyOptionStep
            title={<>When does<br /><span className="text-primary">your skin</span> get worse?</>}
            subtitle="Triggers help us understand your skin better."
            groups={STEP5_GROUPS}
            showSecure
            requiredMessage="Please select at least one skin trigger."
            onNext={ans => {
              merge({ trigger: ans.trigger as string[] })
              setStep('6')
            }}
            onBack={() => setStep('4')}
          />
        </SurveyShell>
      )}

      {/* ── Step 6: 피부 민감도 ─────────────────────────────────── */}
      {step === '6' && (
        <SurveyShell currentStep={6} totalSteps={10}>
          <SurveyOptionStep
            title={<>How reactive<br />is <span className="text-primary">your skin?</span></>}
            subtitle="This helps us personalize the right ingredients and strength for your skin."
            groups={STEP6_GROUPS}
            showSecure
            requiredMessage="Please select your skin sensitivity."
            onNext={ans => {
              merge({ sensitivity: ans.sensitivity as string })
              // Step 7/8이 구현되면: setStep('7')
              setStep('9')
            }}
            onBack={() => setStep('5')}
          />
        </SurveyShell>
      )}

      {/* ── Step 9: 현재 스킨케어 루틴 수준 ─────────────────────── */}
      {step === '9' && (
        <SurveyShell currentStep={9} totalSteps={10}>
          <SurveyOptionStep
            title={<>What does your<br /><span className="text-primary">skincare routine</span><br />look like right now?</>}
            groups={STEP9_GROUPS}
            showSecure
            requiredMessage="Please select your current routine level."
            onNext={ans => {
              merge({ routineLevel: ans.routineLevel as string })
              // Step 10이 구현되면: setStep('10')
            }}
            // Step 7/8이 구현되면: setStep('8')
            onBack={() => setStep('6')}
          />
        </SurveyShell>
      )}
    </>
  )
}
