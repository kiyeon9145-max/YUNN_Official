# Backup Policy

YUNN 웹사이트 작업 시 복구 가능성을 유지하기 위한 백업 규칙입니다.

## Rule

1. 큰 UI 변경 전후로 핵심 파일을 `docs/code-backups/YYYY-MM-DD/`에 복사한다.
2. 백업 파일명은 목적이 드러나게 작성한다.
   - 예: `index.figma-home.html`
   - 예: `survey.current-flow.html`
3. 변경 내용은 `docs/IMPLEMENTATION-LOG.md`에 반드시 기록한다.
4. Figma 기준으로 작업한 경우 Figma 프레임 이름도 함께 기록한다.
5. 새 화면 파일을 만들면 해당 파일도 백업 대상에 포함한다.
6. 공식 GitHub 원격 백업 저장소는 `https://github.com/kiyeon9145-max/YUNN_Official_v2.git` 이다.
7. 주요 작업 완료 후에는 로컬 백업과 문서 기록을 먼저 남긴 뒤, 사용자가 요청하거나 Git 인증이 가능한 환경이면 GitHub 원격 저장소에 커밋/푸시한다.
8. 여러 바이브코딩 툴 또는 개발자가 함께 작업할 때는 `docs/GITHUB-COLLABORATION-WORKFLOW.md`의 브랜치/PR/복구 규칙을 따른다.

## Current Backups

