export function balanceRowNode(metric) {
    const tpl = document.getElementById('tpl-balance-row');
    const node = tpl.content.cloneNode(true);
    const root = node.querySelector('.balance-row');
    root.dataset.metricName = metric.label;
    root.querySelector('.balance-label').textContent = metric.label;
    root.querySelector('.balance-fill').style.width = metric.value + '%';
    root.querySelector('.balance-score').textContent = metric.value + '%';
    root.querySelector('.balance-status').textContent = metric.status;
    return root;
}
