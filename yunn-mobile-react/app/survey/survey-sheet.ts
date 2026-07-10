"use client";

// survey-sheet.ts — React 설문 답변을 Google Sheets용 비식별 row로 정리한다.

import { getSessionId } from "../lib/analytics";
import { sendToSheet, type SheetPayload } from "../lib/sheet-repository";
import { toConcernKey } from "./result-data";
import type { SurveyAnswers } from "./page";

interface SendSurveySheetOptions {
  photoUploaded: boolean;
}

// Sheets 컬럼 순서를 문서처럼 읽을 수 있게 명시한 비식별 설문 완료 schema다.
export const SURVEY_SHEET_COLUMNS = [
  "app_source",
  "app_name",
  "session_id",
  "completed_at",
  "page_path",
  "city",
  "gender",
  "age",
  "skin_type",
  "concern",
  "trigger",
  "sensitivity",
  "outdoor",
  "sunscreen",
  "sleep",
  "stress",
  "routine_level",
  "photo_uploaded",
  "result_skin_type",
  "result_concern_type",
] as const;

// 개인정보 없이 설문 완료 시점의 운영/리서치 필드만 Sheets row로 만든다.
export function buildSurveySheetPayload(
  answers: SurveyAnswers,
  { photoUploaded }: SendSurveySheetOptions,
): SheetPayload {
  const concernType = toConcernKey(answers.concerns || "Acne");

  return {
    app_source: "next",
    app_name: "yunn-mobile-react",
    session_id: getSessionId(),
    completed_at: new Date().toISOString(),
    page_path: typeof window === "undefined" ? "" : window.location.pathname,
    city: answers.city,
    gender: answers.gender,
    age: answers.age,
    skin_type: answers.skinType,
    concern: answers.concerns,
    trigger: answers.trigger ?? [],
    sensitivity: answers.sensitivity,
    outdoor: answers.outdoor,
    sunscreen: answers.sunscreen,
    sleep: answers.sleep,
    stress: answers.stress,
    routine_level: answers.routineLevel,
    photo_uploaded: photoUploaded,
    result_skin_type: answers.skinType,
    result_concern_type: concernType,
  };
}

// 설문 완료 row를 Google Sheets로 전송하고, 실패해도 화면 전환은 계속되게 한다.
export function sendSurveyCompletionToSheet(
  answers: SurveyAnswers,
  options: SendSurveySheetOptions,
) {
  return sendToSheet(buildSurveySheetPayload(answers, options));
}
