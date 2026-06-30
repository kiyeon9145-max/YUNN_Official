// SheetRepository.js — Google Sheets 리드 수집 전송
// 설문 완료 시 사용자 응답을 Google Apps Script(GAS) Web App으로 전달한다.

import { YUNN_SHEET_ENDPOINT } from '../domain/AppConfig.js';

// 설문 응답 객체(payload)를 Google Sheets로 전송한다.
// 전송 방식: GET 요청 — GAS Web App은 doGet 핸들러로 구현되어 있다.
// CORS 우회를 위해 fetch 대신 Image 픽셀 방식을 사용한다.
//   이유: Google Apps Script Web App은 POST + JSON 요청에 CORS 허용 헤더를 내려주지 않아
//         fetch()로 호출하면 브라우저가 preflight에서 차단한다.
//         Image.src 할당은 no-cors GET 요청과 동일하게 동작하며,
//         응답 본문이 필요 없는 경우(단순 기록)에 적합하다.
// 전송 실패는 설문 흐름에 영향을 주지 않도록 조용히 무시한다.
export function sendToSheet(payload) {
    try {
        // 객체의 모든 키-값 쌍을 URL 쿼리 파라미터로 직렬화한다.
        const params = new URLSearchParams();
        Object.entries(payload).forEach(([k, v]) => params.set(k, String(v)));
        const url = YUNN_SHEET_ENDPOINT + '?' + params.toString();

        // Image 객체를 통한 GET 요청 — 응답은 무시하고 요청만 보낸다.
        const img = new Image();
        img.src = url;
    } catch(e) {
        // 전송 실패 시 설문 흐름에 영향 없도록 silent fail.
    }
}
