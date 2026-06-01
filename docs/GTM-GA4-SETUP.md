# YUNN GTM + GA4 Setup

Last updated: 2026-06-01

## Current Status

The website is connected to Google Tag Manager and prepared for GA4 event collection.

Implemented files:

- `index.html`
- `pages/landing.html`
- `pages/login.html`
- `pages/survey.html`

Current GTM container:

```txt
GTM-P2NX3N5K
```

The same container ID is installed on all HTML pages. Each page also includes the GTM `noscript` iframe immediately after the opening `<body>` tag.

GA4 measurement ID:

```txt
G-JWRKGPTXX5
```

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

### 1. GA4 Base Tag

Tag type:

- Google tag, or Google Analytics: GA4 Configuration if the older GTM UI is shown

Measurement ID:

- `G-JWRKGPTXX5`

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

- `survey_start`
- `survey_complete`
- `result_view`
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

Primary MVP funnel in GA4:

1. `survey_start`
2. `survey_complete`
3. `result_view`

Expanded diagnosis funnel in GA4:

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

## KPI Event Contract

The three MVP events are intentionally duplicated from richer internal events so GA4 reports can start simple.

| Event | Fired when | Main parameters |
|---|---|---|
| `survey_start` | User enters the diagnosis flow from the landing CTA or survey query entry | `session_id`, `screen`, `step`, `start_source`, `current_step` |
| `survey_complete` | User completes the diagnosis and the analysis/loading screen starts | `session_id`, `final_step`, `skin_type`, `skin_concern`, `photo_uploaded` |
| `result_view` | Result page renders for the user | `session_id`, `skin_type`, `skin_concern`, `result_keywords` |

Keep these names stable. They are the top-level MVP conversion funnel.

## Debugging

In the browser console:

```js
window.yunnGtmStatus
```

Expected values:

- `missing_container_id`: GTM ID is not set.
- `loading`: GTM script was requested. With the current production ID, this is the expected runtime status before GTM finishes loading.

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
