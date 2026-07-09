"use client";

// survey/page.tsx — 설문 SPA 오케스트레이터
//
// 구현된 스텝: intro → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10
// 추후 구현 순서: Analysis/Result
//
// 컴포넌트 구조:
//   survey-component  → Step 1, 2, 5~9 (성별/연령/지역 등 옵션 카드 선택 패턴 공용)
//   region-component  → Step 2 (거주 도시, 라디오 5개 + Other 직접입력)
//   image-survey      → Step 3~4 (이미지 카드 선택)
//   photo-step        → Step 10 (피부 사진 업로드/미리보기)
//   SurveyShell       → 설문 공통 껍데기 (헤더 + 프로그레스 바)
//
// 이름/이메일/전화번호 입력 스텝은 app/survey/_archived/에 보관 중 (서비스 오픈 시 복원 예정).

import { useEffect, useState } from "react";
import IntroScreen from "./screens/IntroScreen";
import SurveyShell from "./screens/SurveyShell";
import AnalysisScreen from "./screens/AnalysisScreen";
import ResultScreen from "./screens/ResultScreen";
import SurveyOptionStep from "./components/survey-component";
import RegionStep from "./components/region-component";
import ImageSurveyStep from "./components/image-survey-component";
import PhotoStep from "./components/photo-step-component";
import {
  STEP1_GROUPS,
  STEP3_HELPER_STEPS,
  STEP3_IMAGE_OPTIONS,
  STEP4_IMAGE_OPTIONS,
  STEP5_GROUPS,
  STEP6_GROUPS,
  STEP7_GROUPS,
  STEP8_GROUPS,
  STEP9_GROUPS,
  SKIN_INFERENCE_RULES,
  type SkinHelperStepId,
} from "./step-data";

// ── 답변 타입 ──────────────────────────────────────────────────────────────
export interface SurveyAnswers {
  // 이름/이메일/전화는 현재 설문에서 수집하지 않는다 (app/survey/_archived/ 참조).
  // ResultScreen이 기본값으로 폴백하므로 필드 자체는 남겨둔다.
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  gender?: string;
  age?: string;
  skinType?: string;
  skinHelperCleanse?: string;
  skinHelperAfterHours?: string;
  skinHelperDay?: string;
  skinHelperTexture?: string;
  concerns?: string;
  trigger?: string[];
  sensitivity?: string;
  outdoor?: string;
  sunscreen?: string;
  sleep?: string;
  stress?: string;
  routineLevel?: string;
  photoDataUrl?: string;
}

type SurveyStep =
  | "intro"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | SkinHelperStepId
  | "analysis"
  | "result";

function inferSkinTypeFromHelper(answers: SurveyAnswers): string {
  const values = [
    answers.skinHelperCleanse,
    answers.skinHelperAfterHours,
    answers.skinHelperDay,
    answers.skinHelperTexture,
  ].map((value) => Number(value || 0));

  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  const hasTZonePattern = values.includes(SKIN_INFERENCE_RULES.T_ZONE_VALUE);

  if (avg <= SKIN_INFERENCE_RULES.DRY_MAX) return "Dry";
  if (avg >= SKIN_INFERENCE_RULES.OILY_MIN) return "Oily";
  if (
    hasTZonePattern ||
    (avg > SKIN_INFERENCE_RULES.COMBINATION_MIN &&
      avg < SKIN_INFERENCE_RULES.OILY_MIN)
  ) {
    return "Combination";
  }
  return "Normal";
}