Created on 2026-05-18:
- `docs/code-backups/2026-05-18/index.figma-home.html`
- `docs/code-backups/2026-05-18/index.before-logo-status-fix.html`
- `docs/code-backups/2026-05-18/index.logo-status-fixed.html`
- `docs/code-backups/2026-05-18/index.before-new-badge-fix.html`
- `docs/code-backups/2026-05-18/index.new-badge-fixed.html`
- `docs/code-backups/2026-05-18/index.before-login-hero-state.html`
- `docs/code-backups/2026-05-18/index.login-aware-hero.html`
- `docs/code-backups/2026-05-18/index.before-logged-out-hero-layout.html`
- `docs/code-backups/2026-05-18/index.logged-out-hero-layout.html`
- `docs/code-backups/2026-05-18/index.before-logged-out-copy-image-tune.html`
- `docs/code-backups/2026-05-18/index.logged-out-copy-image-tuned.html`
- `docs/code-backups/2026-05-18/index.before-new-badge-typography.html`
- `docs/code-backups/2026-05-18/index.before-hero-image-edge-tune.html`
- `docs/code-backups/2026-05-18/index.hero-image-edge-new-badge-typography.html`
- `docs/code-backups/2026-05-18/index.before-reference-polish.html`
- `docs/code-backups/2026-05-18/index.reference-polish.html`
- `docs/code-backups/2026-05-18/index.before-new-12px.html`
- `docs/code-backups/2026-05-18/index.new-12px.html`
- `docs/code-backups/2026-05-18/login.demo.html`
- `docs/code-backups/2026-05-18/survey.current-flow.html`
- `docs/code-backups/2026-05-18/survey.before-figma-diagnosis-start.html`
- `docs/code-backups/2026-05-18/survey.before-diagnosis-desc-spacing.html`
- `docs/code-backups/2026-05-18/survey.figma-diagnosis-start-spacing.html`
- `docs/code-backups/2026-05-18/survey.before-logo-image-restore.html`
- `docs/code-backups/2026-05-18/survey.logo-image-restored.html`
- `docs/code-backups/2026-05-19/survey.before-logo-status-live.html`
- `docs/code-backups/2026-05-19/survey.logo-status-live.html`
- `docs/code-backups/2026-05-19/survey.before-home-logo-match.html`
- `docs/code-backups/2026-05-19/survey.home-logo-match.html`
- `docs/code-backups/2026-05-19/survey.before-step1-figma-mobile.html`
- `docs/code-backups/2026-05-19/survey.step1-figma-mobile.html`
- `docs/code-backups/2026-05-19/survey.before-status-wifi-icon-fix.html`
- `docs/code-backups/2026-05-19/survey.status-wifi-icon-fixed.html`
- `docs/code-backups/2026-05-19/index.before-shared-network-status.html`
- `docs/code-backups/2026-05-19/index.shared-network-status.html`
- `docs/code-backups/2026-05-19/survey.before-shared-network-status.html`
- `docs/code-backups/2026-05-19/survey.shared-network-status-logo-aligned.html`
- `docs/code-backups/2026-05-19/survey.before-header-icon-spacing.html`
- `docs/code-backups/2026-05-19/survey.header-icon-spacing.html`
- `docs/code-backups/2026-05-19/survey.before-remove-search-icons.html`
- `docs/code-backups/2026-05-19/survey.remove-search-secure-line.html`
- `docs/code-backups/2026-05-19/survey.before-step1-validation.html`
- `docs/code-backups/2026-05-19/survey.step1-validation.html`
- `docs/code-backups/2026-05-19/survey.before-email-domain-allowlist.html`
- `docs/code-backups/2026-05-19/survey.email-domain-allowlist.html`
- `docs/code-backups/2026-05-19/survey.before-phone-validation.html`
- `docs/code-backups/2026-05-19/survey.phone-validation.html`
- `docs/code-backups/2026-05-19/survey.before-option-main-bold.html`
- `docs/code-backups/2026-05-19/survey.option-main-bold.html`
- `docs/code-backups/2026-05-19/survey.before-step2-card-ui-match.html`
- `docs/code-backups/2026-05-19/survey.step2-card-ui-match.html`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-github-remote-policy.md`
- `docs/code-backups/2026-05-19/AI-WORK-RULES.before-github-remote-policy.md`
- `docs/code-backups/2026-05-19/AI-WORK-RULES.before-collaboration-workflow.md`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-collaboration-workflow.md`
- `docs/code-backups/2026-05-19/IMPLEMENTATION-LOG.before-collaboration-workflow.md`
- `docs/code-backups/2026-05-19/README.before-collaboration-workflow-conflict-cleanup.md`
- `docs/code-backups/2026-05-19/index.before-pages-path-fix.html`
- `docs/code-backups/2026-05-19/index.pages-path-fixed.html`
- `docs/code-backups/2026-05-19/README.before-pages-path-fix.md`
- `docs/code-backups/2026-05-19/README.pages-path-fixed.md`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-pages-path-fix.md`
- `docs/code-backups/2026-05-19/survey.before-step-number-flow-fix.html`
- `docs/code-backups/2026-05-19/survey.step-number-flow-fixed.html`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-step-number-flow-fix.md`
- `docs/code-backups/2026-05-19/survey.before-step4-concern-image-grid.html`
- `docs/code-backups/2026-05-19/survey.step4-concern-image-grid.html`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-step4-concern-image-grid.md`
- `docs/code-backups/2026-05-19/survey.before-skin-helper-subflow.html`
- `docs/code-backups/2026-05-19/survey.skin-helper-subflow.html`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-skin-helper-subflow.md`
- `docs/code-backups/2026-05-19/survey.before-step5-trigger-checkboxes.html`
- `docs/code-backups/2026-05-19/survey.step5-trigger-checkboxes.html`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-step5-trigger-checkboxes.md`
- `docs/code-backups/2026-05-19/survey.before-step6-reactive-skin.html`
- `docs/code-backups/2026-05-19/survey.step6-reactive-skin.html`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-step6-reactive-skin.md`
- `docs/code-backups/2026-05-19/survey.before-step5-step6-card-hierarchy.html`
- `docs/code-backups/2026-05-19/survey.step5-step6-card-hierarchy.html`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-step5-step6-card-hierarchy.md`
- `docs/code-backups/2026-05-19/survey.before-step5-step6-typography-hierarchy.html`
- `docs/code-backups/2026-05-19/survey.step5-step6-typography-hierarchy.html`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-step5-step6-typography-hierarchy.md`
- `docs/code-backups/2026-05-19/DESIGN-SYSTEM.before-ui-hierarchy-rules.md`
- `docs/code-backups/2026-05-19/AI-WORK-RULES.before-ui-hierarchy-rules.md`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-ui-hierarchy-rules.md`
- `docs/code-backups/2026-05-19/survey.before-step7-combined-sun-habits.html`
- `docs/code-backups/2026-05-19/survey.step7-combined-sun-habits.html`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-step7-combined-sun-habits.md`
- `docs/code-backups/2026-05-19/survey.before-step8-combined-sleep-stress.html`
- `docs/code-backups/2026-05-19/survey.step8-combined-sleep-stress.html`
- `docs/code-backups/2026-05-19/BACKUP-POLICY.before-step8-combined-sleep-stress.md`
- `docs/code-backups/2026-05-20/survey.before-skin-helper-card-hierarchy.html`
- `docs/code-backups/2026-05-20/survey.skin-helper-card-hierarchy.html`
- `docs/code-backups/2026-05-20/BACKUP-POLICY.before-skin-helper-card-hierarchy.md`
- `docs/code-backups/2026-05-20/IMPLEMENTATION-LOG.before-skin-helper-card-hierarchy.md`
- `docs/code-backups/2026-05-20/survey.before-step3-2-tzone-linebreak.html`
- `docs/code-backups/2026-05-20/survey.step3-2-tzone-linebreak.html`
- `docs/code-backups/2026-05-20/BACKUP-POLICY.before-step3-2-tzone-linebreak.md`
- `docs/code-backups/2026-05-20/survey.before-step3-3-balanced-linebreak.html`
- `docs/code-backups/2026-05-20/survey.step3-3-balanced-linebreak.html`
- `docs/code-backups/2026-05-20/BACKUP-POLICY.before-step3-3-balanced-linebreak.md`
- `docs/code-backups/2026-05-20/survey.before-analysis-screen-center.html`
- `docs/code-backups/2026-05-20/survey.analysis-screen-centered.html`
- `docs/code-backups/2026-05-20/BACKUP-POLICY.before-analysis-screen-center.md`
- `docs/code-backups/2026-05-20/IMPLEMENTATION-LOG.before-analysis-screen-center.md`
- `docs/code-backups/2026-05-20/survey.before-result-page-v1.html`
- `docs/code-backups/2026-05-20/survey.result-page-v1.html`
- `docs/code-backups/2026-05-20/BACKUP-POLICY.before-result-page-v1.md`
- `docs/code-backups/2026-05-20/IMPLEMENTATION-LOG.before-result-page-v1.md`
- `docs/code-backups/2026-05-20/survey.before-step4-single-concern.html`
- `docs/code-backups/2026-05-20/survey.step4-single-concern.html`
- `docs/code-backups/2026-05-20/BACKUP-POLICY.before-step4-single-concern.md`
- `docs/code-backups/2026-05-20/IMPLEMENTATION-LOG.before-step4-single-concern.md`
- `docs/code-backups/2026-05-20/survey.before-result-11-skin-types.html`
- `docs/code-backups/2026-05-20/survey.result-11-skin-types.html`
- `docs/code-backups/2026-05-20/BACKUP-POLICY.before-result-11-skin-types.md`
- `docs/code-backups/2026-05-20/IMPLEMENTATION-LOG.before-result-11-skin-types.md`
- `docs/YUNN-SKIN-TYPE-MATRIX.md`
- `docs/code-backups/2026-05-20/YUNN-SKIN-TYPE-MATRIX.result-11-skin-types.md`
- `docs/code-backups/2026-05-20/survey.before-beta-service-modal.html`
- `docs/code-backups/2026-05-20/survey.beta-service-modal.html`
- `docs/code-backups/2026-05-20/BACKUP-POLICY.before-beta-service-modal.md`
- `docs/code-backups/2026-05-20/IMPLEMENTATION-LOG.before-beta-service-modal.md`

