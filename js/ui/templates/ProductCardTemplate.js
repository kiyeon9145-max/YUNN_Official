export function productCardNode(product) {
    const tpl = document.getElementById('tpl-product-card');
    const node = tpl.content.cloneNode(true);
    const root = node.querySelector('.product-card');
    root.dataset.productId = product.id;
    const img = root.querySelector('.product-image-wrap img');
    img.src = product.image;
    img.alt = product.name;
    root.querySelector('.product-name').textContent = product.name;
    root.querySelector('.product-discount').textContent = product.discount;
    root.querySelector('.product-price').textContent = product.price;
    root.querySelector('.product-original').textContent = product.original;
    root.querySelector('.product-rating-text').textContent = product.rating + ' (' + product.reviews + ')';
    root.querySelector('.cart-action').dataset.productId = product.id;
    return root;
}
