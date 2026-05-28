# YUNN Skin Type Matrix

Created: 2026-05-20
Purpose: Result page source of truth for YUNN skin type names, keywords, and English descriptions.
Source update: 2026-05-28 PDF `YUNN_16가지_조합_이름.pdf` changed `Bright Balance` to `Glow Balance`, `Velvet Glow` to `Soft Glow`, `Velvet Bright` to `Soft Bright`, and `Radiance Harmony` to `Glow Harmony`.

This document defines the confirmed YUNN result taxonomy used by `pages/survey.html`.
The result page must combine Step 3 skin type and Step 4 primary skin concern to decide the final skin type profile.

## Result UI Rule

- The dynamic type name is one of the confirmed names below, such as `Oil Clear`.
- The word `type` is a fixed UI suffix and should not be stored as part of the dynamic type name.
- Example display: `Oil Clear type`
- Keywords must follow this document exactly.
- Description text must remain English-only.

## Concern Mapping

The Step 4 concern values are normalized as:

| Step 4 value | Internal concern key |
|---|---|
| Acne | Acne |
| Acne marks | Marks |
| Pigmentation | Pigmentation |
| Uneven skin tone | Tone |

## Final 11 Type Table

| # | Skin Type | Skin Concern | Type Name | Keywords |
|---|---|---|---|---|
| 1 | Oily | Acne | Oil Clear | Oily · Acne-prone · Sebum Control |
| 2 | Oily | Acne marks | Glow Restore | Oily · Post-acne · Repair |
| 3 | Oily | Pigmentation | Radiance Shield | Oily · Pigmentation · UV Defense |
| 4 | Oily | Uneven tone | Glow Balance | Oily · Uneven Tone · Glow |
| 5 | Dry | Acne | Calm Repair | Dry · Breakout · Barrier |
| 6 | Dry | Acne marks | Barrier Glow | Dry · Repair · Barrier Stress |
| 7 | Dry | Pigmentation | Soft Glow | Dry · Pigmentation · Dehydrated |
| 8 | Dry | Uneven tone | Soft Bright | Dry · Hydration · Even Tone |
| 9 | Combination | Acne + Acne marks | Clear Harmony | Combination · Acne-prone · Oil Balance |
| 10 | Combination | Pigmentation + Uneven tone | Glow Harmony | Combination · Uneven Tone · Radiance |
| 11 | Normal | Any | Pure Radiance | Normal · Natural Glow · Balanced |

## Full Mapping Keys

These are the exact result keys used by `RESULT_TYPE_PROFILES`.

| Result key | Type Name | Keywords |
|---|---|---|
| Oily\|Acne | Oil Clear | Oily · Acne-prone · Sebum Control |
| Oily\|Marks | Glow Restore | Oily · Post-acne · Repair |
| Oily\|Pigmentation | Radiance Shield | Oily · Pigmentation · UV Defense |
| Oily\|Tone | Glow Balance | Oily · Uneven Tone · Glow |
| Dry\|Acne | Calm Repair | Dry · Breakout · Barrier |
| Dry\|Marks | Barrier Glow | Dry · Repair · Barrier Stress |
| Dry\|Pigmentation | Soft Glow | Dry · Pigmentation · Dehydrated |
| Dry\|Tone | Soft Bright | Dry · Hydration · Even Tone |
| Combination\|Acne | Clear Harmony | Combination · Acne-prone · Oil Balance |
| Combination\|Marks | Clear Harmony | Combination · Acne-prone · Oil Balance |
| Combination\|Pigmentation | Glow Harmony | Combination · Uneven Tone · Radiance |
| Combination\|Tone | Glow Harmony | Combination · Uneven Tone · Radiance |
| Normal\|Acne | Pure Radiance | Normal · Natural Glow · Balanced |
| Normal\|Marks | Pure Radiance | Normal · Natural Glow · Balanced |
| Normal\|Pigmentation | Pure Radiance | Normal · Natural Glow · Balanced |
| Normal\|Tone | Pure Radiance | Normal · Natural Glow · Balanced |

## English Descriptions

### 1. Oil Clear

Your skin tends to produce more oil than it needs — and in India's heat and humidity, that builds up fast.
Lightweight hydration and consistent oil control can help keep your skin clear, calm, and balanced through the day.

### 2. Glow Restore

Your skin is still recovering from past breakouts — and UV exposure can make those marks linger longer than expected.
With steady barrier support and gentle brightening care, your skin tone can gradually become clearer and more even.

### 3. Radiance Shield

Your skin may be more reactive to pigmentation triggers — and daily UV exposure makes that harder to manage without the right protection.
Consistent sunscreen and brightening care can help prevent dark spots from deepening and keep your natural radiance visible.

### 4. Glow Balance

Your skin is producing more oil than it needs, and that imbalance is showing up as shine and uneven tone.
Lightweight hydration and tone-balancing care can help your skin find its natural rhythm — and bring back its glow.

### 5. Calm Repair

Your skin is dealing with dryness and breakouts at the same time — which happens when the skin barrier becomes weakened and more reactive.
Calming hydration and barrier-focused care can help reduce irritation and bring your skin back to a more comfortable balance.

### 6. Barrier Glow

Your skin is in recovery mode — and without enough moisture, post-acne marks tend to stay more visible and healing feels slower.
Rebuilding your skin barrier with gentle, nourishing care can help speed up recovery and bring back a healthy glow over time.

### 7. Soft Glow

Your skin is low on moisture — and when hydration drops, dark spots and uneven areas tend to look more visible than they actually are.
Deep hydration and consistent brightening care can help even out your tone and bring your natural glow back to the surface.

### 8. Soft Bright

Your skin has natural glow — it just needs more hydration to show it.
When moisture levels are well maintained, skin looks noticeably smoother, more even, and more radiant.

### 9. Clear Harmony

Your skin runs oily in some areas and feels tight or irritated in others — making breakouts harder to predict and manage.
Balanced oil control and lightweight hydration working together can help your skin feel more settled and consistently clearer.

### 10. Glow Harmony

Your skin is dealing with both oil imbalance and uneven tone — and UV exposure makes it harder for your skin to stay bright and balanced.
Tone-balancing care, lightweight hydration, and daily sun protection can work together to bring your skin's radiance back into harmony.

### 11. Pure Radiance

Your skin is in a genuinely good place — balanced, resilient, and responding well to daily care.
Keeping up with hydration and sun protection is what helps your natural radiance stay exactly where it is.

## Implementation Notes

- `pages/survey.html` stores the mapping in `RESULT_TYPE_PROFILES`.
- `getResultConfig()` must merge the selected `RESULT_TYPE_PROFILES` entry over the older sample recommendation config so confirmed type names and keywords always win.
- Result display should render `${skinTypeName} type`.
- Do not reintroduce generated names such as `Oil-Control Clear Balance type`.
- Combination groups:
  - `Combination|Acne` and `Combination|Marks` both map to `Clear Harmony`.
  - `Combination|Pigmentation` and `Combination|Tone` both map to `Glow Harmony`.
- Normal skin always maps to `Pure Radiance`, regardless of selected concern.
