"use client";

// analytics.ts — YUNN 어드민 분석 대시보드용 이벤트 트래킹 중앙 모듈
//
// 기획문서(YUNN_어드민대시보드_기획문서.md) 2장 이벤트 스키마를 기준으로 구현.
// 레거시 vanilla 사이트의 js/service/AnalyticsService.js와 동일한 4채널 발행 패턴
// (localStorage 백업 → GTM dataLayer → 원격 endpoint(sendBeacon) → CustomEvent)을
// 그대로 따른다. session_id localStorage 키('yunn_session_id')도 동일하게 재사용해
// 레거시 페이지와 리액트 앱 사이에서 방문자 식별이 끊기지 않게 한다.
//
// REMOTE_ANALYTICS_ENDPOINT는 아직 비어있다 — Supabase 백엔드가 준비되면 이 값만
// 채우면 sendBeacon 경로가 자동으로 활성화된다(코드 변경 불필요).

const SESSION_ID_KEY = "yunn_session_id";
const ANALYTICS_LOG_KEY = "yunn_analytics_events";
const ANALYTICS_LOG_MAX = 1000;
const REMOTE_ANALYTICS_ENDPOINT = "";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

// ── page_id / step 목록 (기획문서 2-3, 3장 기준) ────────────────────────────
export type PageId =
  | "landing"
  | "diagnosis_intro"
  | "routine_am"
  | "routine_pm"
  | "routine_extra"
  | "ingredient_loading"
  | "ingredient_result"
  | "cart"
  | "pricing";

export type RoutineStepId = "am" | "pm" | "extra";

// ── 공통 속성 컨텍스트 (기획문서 2-1) ───────────────────────────────────────
interface AnalyticsContext {
  city: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  skin_concern: string | null;
}

let context: AnalyticsContext = {
  city: null,
  utm_source: null,
  utm_campaign: null,
  skin_concern: null,
};
let urlContextRead = false;

function readUtmFromUrlOnce() {
  if (urlContextRead || typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  context.utm_source = params.get("utm_source") ?? context.utm_source;
  context.utm_campaign = params.get("utm_campaign") ?? context.utm_campaign;
  urlContextRead = true;
}

// city/skin_concern처럼 진단 완료 후에만 채워지는 값은 알게 되는 시점에 이걸로 갱신한다.
export function setAnalyticsContext(partial: Partial<AnalyticsContext>) {
  context = { ...context, ...partial };
}

// ── session_id (레거시 SessionRepository.getSessionId와 동일 정책) ─────────
// localStorage에 최초 1회 생성 후 영구 재사용 — 재방문해도 재생성하지 않는다.
function ensureSessionId(): { id: string; isNew: boolean } {
  if (typeof window === "undefined") return { id: "", isNew: false };
  let id = window.localStorage.getItem(SESSION_ID_KEY);
  let isNew = false;
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? `yunn_${crypto.randomUUID()}`
        : `yunn_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(SESSION_ID_KEY, id);
    isNew = true;
  }
  return { id, isNew };
}

export function getSessionId(): string {
  return ensureSessionId().id;
}

function persistLog(payload: Record<string, unknown>) {
  try {
    const raw = window.localStorage.getItem(ANALYTICS_LOG_KEY);
    const events = raw ? JSON.parse(raw) : [];
    events.push(payload);
    window.localStorage.setItem(
      ANALYTICS_LOG_KEY,
      JSON.stringify(events.slice(-ANALYTICS_LOG_MAX)),
    );
  } catch {
    // 분석 로그 저장은 best-effort — 절대 사용자 흐름을 막지 않는다.
  }
}

function emit(
  eventName: string,
  sessionId: string,
  properties: Record<string, unknown>,
) {
  const payload = {
    event: eventName,
    session_id: sessionId,
    timestamp: new Date().toISOString(),
    city: context.city,
    utm_source: context.utm_source,
    utm_campaign: context.utm_campaign,
    skin_concern: context.skin_concern,
    ...properties,
  };

  persistLog(payload);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (REMOTE_ANALYTICS_ENDPOINT && navigator.sendBeacon) {
    try {
      navigator.sendBeacon(REMOTE_ANALYTICS_ENDPOINT, JSON.stringify(payload));
    } catch {
      // 원격 전송은 best-effort.
    }
  }

  window.dispatchEvent(new CustomEvent("yunn:analytics", { detail: payload }));
  return payload;
}

// ── 핵심 이벤트 발행 함수 (모든 트래킹의 진입점) ────────────────────────────
export function trackYunnEvent(
  eventName: string,
  properties: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return null;
  readUtmFromUrlOnce();
  const { id: sessionId, isNew } = ensureSessionId();
  // session_start는 "최초 유입" 시점에만 발행한다 — 새 session_id가 만들어질 때가 바로 그 시점.
  if (isNew) emit("session_start", sessionId, {});
  return emit(eventName, sessionId, properties);
}

// ── 퍼널 핵심 행동 이벤트 (기획문서 2-2, 3장) ───────────────────────────────
// 아래 중 landing/diagnosis_intro/ingredient_loading/ingredient_result/cart/pricing
// 화면은 아직 리액트 앱에 없어 호출부가 없다. 화면이 만들어지면 그대로 가져다 쓰면 된다.

export function trackDiagnosisStart() {
  return trackYunnEvent("diagnosis_start");
}

export function trackRoutineStepComplete(step: RoutineStepId) {
  return trackYunnEvent("routine_step_complete", { step });
}

export function trackCategoryOptionClick(
  category: string,
  step: RoutineStepId,
) {
  return trackYunnEvent("category_option_click", { category, step });
}

export function trackIngredientResultView(mismatchCount: number) {
  return trackYunnEvent("ingredient_result_view", {
    mismatch_count: mismatchCount,
  });
}

export function trackCartClick(sourcePage: PageId) {
  return trackYunnEvent("cart_click", { source_page: sourcePage });
}

export function trackPricingView() {
  return trackYunnEvent("pricing_view");
}

export function trackPricingClick() {
  return trackYunnEvent("pricing_click");
}

export function trackSubscribeComplete(plan: string) {
  return trackYunnEvent("subscribe_complete", { plan });
}

export function trackRediagnosisComplete() {
  return trackYunnEvent("rediagnosis_complete");
}