Created on 2026-05-26:
- `docs/code-backups/2026-05-26/survey.before-feedback-gate.html`
- `docs/code-backups/2026-05-26/survey.feedback-gate.html`
- `docs/code-backups/2026-05-26/BACKUP-POLICY.before-feedback-gate.md`
- `docs/code-backups/2026-05-26/IMPLEMENTATION-LOG.before-feedback-gate.md`
- `docs/FEEDBACK-GATE-SETUP.md`
- `docs/code-backups/2026-05-26/survey.before-analysis-duration-tune.html`
- `docs/code-backups/2026-05-26/survey.analysis-duration-tuned.html`
- `docs/SURVEY-QUESTIONS.md`
- `docs/code-backups/2026-05-26/SURVEY-QUESTIONS.md`

Created on 2026-05-27:
- `docs/code-backups/2026-05-27/survey.before-result-unlock-reposition.html`
- `docs/code-backups/2026-05-27/FEEDBACK-GATE-SETUP.before-result-unlock-reposition.md`
- `docs/code-backups/2026-05-27/IMPLEMENTATION-LOG.before-result-unlock-reposition.md`
- `docs/code-backups/2026-05-27/BACKUP-POLICY.before-result-unlock-reposition.md`
- `docs/code-backups/2026-05-27/survey.result-unlock-reposition.html`
- `docs/code-backups/2026-05-27/FEEDBACK-GATE-SETUP.result-unlock-reposition.md`

## Restore

홈 화면을 복구하려면:

```bash
cp docs/code-backups/2026-05-18/index.figma-home.html index.html
```

설문 화면을 복구하려면:

```bash
cp docs/code-backups/2026-05-18/survey.current-flow.html survey.html
```

### 2026-05-28 - Skin Type Copy Update

Backups:
- `docs/code-backups/2026-05-28/survey.before-skin-type-copy-update.html`
- `docs/code-backups/2026-05-28/YUNN-SKIN-TYPE-MATRIX.before-skin-type-copy-update.md`
- `docs/code-backups/2026-05-28/IMPLEMENTATION-LOG.before-skin-type-copy-update.md`
- `docs/code-backups/2026-05-28/BACKUP-POLICY.before-skin-type-copy-update.md`

