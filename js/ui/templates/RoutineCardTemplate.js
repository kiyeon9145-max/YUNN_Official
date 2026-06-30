// RoutineCardTemplate.js — 결과 화면의 추천 루틴 스텝 카드 한 장 생성
// HTML <template id="tpl-routine-card">를 복제해 스텝 번호·제품·설명·사용법·팁을 채워 반환한다.
// @param step  { image, name, tag, description, why, how, tip } 루틴 스텝 데이터
// @param index 0-기반 인덱스 → 화면에는 "STEP 1"부터 표시(+1)
// @returns 채워진 .routine-card DOM 요소
export function routineCardNode(step, index) {
    const tpl = document.getElementById('tpl-routine-card');
    const node = tpl.content.cloneNode(true);
    const root = node.querySelector('.routine-card');
    root.querySelector('.routine-step-label').textContent = 'STEP ' + (index + 1);
    const img = root.querySelector('.routine-product-image img');
    img.src = step.image;
    img.alt = step.name;
    root.querySelector('.routine-product-title').textContent = step.name;
    root.querySelector('.routine-tag').textContent = step.tag;
    root.querySelector('.routine-product-desc').textContent = step.description;
    root.querySelector('.routine-why').textContent = step.why;
    root.querySelector('.routine-how').textContent = step.how;
    root.querySelector('.routine-tip-copy').textContent = step.tip;
    return root;
}