// ── 페이지 ─────────────────────────────────────────────────────────────────
export default function SurveyPage() {
  const [step, setStep] = useState<SurveyStep>("intro");
  const [answers, setAnswers] = useState<SurveyAnswers>({});

  const merge = (partial: Partial<SurveyAnswers>) =>
    setAnswers((prev) => ({ ...prev, ...partial }));

  // 스텝 전환 시 이전 화면에서 스크롤한 위치가 남아있지 않도록 맨 위로 리셋한다
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  return (
    <>
      {/* ── 인트로 ──────────────────────────────────────────────── */}
      {step === "intro" && <IntroScreen onStart={() => setStep("1")} />}

      {/* ── Step 1: 성별 + 연령 ──────────────────────────────────── */}
      {step === "1" && (
        <SurveyShell currentStep={1} totalSteps={10}>
          <SurveyOptionStep
            title={
              <>
                Tell us <span className="text-primary">about you.</span>
              </>
            }
            subtitle="Gender and age help us refine your routine."
            groups={STEP1_GROUPS}
            autoAdvance
            showSecure
            requiredMessage="Please select your gender and age."
            onNext={(ans) => {
              merge({ gender: ans.gender as string, age: ans.age as string });
              setStep("2");
            }}
            onBack={() => setStep("intro")}
          />
        </SurveyShell>
      )}

      {/* ── Step 2: 거주 도시(지역) ──────────────────────────────── */}
      {step === "2" && (
        <SurveyShell currentStep={2} totalSteps={10}>
          <RegionStep
            onNext={(ans) => {
              merge({ city: ans.city });
              setStep("3");
            }}
            onBack={() => setStep("1")}
          />
        </SurveyShell>
      )}

      {/* ── Step 3: 피부 타입 이미지 카드 ───────────────────────── */}
      {step === "3" && (
        <SurveyShell currentStep={3} totalSteps={10}>
          <ImageSurveyStep
            title={
              <>
                Let&apos;s understand
                <br />
                <span className="text-primary">your skin</span>
              </>
            }
            subtitle="This helps us create the perfect routine for you."
            question="Which one feels most like your skin?"
            helperText="There’s no right or wrong answer"
            options={STEP3_IMAGE_OPTIONS}
            showSecure
            requiredMessage="Please select your skin type."
            onNext={(value) => {
              merge({ skinType: value });
              setStep(value === "NotSure" ? "3-1" : "4");
            }}
            onBack={() => setStep("2")}
          />
        </SurveyShell>
      )}

      {/* ── Step 3-1 ~ 3-4: Not sure helper flow ───────────────── */}
      {(["3-1", "3-2", "3-3", "3-4"] as SkinHelperStepId[]).map(
        (helperStep) => {
          if (step !== helperStep) return null;
          const helper = STEP3_HELPER_STEPS[helperStep];
          const currentStepNumber = 3;
          const nextStepById: Record<SkinHelperStepId, SurveyStep> = {
            "3-1": "3-2",
            "3-2": "3-3",
            "3-3": "3-4",
            "3-4": "4",
          };
          const backStepById: Record<SkinHelperStepId, SurveyStep> = {
            "3-1": "3",
            "3-2": "3-1",
            "3-3": "3-2",
            "3-4": "3-3",
          };

          return (
            <SurveyShell
              key={helperStep}
              currentStep={currentStepNumber}
              totalSteps={10}
            >
              <SurveyOptionStep
                title={helper.title}
                subtitle={helper.subtitle}
                groups={helper.groups}
                showSecure
                requiredMessage="Please select the option that best describes your skin."
                onNext={(ans) => {
                  const partial = ans as Partial<SurveyAnswers>;
                  const nextAnswers = { ...answers, ...partial };
                  merge(partial);
                  if (helperStep === "3-4") {
                    merge({ skinType: inferSkinTypeFromHelper(nextAnswers) });
                  }
                  setStep(nextStepById[helperStep]);
                }}
                onBack={() => setStep(backStepById[helperStep])}
              />
            </SurveyShell>
          );
        },
      )}

      {/* ── Step 4: 주요 피부 고민 ──────────────────────────────── */}
      {step === "4" && (
        <SurveyShell currentStep={4} totalSteps={10}>
          <ImageSurveyStep
            title={
              <>
                What&apos;s bothering
                <br />
                <span className="text-primary">your skin</span> the most?
              </>
            }
            subtitle={
              <>
                Select your biggest skin concern.
                <br />
                This helps us create a routine that targets your main priority.
              </>
            }
            options={STEP4_IMAGE_OPTIONS}
            showSecure
            requiredMessage="Please select your biggest skin concern."
            onNext={(value) => {
              merge({ concerns: value });
              setStep("5");
            }}
            onBack={() => setStep("3")}
          />
        </SurveyShell>
      )}

      {/* ── Step 5: 피부 악화 트리거 ─────────────────────────────── */}
      {step === "5" && (
        <SurveyShell currentStep={5} totalSteps={10}>
          <SurveyOptionStep
            title={
              <>
                When does
                <br />
                <span className="text-primary">your skin</span> get worse?
              </>
            }
            subtitle="Triggers help us understand your skin better."
            groups={STEP5_GROUPS}
            showSecure
            requiredMessage="Please select at least one skin trigger."
            onNext={(ans) => {
              merge({ trigger: ans.trigger as string[] });
              setStep("6");
            }}
            onBack={() => setStep("4")}
          />
        </SurveyShell>
      )}

      {/* ── Step 6: 피부 민감도 ─────────────────────────────────── */}
      {step === "6" && (
        <SurveyShell currentStep={6} totalSteps={10}>
          <SurveyOptionStep
            title={
              <>
                How reactive
                <br />
                is <span className="text-primary">your skin?</span>
              </>
            }
            subtitle="This helps us personalize the right ingredients and strength for your skin."
            groups={STEP6_GROUPS}
            showSecure
            requiredMessage="Please select your skin sensitivity."
            onNext={(ans) => {
              merge({ sensitivity: ans.sensitivity as string });
              setStep("7");
            }}
            onBack={() => setStep("5")}
          />
        </SurveyShell>
      )}

      {/* ── Step 7: 외출 시간 + 선크림 사용 ─────────────────────── */}
      {step === "7" && (
        <SurveyShell currentStep={7} totalSteps={10}>
          <SurveyOptionStep
            title={
              <>
                How much time do you
                <br />
                spend <span className="text-primary">outdoors?</span>
              </>
            }
            subtitle="This helps us understand your sun exposure and environmental factors."
            groups={STEP7_GROUPS}
            showSecure
            requiredMessage="Please select your outdoor time and sunscreen habit."
            onNext={(ans) => {
              merge({
                outdoor: ans.outdoor as string,
                sunscreen: ans.sunscreen as string,
              });
              setStep("8");
            }}
            onBack={() => setStep("6")}
          />
        </SurveyShell>
      )}

      {/* ── Step 8: 수면 + 스트레스 ─────────────────────────────── */}
      {step === "8" && (
        <SurveyShell currentStep={8} totalSteps={10}>
          <SurveyOptionStep
            title={
              <>
                How much <span className="text-primary">sleep</span>
                <br />
                do you usually get?
              </>
            }
            subtitle="This helps us understand your skin recovery and inflammation patterns."
            groups={STEP8_GROUPS}
            showSecure
            requiredMessage="Please select your sleep and stress level."
            onNext={(ans) => {
              merge({
                sleep: ans.sleep as string,
                stress: ans.stress as string,
              });
              setStep("9");
            }}
            onBack={() => setStep("7")}
          />
        </SurveyShell>
      )}

      {/* ── Step 9: 현재 스킨케어 루틴 수준 ─────────────────────── */}
      {step === "9" && (
        <SurveyShell currentStep={9} totalSteps={10}>
          <SurveyOptionStep
            title={
              <>
                What does your
                <br />
                <span className="text-primary">skincare routine</span>
                <br />
                look like right now?
              </>
            }
            groups={STEP9_GROUPS}
            showSecure
            requiredMessage="Please select your current routine level."
            onNext={(ans) => {
              merge({ routineLevel: ans.routineLevel as string });
              setStep("10");
            }}
            onBack={() => setStep("8")}
          />
        </SurveyShell>
      )}

      {/* ── Step 10: 피부 사진 업로드 ───────────────────────────── */}
      {step === "10" && (
        <SurveyShell currentStep={10} totalSteps={10}>
          <PhotoStep
            onBack={() => setStep("9")}
            onComplete={(photoDataUrl) => {
              merge({ photoDataUrl });
              setStep("analysis");
            }}
            onSkip={() => {
              merge({ photoDataUrl: undefined });
              setStep("analysis");
            }}
          />
        </SurveyShell>
      )}

      {/* ── 분석 로딩 화면 ──────────────────────────────────────── */}
      {step === "analysis" && (
        <AnalysisScreen onComplete={() => setStep("result")} />
      )}

      {/* ── 결과 화면 ────────────────────────────────────────────── */}
      {step === "result" && (
        <ResultScreen answers={answers} onRetake={() => setStep("intro")} />
      )}
    </>
  );
}