Purpose:
최신 PDF 기준 결과 피부 타입명, 키워드, 설명 문단 표시 방식을 반영하기 전 복구 지점을 남겼다.

### 2026-05-29 - Required Next Button State Fix

Backups:
- `docs/code-backups/2026-05-29/survey.before-required-next-state-fix.html`
- `docs/code-backups/2026-05-29/IMPLEMENTATION-LOG.before-required-next-state-fix.md`
- `docs/code-backups/2026-05-29/BACKUP-POLICY.before-required-next-state-fix.md`
- `docs/code-backups/2026-05-29/survey.required-next-state-fix.html`

Purpose:
진단 Step 6 및 다른 필수 답변 단계에서 답변 선택 전 `Next` 버튼이 활성화되지 않도록 보장하는 변경의 전후 복구 지점을 남겼다.

### 2026-05-30 - Analytics Logging Implementation

Backups:
- `docs/code-backups/2026-05-30/survey.before-analytics-logging.html`
- `docs/code-backups/2026-05-30/IMPLEMENTATION-LOG.before-analytics-logging.md`
- `docs/code-backups/2026-05-30/BACKUP-POLICY.before-analytics-logging.md`
- `docs/code-backups/2026-05-30/survey.analytics-logging.html`
- `docs/code-backups/2026-05-30/ANALYTICS-LOGGING.md`

Purpose:
사용자 제공 `로그설계서`를 기준으로 진단 시작, 설문 Step 1~10, helper Step 3-1~3-4, 로딩 화면, 결과 페이지의 고객 행동 로그를 구현하기 전후 복구 지점을 남겼다.

### 2026-05-31 - GTM + GA4 Setup

Backups:
- `docs/code-backups/2026-05-30/index.before-gtm-ga4.html`
- `docs/code-backups/2026-05-30/survey.before-gtm-ga4.html`
- `docs/code-backups/2026-05-30/landing.before-gtm-ga4.html`
- `docs/code-backups/2026-05-30/login.before-gtm-ga4.html`
- `docs/code-backups/2026-05-30/ANALYTICS-LOGGING.before-gtm-ga4.md`
- `docs/code-backups/2026-05-30/IMPLEMENTATION-LOG.before-gtm-ga4.md`
- `docs/code-backups/2026-05-30/BACKUP-POLICY.before-gtm-ga4.md`
- `docs/code-backups/2026-05-31/index.gtm-ga4-ready.html`
- `docs/code-backups/2026-05-31/survey.gtm-ga4-ready.html`
- `docs/code-backups/2026-05-31/landing.gtm-ga4-ready.html`
- `docs/code-backups/2026-05-31/login.gtm-ga4-ready.html`
- `docs/code-backups/2026-05-31/ANALYTICS-LOGGING.gtm-ga4-ready.md`
- `docs/code-backups/2026-05-31/GTM-GA4-SETUP.md`

Purpose:
GTM/GA4 연결 scaffold를 추가하기 전 전 페이지 HTML 및 관련 로그 문서의 복구 지점을 남겼다.

### 2026-06-01 - Real GTM Container ID

Backups:
- `docs/code-backups/2026-06-01/index.before-real-gtm-id.html`
- `docs/code-backups/2026-06-01/survey.before-real-gtm-id.html`
- `docs/code-backups/2026-06-01/landing.before-real-gtm-id.html`
- `docs/code-backups/2026-06-01/login.before-real-gtm-id.html`
- `docs/code-backups/2026-06-01/GTM-GA4-SETUP.before-real-gtm-id.md`
- `docs/code-backups/2026-06-01/IMPLEMENTATION-LOG.before-real-gtm-id.md`
- `docs/code-backups/2026-06-01/BACKUP-POLICY.before-real-gtm-id.md`
- `docs/code-backups/2026-06-01/index.real-gtm-id.html`
- `docs/code-backups/2026-06-01/survey.real-gtm-id.html`
- `docs/code-backups/2026-06-01/landing.real-gtm-id.html`
- `docs/code-backups/2026-06-01/login.real-gtm-id.html`
- `docs/code-backups/2026-06-01/GTM-GA4-SETUP.real-gtm-id.md`

Purpose:
실제 GTM 컨테이너 ID `GTM-P2NX3N5K`와 noscript fallback을 적용하기 전 복구 지점을 남겼다.

Created on 2026-06-12:
- `docs/code-backups/2026-06-12/survey.refactor-phase1.html`
- `docs/code-backups/2026-06-12/index.fix-nobg-refs.html`
