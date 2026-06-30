'use client'

// survey/page.tsx — 설문 SPA 오케스트레이터
//
// 구현된 스텝: intro → 1 → 2
// 추후 구현 순서: 4/5/6/9 → 7/8 → 3(branch) → 10 → Analysis/Result
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
import { STEP2_GROUPS } from './step-data'

// ── 답변 타입 ──────────────────────────────────────────────────────────────
interface SurveyAnswers {
  name?: string
  email?: string
  phone?: string
  gender?: string
  age?: string
  // 이후 스텝 답변 필드 추가 예정
}

type SurveyStep = 'intro' | '1' | '2'

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
              // Step 3이 구현되면: setStep('3')
              console.log('[Step2] 완료:', ans)
            }}
            onBack={() => setStep('1')}
          />
        </SurveyShell>
      )}
    </>
  )
}
