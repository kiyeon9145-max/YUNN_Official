# Feedback Gate Setup

YUNN 결과 페이지를 보기 전에 Google Form 설문 제출을 요구하는 게이트 설정 문서입니다.

## Current UX Flow

```txt
Diagnosis start
→ Diagnosis complete
→ Loading screen
→ Result generated
→ Feedback gate modal
→ User moves to Google Form
→ User submits Google Form
→ User taps the return link in the Google Form confirmation message
→ YUNN verifies the session
→ Result page opens
```

## Current Google Form

- Edit URL: `https://docs.google.com/forms/d/1ME2EU6G3LxnB6VPH6HUO7f-H850CGKt5Gs4lA1t8Wa8/edit`
- Frontend view URL used in code: `https://docs.google.com/forms/d/1ME2EU6G3LxnB6VPH6HUO7f-H850CGKt5Gs4lA1t8Wa8/viewform`

## Frontend Config Location

Open `pages/survey.html` and find:

```js
const YUNN_FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/1ME2EU6G3LxnB6VPH6HUO7f-H850CGKt5Gs4lA1t8Wa8/viewform';
const YUNN_FEEDBACK_SESSION_ENTRY_ID = '';
const YUNN_FEEDBACK_VERIFY_URL = '';
const YUNN_FEEDBACK_RETURN_PARAM = 'returnFromSurvey';
```

`YUNN_FEEDBACK_FORM_URL` is already set.

`YUNN_FEEDBACK_SESSION_ENTRY_ID` and `YUNN_FEEDBACK_VERIFY_URL` must be filled before the gate can unlock automatically.

## Google Form Required Field

Add one short-answer question to the Google Form:

```txt
yunn_session_id
```

Recommended helper text:

```txt
Please do not edit this field. It connects your survey response to your YUNN skin analysis.
```

Then generate a pre-filled link:

1. Open Google Form edit page.
2. Fill the `yunn_session_id` field with `TEST_SESSION`.
3. Use "Get pre-filled link".
4. Copy the generated URL.
5. Find the matching query key, for example:

```txt
entry.123456789=TEST_SESSION
```

6. Put that key into `YUNN_FEEDBACK_SESSION_ENTRY_ID`:

```js
const YUNN_FEEDBACK_SESSION_ENTRY_ID = 'entry.123456789';
```

## Google Form Confirmation Message

Google Forms does not natively redirect users to a custom URL after submit.

Set the confirmation message to include a return link:

```txt
Thank you for sharing your thoughts.

Return to YUNN result:
https://YOUR_DOMAIN/pages/survey.html?returnFromSurvey=1
```

For local testing, use the local server URL:

```txt
http://127.0.0.1:8123/pages/survey.html?returnFromSurvey=1
```

Do not use a `file://` return URL in production.

## Apps Script Verification

Create a Google Sheet response destination for the Google Form, then add Apps Script to the response sheet.

```js
const VERIFIED_SHEET_NAME = 'VerifiedSessions';
const SESSION_FIELD_NAME = 'yunn_session_id';

function onFormSubmit(e) {
  const sessionId = String(e.namedValues[SESSION_FIELD_NAME]?.[0] || '').trim();

  if (!isValidSessionId(sessionId)) {
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(VERIFIED_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(VERIFIED_SHEET_NAME);
    sheet.appendRow(['sessionId', 'submittedAt']);
  }

  sheet.appendRow([sessionId, new Date()]);
}

function doGet(e) {
  const sessionId = String(e.parameter.sessionId || '').trim();
  const callback = String(e.parameter.callback || '').trim();

  const payload = {
    completed: isSessionCompleted(sessionId),
    checkedAt: new Date().toISOString()
  };

  if (/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(callback)) {
    return ContentService
      .createTextOutput(`${callback}(${JSON.stringify(payload)})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function isSessionCompleted(sessionId) {
  if (!isValidSessionId(sessionId)) {
    return false;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(VERIFIED_SHEET_NAME);

  if (!sheet) {
    return false;
  }

  const values = sheet.getDataRange().getValues();
  return values.some(row => row[0] === sessionId);
}

function isValidSessionId(sessionId) {
  return /^yunn_[0-9a-f-]{36}$/.test(sessionId)
    || /^yunn_\d+_[0-9a-f]+$/.test(sessionId);
}
```

Install the form submit trigger:

1. Apps Script → Triggers.
2. Add trigger.
3. Function: `onFormSubmit`.
4. Event source: From spreadsheet.
5. Event type: On form submit.

Deploy the script:

1. Deploy → New deployment.
2. Type: Web app.
3. Execute as: Me.
4. Who has access: Anyone with the link.
5. Copy the Web app URL.
6. Paste it into `YUNN_FEEDBACK_VERIFY_URL`:

```js
const YUNN_FEEDBACK_VERIFY_URL = 'https://script.google.com/macros/s/.../exec';
```

## Security Notes

- This is an MVP gate, not enterprise-grade access control.
- General users cannot unlock the result unless their `sessionId` appears in the Google Form response sheet.
- Technical users can still manipulate frontend JavaScript because the result screen exists in the static HTML.
- Strong security later requires moving result generation/data delivery to a backend or serverless API.

## QA Checklist

- `pages/survey.html?resultDemo=1` opens the feedback gate before showing result.
- `Take the 2-minute survey` opens the Google Form.
- The form URL includes `entry.xxxxx=yunn_...` after `YUNN_FEEDBACK_SESSION_ENTRY_ID` is configured.
- Returning with `?returnFromSurvey=1` checks Apps Script.
- If the session is verified, the result page opens.
- If the session is not verified, the modal stays locked.
