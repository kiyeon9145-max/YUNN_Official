# YUNN GTM + GA4 Setup

Last updated: 2026-05-31

## Current Status

The website is prepared for Google Tag Manager and GA4 event collection.

Implemented files:

- `index.html`
- `pages/landing.html`
- `pages/login.html`
- `pages/survey.html`

The current code has a safe placeholder:

```js
window.YUNN_GTM_ID = window.YUNN_GTM_ID || '';
```

Because the real GTM container ID has not been provided yet, the loader does not request Google Tag Manager. This prevents broken or invalid GTM network calls.

When the real ID is ready, replace the empty value with the actual container ID:

```js
window.YUNN_GTM_ID = window.YUNN_GTM_ID || 'GTM-XXXXXXX';
```

Use the same ID on all HTML pages.

## Event Contract

All custom YUNN events now push to `window.dataLayer` with both fields:

```js
{
  event: 'skin_reactivity_select',
  event_name: 'skin_reactivity_select',
  session_id: '...',
  timestamp: '...',
  screen: 'survey',
  step: '6'
}
```

`event` is the field Google Tag Manager uses for Custom Event triggers.

`event_name` is kept for local QA logs and future backend exports.

## Recommended GTM Setup

Create these tags inside Google Tag Manager.

### 1. GA4 Configuration Tag

Tag type:

- Google Analytics: GA4 Configuration

Measurement ID:

- Use the GA4 Measurement ID from the YUNN GA4 property, such as `G-XXXXXXXXXX`.

Trigger:

- Initialization - All Pages

### 2. GA4 Event Tag

Tag type:

- Google Analytics: GA4 Event

Configuration tag:

- Select the YUNN GA4 Configuration tag.

Event name:

```txt
{{Event}}
```

Trigger:

- Custom Event
- Event name: `.*`
- Use regex matching: enabled

Important:

This will send all YUNN custom `dataLayer` events into GA4. If the dashboard gets noisy later, split events into grouped tags.

## Recommended GTM Variables

Create Data Layer Variables for:

- `event_name`
- `session_id`
- `screen`
- `step`
- `skin_type`
- `skin_concern`
- `selected_values`
- `selected_reactivity_level`
- `selected_skin_type`
- `selected_concern`
- `scroll_percent`
- `duration_sec`
- `cta_id`
- `product_id`
- `product_name`
- `metric_name`

In GA4 Event Parameters, pass these variables as custom parameters.

## GA4 Custom Dimensions

Register these custom dimensions in GA4:

- `session_id`
- `screen`
- `step`
- `skin_type`
- `skin_concern`
- `cta_id`
- `product_id`
- `metric_name`

High-value event names:

- `landing_view`
- `landing_cta_click`
- `user_info_page_view`
- `next_button_disabled_click`
- `skin_type_select`
- `skin_concern_select`
- `skin_reactivity_select`
- `skin_photo_upload_success`
- `analysis_completion_success`
- `result_page_view`
- `skin_balance_section_view`
- `unlock_cta_click`
- `feedback_survey_open`
- `unlock_conversion`
- `product_cart_click`
- `add_all_to_cart_click`
- `retake_quiz_click`

## MVP Funnel

Recommended funnel in GA4:

1. `landing_cta_click`
2. `user_info_page_view`
3. `skin_type_page_view`
4. `skin_concern_page_view`
5. `final_page_view`
6. `analysis_completion_success`
7. `result_page_view`
8. `unlock_cta_click`
9. `feedback_survey_open`
10. `unlock_conversion`
11. `product_cart_click` or `add_all_to_cart_click`

## Debugging

In the browser console:

```js
window.yunnGtmStatus
```

Expected values:

- `missing_container_id`: GTM ID is not set yet.
- `loading`: GTM script was requested.

Check events:

```js
window.dataLayer
```

Check local backup events:

```js
JSON.parse(localStorage.getItem('yunn_analytics_events') || '[]')
```

## Notes

- Do not log raw phone numbers.
- Do not log raw emails.
- Do not log uploaded image data.
- GA4 should receive selected answer categories and behavior events, not sensitive raw personal data.
- The current implementation keeps local logs for QA and backup, but GTM/GA4 should become the primary operator dashboard after the real container ID is configured.
