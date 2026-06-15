// SheetRepository.js — Google Sheets 전송

import { YUNN_SHEET_ENDPOINT } from '../domain/AppConfig.js';

export function sendToSheet(payload) {
    // Google Apps Script는 POST JSON에 CORS 제한이 있어
    // GET + query params 방식으로 전송 (GAS doGet에서 처리)
    try {
        const params = new URLSearchParams();
        Object.entries(payload).forEach(([k, v]) => params.set(k, String(v)));
        const url = YUNN_SHEET_ENDPOINT + '?' + params.toString();
        // no-cors 이미지 픽셀 방식 — CORS 우회, 응답 불필요
        const img = new Image();
        img.src = url;
    } catch(e) {
        // 전송 실패 시 설문 흐름에 영향 없도록 silent fail
    }
}
