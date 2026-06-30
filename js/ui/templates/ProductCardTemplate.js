// ProductCardTemplate.js — 추천/쇼핑 상품 카드 한 장 생성
// HTML <template id="tpl-product-card">를 복제해 이미지·이름·가격·평점을 채워 반환한다.
// product.id는 카드와 장바구니 버튼(.cart-action) 양쪽 data 속성에 심어 클릭 추적에 사용한다.
// @param product { id, image, name, discount, price, original, rating, reviews }
// @returns 채워진 .product-card DOM 요소
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
