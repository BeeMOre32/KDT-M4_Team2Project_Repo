import "../style/master.scss";
import { getMasterProductList } from "../utilities/masterapi";
import { router } from "../route";

export async function renderMasterPage() {
  const app = document.querySelector("#app");
  app.innerHTML = "";
  const $ = (selector) => app.querySelector(selector);
  const $$ = (selector) => app.querySelectorAll(selector);

  const masterPage = document.createElement("div");
  masterPage.classList.add("master-page");
  const masterPageTitle = document.createElement("h1");
  masterPageTitle.innerText = "관리자 페이지";

  const addProductBtn = document.createElement("button");
  addProductBtn.classList.add("add-product-btn");
  addProductBtn.classList.add("darken-btn");
  addProductBtn.innerText = "상품 추가";
  addProductBtn.addEventListener("click", () => {
    router.navigate("/master/product/add");
  });

  masterPage.append(masterPageTitle, await renderProductList(1), addProductBtn);
  app.appendChild(masterPage);

  $$(".product").forEach((product) => {
    console.log(product);
    product.addEventListener("click", () => {
      router.navigate(`/master/product/detail/${product.id}`);
    });
  });
  const data = await getMasterProductList();

  console.log(data);
}

async function renderProductList(page, isFirst = true) {
  const data = await getMasterProductList();
  const ProductList = document.createElement("div");
  ProductList.classList.add("product-list");
  let dataArr = data.slice(page * 8 - 8, page * 8);

  console.log(dataArr);

  const dataLength = data.length;
  const remainder = dataLength % 8;
  const quotient = Math.floor(dataLength / 8);

  if (isFirst) ProductList.appendChild(pageNation(quotient + 1));

  dataArr.forEach((product) => {
    const productEl = document.createElement("div");
    productEl.classList.add("product");
    productEl.id = product.id;
    productEl.innerHTML = `
    <div style="background-image: url(${product.thumbnail})" class="product-wrapper">
      <div>${product.title}</div>
    </div>
    `;
    ProductList.appendChild(productEl);
  });

  return ProductList;
}
function pageNation(pageNumber) {
  const pageNation = document.createElement("div");
  pageNation.classList.add("page-nation");

  for (let i = 0; i < pageNumber; i++) {
    const pageNationBtn = document.createElement("button");
    pageNationBtn.classList.add("page-nation-btn");
    if (i === 0) pageNationBtn.classList.add("active");
    pageNationBtn.innerText = String(i + 1);
    pageNation.appendChild(pageNationBtn);
  }
  return pageNation;
}
