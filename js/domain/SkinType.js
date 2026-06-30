// SkinType.js — 피부 타입 정의 및 설문 스텝별 필수 입력 그룹 규칙
// SurveyService.isStepComplete()가 이 파일을 참조해 "다음" 버튼 활성화 여부를 결정한다.

// ── 피부 타입 목록 ───────────────────────────────────────────────────────────────
// 설문 Step 3에서 사용자에게 보여주는 선택지.
// "Not Sure"를 선택하면 Step 3-1 ~ 3-4 (헬퍼 플로우)로 진입해 피부 타입을 추론한다.
export const SKIN_TYPES = ['Oily', 'Dry', 'Combination', 'Normal', 'Not Sure'];

// Step 3에서 "Not Sure"를 선택했을 때 거치는 보조 질문 스텝 ID 목록.
// 순서가 중요하다 — SurveyScreen이 이 배열 인덱스를 기준으로 앞/뒤 이동을 처리한다.
export const SKIN_HELPER_STEPS = ['3-1', '3-2', '3-3', '3-4'];

// ── 스텝별 필수 입력 그룹 맵 ─────────────────────────────────────────────────────
// 각 스텝에서 최소 한 번 이상 선택해야 하는 radio/checkbox name 목록.
// SurveyService.isStepComplete()가 이 맵을 순회하며 모든 그룹에 응답이 있는지 확인한다.
// Step 1(텍스트 입력)과 Step 2(복합 조건)는 별도 함수로 처리하므로 여기서 제외된다.
export const REQUIRED_STEP_INPUT_GROUPS = {
    '3':   ['skinType'],           // 피부 타입 선택
    '3-1': ['skinHelperCleanse'],  // 세안 후 피부 느낌 (헬퍼 Q1)
    '3-2': ['skinHelperAfterHours'], // 몇 시간 후 유분 발생 (헬퍼 Q2)
    '3-3': ['skinHelperDay'],      // 하루 중 피부 상태 변화 (헬퍼 Q3)
    '3-4': ['skinHelperTexture'],  // 피부 질감 (헬퍼 Q4)
    '4':   ['concerns'],           // 주요 피부 고민
    '5':   ['trigger'],            // 피부 트러블 원인
    '6':   ['sensitivity'],        // 피부 민감도
    '7':   ['outdoor', 'sunscreen'], // 외출 시간 + 선크림 사용 빈도 (두 항목 모두 필수)
    '8':   ['sleep', 'stress'],    // 수면 시간 + 스트레스 수준 (두 항목 모두 필수)
    '9':   ['routineLevel'],       // 현재 스킨케어 루틴 단계
};

// ── 헬퍼 플로우 피부 타입 추론 기준값 ────────────────────────────────────────────
// SurveyService.inferSkinTypeFromHelper()가 4개 헬퍼 질문의 평균값과 이 기준을 비교해
// Dry / Oily / Combination / Normal 중 하나를 자동으로 결정한다.
// 각 헬퍼 질문의 value는 1(매우 건성)~5(매우 지성) 스케일로 설계되어 있다.
export const SKIN_INFERENCE_RULES = {
    DRY_MAX:         1.8,  // 평균 ≤ 1.8이면 건성(Dry)
    OILY_MIN:        4.2,  // 평균 ≥ 4.2이면 지성(Oily)
    COMBINATION_MIN: 2.6,  // 평균 > 2.6이고 T존 패턴(value=3)이 있으면 복합성(Combination)
    T_ZONE_VALUE:    3,    // 헬퍼 응답 중 value=3이 하나라도 있으면 T존 패턴으로 간주
};
