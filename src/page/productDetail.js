import "../style/productDetail.scss"

import { getProductDetail } from "../utilities/productapi";

export async function renderDetailPage(params) {
  const app = document.getElementById('app');
  const product = await getProductDetail(params.data.productId)

  app.innerHTML = /* html */`
    <div class="container">
      <div class="main">
        <img class="thumbnail" src="${product.thumbnail}" alt="thumbnail">

        <p class="description">
          ${product.description}
        </p>

        <img class="detail" src="${product.photo}" alt="detail photo">
      </div>
      <div class="side">
        <div class="card">
          <h3>${product.title}</h3>
          <p class="price">￦ ${product.price.toLocaleString()}</p>

          <span class="line"></span>

          <div class="category-card">
            <span class="material-symbols-outlined icon">
              dresser 
            </span>
            <div>
              <span class="category-title">Category</span>
              <span class="category">${product.tags[0]}</span>
            </div>
          </div>

          <div class="tag">
            <span class="tag-title">Tags</span>
            <div class="tags">
              <!-- tag추가 -->
              <span>best</span>
              <span>new</span>
            </div>
          </div>

          <div class="buy-product">
            <button class="darken-btn">바로구매</button>
            <button class="common-btn">장바구니</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  console.log(product);
}