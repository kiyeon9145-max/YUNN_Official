// SkinType.js — 피부 타입 정의 및 추론 규칙

export const SKIN_TYPES = ['Oily', 'Dry', 'Combination', 'Normal', 'Not Sure'];

export const SKIN_HELPER_STEPS = ['3-1', '3-2', '3-3', '3-4'];

export const REQUIRED_STEP_INPUT_GROUPS = {
    '3':   ['skinType'],
    '3-1': ['skinHelperCleanse'],
    '3-2': ['skinHelperAfterHours'],
    '3-3': ['skinHelperDay'],
    '3-4': ['skinHelperTexture'],
    '4':   ['concerns'],
    '5':   ['trigger'],
    '6':   ['sensitivity'],
    '7':   ['outdoor', 'sunscreen'],
    '8':   ['sleep', 'stress'],
    '9':   ['routineLevel'],
};

export const SKIN_INFERENCE_RULES = {
    DRY_MAX:         1.8,
    OILY_MIN:        4.2,
    COMBINATION_MIN: 2.6,
    T_ZONE_VALUE:    3,
};
