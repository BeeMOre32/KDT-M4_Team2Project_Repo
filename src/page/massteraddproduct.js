import "../style/masteraddproduct.scss";
import { router } from "../route";
import { renderMasterPage } from "./master";
export function renderAddProduct() {
  const app = document.querySelector("#app");
  app.innerHTML = ``;

  const addProductPage = document.createElement("div");
  addProductPage.classList.add("add-product-page");

  const addProductPageTitle = document.createElement("h1");
  addProductPageTitle.innerText = "상품 추가";

  addProductPage.append(addProductPageTitle, renderAddProductForm());
  app.appendChild(addProductPage);
}

function renderAddProductForm() {
  const addProductFormWrapper = document.createElement("div");
  addProductFormWrapper.classList.add("add-product-form-wrapper");

  let productTitle = "";
  let productTags = "";
  let productPrice = "";

  const showProductEl = document.createElement("div");
  showProductEl.classList.add("show-product");
  // 옆에 보여주는 상품 정보
  const showProductTitle = document.createElement("div");
  showProductTitle.classList.add("show-product-title");
  showProductTitle.innerText = productTitle;

  const showProductTags = document.createElement("div");
  showProductTags.classList.add("show-product-tags");
  showProductTags.innerText = productTags;

  const showProductPrice = document.createElement("div");
  showProductPrice.classList.add("show-product-price");
  showProductPrice.innerText = productPrice;

  const showProductSubmitBtn = document.createElement("button");
  showProductSubmitBtn.classList.add("show-product-submit-btn");
  showProductSubmitBtn.classList.add("darken-btn");
  showProductSubmitBtn.innerText = "상품 추가";

  const showProductCancelBtn = document.createElement("button");
  showProductCancelBtn.classList.add("show-product-cancel-btn");
  showProductCancelBtn.classList.add("darken-btn");
  showProductCancelBtn.innerText = "취소";
  showProductCancelBtn.addEventListener("click", () => {
    router.navigate("/master");
    renderMasterPage();
  });
  //상품 정보 입력 요소
  const addProductForm = document.createElement("div");
  addProductForm.classList.add("add-product-form");

  const addProductFormTitle = document.createElement("div");
  addProductFormTitle.classList.add("add-product-form-title");
  addProductFormTitle.innerText = "상품 정보 입력";
  const addProductTitleInput = document.createElement("input");

  addProductTitleInput.classList.add("add-product-form-input");
  addProductTitleInput.placeholder = "상품 이름";
  addProductTitleInput.addEventListener("change", () => {
    productTitle = addProductTitleInput.value;
    showProductTitle.innerText = productTitle;
  });

  const addProductTagsInput = document.createElement("input");
  addProductTagsInput.classList.add("add-product-form-input");
  addProductTagsInput.placeholder = "상품 태그 (쉼표로 구분)";
  addProductTagsInput.addEventListener("change", () => {
    productTags = addProductTagsInput.value;
    showProductTags.innerText = productTags;
  });

  const addProductPriceInput = document.createElement("input");
  addProductPriceInput.classList.add("add-product-form-input");
  addProductPriceInput.placeholder = "상품 가격";
  addProductPriceInput.addEventListener("change", () => {
    productPrice = addProductPriceInput.value;
    showProductPrice.innerText = productPrice + "원";
  });

  const addProductThumbnailInput = document.createElement("input");
  addProductThumbnailInput.type = "file";
  addProductThumbnailInput.classList.add("add-product-form-input-img");
  addProductThumbnailInput.placeholder = "상품 이미지";

  addProductForm.append(
    addProductFormTitle,
    addProductThumbnailInput,
    addProductTitleInput,
    addProductTagsInput,
    addProductPriceInput
  );

  showProductEl.append(
    showProductTitle,
    showProductTags,
    showProductPrice,
    showProductSubmitBtn,
    showProductCancelBtn
  );

  addProductFormWrapper.append(showProductEl, addProductForm);
  return addProductFormWrapper;
}
