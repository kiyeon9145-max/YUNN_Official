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
