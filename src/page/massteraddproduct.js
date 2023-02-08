import "../style/masteraddproduct.scss";
import { router } from "../route";
import { renderMasterPage } from "./master";
import { postMasterProduct } from "../utilities/masterapi";

export function renderAddProduct() {
  const app = document.querySelector("#app");
  const $ = (selector) => app.querySelector(selector);
  const $$ = (selector) => app.querySelectorAll(selector);
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
  let productThumbnail = "";
  let productDetail = "";

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
    productDescription = e.target.value;
    $(".show-product-description").innerText = productDescription;
  });
  $(".form-input-price").addEventListener("change", (e) => {
    productPrice = e.target.value;
    $(".show-product-price").innerText = productPrice + "원";
  });

  $(".form-input-img__thumbnail").addEventListener(
    "change",
    imgSubmitHandler(productThumbnail, true, $, $$)
  );
  $(".form-input-img__detail").addEventListener(
    "change",
    imgSubmitHandler(productDetail, false, $, $$)
  );

  function imgSubmitHandler(imgUrl, thumbnail, $, $$) {
    return (e) => {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener("load", (e) => {
        if (thumbnail) {
          productThumbnail = e.target.result;
          console.log(productThumbnail);
          $(".show-product-img").classList.remove("hidden");
          $$(".thumbnail").forEach((thumbnail) => {
            thumbnail.setAttribute("src", e.target.result);
          });
        } else {
          productDetail = e.target.result;
          console.log(productDetail);
          $(".show-product-img").classList.remove("hidden");
          $(".detail").setAttribute("src", e.target.result);
        }
      });
    };
  }

  $(".show-product-submit-btn").addEventListener("click", async () => {
    const data = {
      title: productTitle,
      price: Number(productPrice),
      description: productDescription,
      tags: productTags?.split(",").map((tag) => tag.trim()),
      thumbnailBase64: productThumbnail,
      photoBase64: productDetail,
    };

    const res = await postMasterProduct(data);
    if (res === 200) {
      router.navigate("/master");
    } else {
      alert("상품 추가에 실패했습니다. 항목란이 비어있는지 확인해주세요.");
    }
  });
}

function renderAddProductForm() {
  const addProductFormWrapper = document.createElement("div");
  addProductFormWrapper.classList.add("add-product-form-wrapper");

  const showProductEl = document.createElement("div");
  showProductEl.classList.add("show-product");
  showProductEl.innerHTML = `
        <div class="show-product-img hidden">
          <img src="" alt="" class="thumbnail" />
          <img src="" alt="" class="detail" />
        </div>
        <div class="show-product-title"></div>
        <div class="show-product-tags"></div>
        <div class="show-product-description"></div>
        <div class="show-product-price"></div>
        <button class="show-product-submit-btn darken-btn">상품 추가</button>
        <button class="show-product-cancel-btn darken-btn">취소</button>
  `;

  const addProductForm = document.createElement("div");
  addProductForm.classList.add("add-product-form");
  addProductForm.innerHTML = `
        <div class="add-product-form-title">상품 정보 입력</div>
        <div class="form-input-img">
          <div class="form-input-img__thumbnail">
   
           <input
          type="file"
          class="form-input-img__thumbnail"
          placeholder="상품 썸네일"/>
          <span>상품 썸네일 추가</span>
          </div>
         
          <div class="form-input-img__detail">
            <input
            type="file"
            class="form-input-img__detail"
            placeholder="상품 상세 이미지"/>
            <span>상세 이미지 추가</span>
          </div>
        
          <img src="" alt="" class="thumbnail">
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
