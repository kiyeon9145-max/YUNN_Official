// BalanceRowTemplate.js — 결과 화면의 피부 밸런스 지표 한 행(row) 생성
// HTML <template id="tpl-balance-row">를 복제해 라벨·게이지·점수·상태를 채워 반환한다.
// @param metric { label, value(0~100), status } 지표 데이터
// @returns 채워진 .balance-row DOM 요소 (호출 측에서 컨테이너에 append)
export function balanceRowNode(metric) {
    const tpl = document.getElementById('tpl-balance-row');
    const node = tpl.content.cloneNode(true);
    const root = node.querySelector('.balance-row');
    // 지표 이름을 data 속성에 보관 (정렬·디버깅용)
    root.dataset.metricName = metric.label;
    root.querySelector('.balance-label').textContent = metric.label;
    root.querySelector('.balance-fill').style.width = metric.value + '%';  // 게이지 채움 너비 = 점수%
    root.querySelector('.balance-score').textContent = metric.value + '%';
    root.querySelector('.balance-status').textContent = metric.status;     // "Good" / "Needs care" 등
    return root;
}
