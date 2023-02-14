import "../style/master.scss";
import { getMasterProductList } from "../utilities/masterapi";
import { router } from "../route";

export async function renderMasterPage() {
  const app = document.querySelector("#app");
  let page = 1;
  app.innerHTML = "";
  const $ = (selector) => app.querySelector(selector);
  const $$ = (selector) => app.querySelectorAll(selector);

  const masterPage = document.createElement("div");
  masterPage.classList.add("master-page");
  const masterPageTitle = document.createElement("h1");
  masterPageTitle.innerText = "현재 팔고 있는 상품 목록";

  const addProductBtn = document.createElement("button");
  addProductBtn.classList.add("add-product-btn");
  addProductBtn.classList.add("darken-btn");
  addProductBtn.innerText = "상품 추가";
  addProductBtn.addEventListener("click", () => {
    router.navigate("/master/product/add");
  });

  const soldProductBtn = document.createElement("button");
  soldProductBtn.classList.add("sold-product-btn");
  soldProductBtn.classList.add("common-btn");
  soldProductBtn.innerText = "팔린 상품 목록";
  soldProductBtn.addEventListener("click", () => {
    router.navigate("/master/sold");
  });
  const loading = document.createElement("span");
  loading.classList.add("loading");
  loading.classList.add("loading--master");
  loading.innerText = "loading...";
  app.append(loading);

  masterPage.append(
    masterPageTitle,
    await renderProductList(page, true, masterPage),
    addProductBtn,
    soldProductBtn
  );
  app.appendChild(masterPage);

  $$(".page-nation-btn").forEach((pageNationBtn) => {
    pageNationBtn.addEventListener("click", async () => {
      $$(".page-nation-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      pageNationBtn.classList.add("active");
      page = pageNationBtn.innerText;
      const loading = document.createElement("span");
      loading.classList.add("loading");
      loading.classList.add("loading--master");
      loading.innerText = "loading...";
      app.append(loading);
      masterPage.replaceChild(
        await renderProductList(page, false, masterPage),
        $$(".product-list")[0]
      );
      productClickHandle($$);
    });
  });

  productClickHandle($$);
}

function productClickHandle($$) {
  $$(".product").forEach((product) => {
    product.addEventListener("click", () => {
      router.navigate(`/master/product/detail/${product.id}`);
    });
  });
}

async function renderProductList(page, isFirst = true, parentNode) {
  const data = await getMasterProductList();
  const productList = document.createElement("div");
  productList.classList.add("product-list");
  let dataArr = data.slice(page * 8 - 8, page * 8);
  const dataLength = data.length;
  const quotient = Math.floor(dataLength / 8);

  if (isFirst) {
    parentNode.appendChild(pageNation(quotient + 1));
  }

  const loading = document.querySelector(".loading");
  loading.remove();

  dataArr.forEach((product) => {
    const productEl = document.createElement("div");
    productEl.classList.add("product");
    productEl.id = product.id;
    productEl.innerHTML = `
    <div style="background-image: url(${product.thumbnail})" class="product-wrapper">
      <div>${product.title}</div>
    </div>
    `;
    productList.appendChild(productEl);
  });
  return productList;
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
