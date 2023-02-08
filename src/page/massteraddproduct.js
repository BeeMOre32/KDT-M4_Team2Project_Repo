import "../style/masteraddproduct.scss";
import { router } from "../route";
import { renderMasterPage } from "./master";
export function renderAddProduct() {
  const app = document.querySelector("#app");
  const $ = (selector) => app.querySelector(selector);
  app.innerHTML = ``;

  const addProductPage = document.createElement("div");
  addProductPage.classList.add("add-product-page");

  const addProductPageTitle = document.createElement("h1");
  addProductPageTitle.innerText = "상품 추가";
  addProductPage.append(addProductPageTitle, renderAddProductForm());
  app.appendChild(addProductPage);

  let productTitle;
  let productTags;
  let productPrice;
  let productDescription;

  $(".show-product-cancel-btn").addEventListener("click", async () => {
    router.navigate("/master");
    await renderMasterPage();
  });
  $(".form-input-title").addEventListener("change", (e) => {
    productTitle = e.target.value;
    $(".show-product-title").innerText = productTitle;
  });
  $(".form-input-tags").addEventListener("change", (e) => {
    productTags = e.target.value;
    $(".show-product-tags").innerText = productTags;
  });
  $(".form-input-description").addEventListener("change", (e) => {
    productPrice = e.target.value;
    $(".show-product-price").innerText = productPrice;
  });
  $(".form-input-price").addEventListener("change", (e) => {
    productDescription = e.target.value;
    $(".show-product-description").innerText = productDescription;
  });
}

function renderAddProductForm() {
  const addProductFormWrapper = document.createElement("div");
  addProductFormWrapper.classList.add("add-product-form-wrapper");

  const showProductEl = document.createElement("div");
  showProductEl.classList.add("show-product");
  showProductEl.innerHTML = `
        <div class="show-product-img">
          <img src="" alt="" />
        </div>
        <div class="show-product-title"></div>
        <div class="show-product-tags"></div>
        <div class="show-product-price"></div>
        <div class="show-product-description"></div>
        <button class="show-product-submit-btn darken-btn">상품 추가</button>
        <button class="show-product-cancel-btn darken-btn">취소</button>
  `;

  const addProductForm = document.createElement("div");
  addProductForm.classList.add("add-product-form");
  addProductForm.innerHTML = `
        <div class="add-product-form-title">상품 정보 입력</div>
        <div class="form-input-img">
        <div class="form-input-img__sumnail">클릭하여 상품 썸네일 업로드 하기
          <input
          type="file"
          class="form-input-img__sumnail"
          placeholder="상품 썸네일"/>
          </div>
         
          <div class="form-input-img__sumnail">클릭하여 상품 상세사진 업로드 하기
            <input
          type="file"
          class="form-input-img__detail"
          placeholder="상품 상세 이미지"/>
          </div>
        
          
          <img src="https://picsum.photos/200" alt="" class="sumnail">
      
         </div>
        
        <input class="form-input-title" placeholder="상품 이름" />
        <input
          class="form-input-tags"
          placeholder="상품 태그 (쉼표로 구분)"/>
          <input type="text" class="form-input-description" placeholder="설명">
        <input class="form-input-price" placeholder="상품 가격" />
  `;

  addProductFormWrapper.append(showProductEl, addProductForm);
  return addProductFormWrapper;
}
