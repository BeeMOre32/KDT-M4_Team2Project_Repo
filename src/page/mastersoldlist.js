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

  soldProductPage.append(
    soldProductPageTitle,
    renderSoldTitle(),
    await renderSoldList()
  );
  app.appendChild(soldProductPage);
}

async function renderSoldList() {
  const data = await getMasterAllSoldList();
  const soldList = document.createElement("div");
  soldList.classList.add("sold-list");

  data.forEach((product) => {
    const soldProduct = document.createElement("div");
    soldProduct.classList.add("sold-product");
    const soldDate = product.timePaid.slice(0, 10);

    console.log(typeof soldDate);
    soldProduct.innerHTML = `
        <div class="sold-product-name">${product.product.title}</div>
        <div class="sold-product-price">${product.product.price}원</div>
        <div class="sold-product-sold-date">${soldDate}</div>
    `;

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
  `;

  return soldTitle;
}
