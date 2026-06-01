# YUNN Analytics Logging

Last updated: 2026-05-30

## Purpose

This document explains how the MVP web page logs user behavior for the YUNN diagnosis flow and result page. It is based on the local log design package in `로그설계서`, including the per-screen Markdown, HTML, Excel, and screenshot references.

The current implementation is intentionally lightweight:

- It does not require a backend to run the MVP.
- It stores recent logs locally for QA and manual export.
- It pushes the same payload to `window.dataLayer` for future GA4/GTM integration.
- It exposes one common event function so a future backend, PostHog, Mixpanel, or GA4 pipeline can be connected without rewriting page logic.

## Implementation Location

Main file:

- `pages/survey.html`

Main functions:

- `trackYunnEvent(eventName, properties)`
- `markAnalyticsScreen(screen, step)`
- `trackSurveyStepView(step)`
- `trackInputSelection(input, previousValue, value, isSelected)`
- `trackStepNextClick(step)`
- `trackStepBackClick(step)`
- `setupResultAnalytics(data, config)`

Local storage keys:

- `yunn_analytics_events`: recent analytics events, capped at 1000 payloads.
- `yunn_session_id`: anonymous session identifier used across the diagnosis and result flow.
- Existing MVP keys such as `yunn_cart_events`, `yunn_beta_events`, and Google Form unlock keys remain unchanged.

## Event Pipeline

Every event emitted through `trackYunnEvent()` includes common fields:

- `event_name`
- `session_id`
- `timestamp`
- `page_path`
- `page_url`
- `screen`
- `step`
- `traffic_source`
- `device_type`
- `network`
- `viewport`

The event is then sent to three places:

1. `localStorage.yunn_analytics_events`
2. `window.dataLayer`
3. `window.dispatchEvent(new CustomEvent('yunn:analytics'))`

For GTM compatibility, every custom event includes both:

- `event`: the Google Tag Manager Custom Event name.
- `event_name`: the same event name retained for local QA and future backend exports.

See `docs/GTM-GA4-SETUP.md` for the GTM/GA4 setup steps.

`YUNN_ANALYTICS_ENDPOINT` is currently blank. When a backend endpoint is ready, set this constant to the collection URL. If `navigator.sendBeacon` is available, the page will send payloads there without blocking the UI.

## Screen Mapping

| Screen | Page in UI | Primary events |
|---|---|---|
| Intro | Diagnosis landing | `landing_page_view`, `landing_cta_click`, `landing_scroll_depth`, `landing_time_spent`, `landing_exit` |
| Step 1 | User info | `user_info_page_view`, `name_input_start`, `name_input_complete`, `email_input_start`, `email_input_complete`, `phone_input_start`, `phone_input_complete`, `validation_error`, `next_button_click` |
| Step 2 | Gender and age | `demographic_page_view`, `gender_option_view`, `age_option_view`, `gender_select`, `age_select`, `demographic_time_spent` |
| Step 3 | Skin type | `skin_type_page_view`, `skin_type_option_view`, `skin_type_select`, `skin_type_change` |
| Step 3-1 | Right after cleansing | `skin_feel_page_view`, `skin_feel_option_view`, `skin_feel_select`, `skin_feel_change`, `skin_feel_next_click` |
| Step 3-2 | A few hours after cleansing | `skin_oil_behavior_page_view`, `skin_oil_behavior_option_view`, `skin_oil_behavior_select`, `skin_oil_behavior_change` |
| Step 3-3 | During the day | `skin_day_behavior_page_view`, `skin_day_behavior_option_view`, `skin_day_behavior_select`, `skin_day_behavior_change` |
| Step 3-4 | Texture and pores | `skin_texture_page_view`, `skin_texture_option_view`, `skin_texture_select`, `skin_texture_change` |
| Step 4 | Skin concern | `skin_concern_page_view`, `skin_concern_option_view`, `skin_concern_select`, `skin_concern_change` |
| Step 5 | Skin triggers | `skin_trigger_page_view`, `skin_trigger_option_view`, `skin_trigger_select`, `skin_trigger_unselect`, `skin_trigger_combination` |
| Step 6 | Reactivity | `skin_reactivity_page_view`, `skin_reactivity_option_view`, `skin_reactivity_select`, `skin_reactivity_change` |
| Step 7 | Outdoors and sunscreen | `outdoor_time_page_view`, `outdoor_time_option_select`, `sunscreen_frequency_select`, `outdoor_time_next_click` |
| Step 8 | Sleep and stress | `sleep_stress_page_view`, `sleep_duration_select`, `stress_level_select`, `sleep_stress_next_click` |
| Step 9 | Routine level | `routine_page_view`, `routine_option_view`, `routine_level_select`, `routine_level_change` |
| Step 10 | Photo upload | `final_page_view`, `skin_photo_upload_click`, `skin_photo_upload_start`, `skin_photo_upload_success`, `skin_photo_quality_check`, `skip_photo_click`, `complete_analysis_click` |
| Analysis | Loading screen | `analysis_completion_success` |
| Result | Result page | `result_page_view`, `skin_type_section_view`, `skin_balance_section_view`, `metric_detail_click`, `routine_preview_view`, `routine_preview_expand`, `unlock_cta_view`, `unlock_cta_click`, `unlock_conversion`, `product_cart_click`, `add_all_to_cart_click`, `retake_quiz_click`, `result_time_spent`, `result_exit` |

## Validation and Drop-off

If the user clicks `Next` before completing required answers, the page emits:

- `next_button_disabled_click`

The payload includes:

- `step_number`
- `missing_fields`
- `missing_required_groups`
- `selected_values`

Long-stay friction detection is also enabled for key survey pages. If a user stays on one step longer than 45 seconds, the page emits the relevant `*_friction_detected` event once per step.

## Result Page Details

The result page logs both summary and interaction events.

Result view:

- `result_page_view`
- `skin_type`
- `skin_concern`
- `result_keywords`

Skin balance:

- `skin_balance_section_view`
- `balance_scores`
- `metric_detail_click`
- `metric_name`

Routine and products:

- `routine_preview_view`
- `routine_preview_expand`
- `product_recommendation_section_view`
- `product_cart_click`
- `add_all_to_cart_click`

Google Form unlock:

- `unlock_cta_view`
- `unlock_cta_click`
- `feedback_survey_open`
- `feedback_gate_modal_close`
- `unlock_conversion`
- `unlock_dropoff`

## QA: Export Logs from Browser

Open DevTools Console and run:

```js
JSON.parse(localStorage.getItem('yunn_analytics_events') || '[]')
```

Download as JSON:

```js
(() => {
  const events = localStorage.getItem('yunn_analytics_events') || '[]';
  const blob = new Blob([events], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `yunn-analytics-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
})();
```

Clear only analytics logs:

```js
localStorage.removeItem('yunn_analytics_events');
```

## Future Backend Connection

When moving beyond local MVP logging:

1. Create a server endpoint such as `/api/analytics/events`.
2. Set `YUNN_ANALYTICS_ENDPOINT` in `pages/survey.html`.
3. Validate payloads server-side.
4. Store events by `session_id`, `event_name`, `timestamp`, and `screen`.
5. Keep personally identifiable values out of analytics where possible. The current flow logs validation states and selected answer values, not raw phone numbers or uploaded image data.

## Privacy Notes

- Do not log raw phone numbers.
- Do not log raw email addresses.
- Do not log uploaded image base64 data.
- Use `session_id` for anonymous funnel analysis.
- If the analytics endpoint is added, show the relevant consent/privacy copy in the MVP flow before collecting production user data.
