import { getMasterAllSoldList } from "../utilities/masterapi";
import "../style/mastersoldlist.scss";
export async function renderSoldProduct() {
  const app = document.querySelector("#app");
  const $ = (selector) => app.querySelector(selector);
  const $$ = (selector) => app.querySelectorAll(selector);

  app.innerHTML = "";

  const soldProductPage = document.createElement("div");
  soldProductPage.classList.add("sold-product-page");
  const soldProductPageTitle = document.createElement("h1");
  soldProductPageTitle.innerText = "팔린 상품 목록";
  const soldProductDetail = document.createElement("div");
  soldProductDetail.classList.add("sold-product-detail");

  soldProductPage.append(
    soldProductPageTitle,
    soldProductDetail,
    renderSoldTitle(),
    await renderSoldList()
  );
  app.appendChild(soldProductPage);

  const soldProduct = $$(".sold-product");
  soldProduct.forEach((product) => {
    product.addEventListener("click", (e) => {});
  });
}

async function renderSoldList() {
  const data = await getMasterAllSoldList();
  const soldList = document.createElement("div");
  soldList.classList.add("sold-list");

  data.forEach((product) => {
    const soldProduct = document.createElement("div");
    soldProduct.classList.add("sold-product");
    soldProduct.dataset.id = product.detailId;
    const soldDate = product.timePaid.slice(0, 10);

    console.log(product);

    const productSold = document.createElement("div");
    productSold.classList.add("sold-product-sold");
    if (product.done === false && product.isCanceled === false) {
      productSold.innerHTML = `
       <div class="product-sold-indicator sale"></div>
       <span class="product-sold-span">구매 미확정</span>
      `;
    } else {
      productSold.innerHTML = `
       <div class="product-sold-indicator sold"></div>
       <span class="product-sold-span">구매 확정!</span>
      `;
    }

    soldProduct.innerHTML = `
        <div class="sold-product-name">${product.product.title}</div>
        <div class="sold-product-price">${product.product.price}원</div>
        <div class="sold-product-sold-date">${soldDate}</div>
    `;

    soldProduct.append(productSold);

    soldList.appendChild(soldProduct);
  });

  return soldList;
}

function renderSoldTitle() {
  const soldTitle = document.createElement("div");
  soldTitle.classList.add("sold-title");
  soldTitle.innerHTML = `
    <div class="sold-product-name">상품명</div>
    <div class="sold-product-price">가격
      <span class="material-symbols-outlined">payments</span>
    </div>
    <div class="sold-product-sold-date">판매일
      <span class="material-symbols-outlined">date_range</span>
    </div>
    <div class="sold-product-done"> 판매완료
      <span class="material-symbols-outlined">done</span>
    </div>
  `;

  return soldTitle;
}

function renderSoldDetail(detailId) {}
