import "../style/masteraddproduct.scss";
import { router } from "../route";
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
  let productTags = [];
  let productPrice;
  let productDescription;
  let productThumbnail = "";
  let productDetail = "";
  let productType = ["chair", "table", "bed", "closet"];

  $(".show-product-cancel-btn").addEventListener("click", async () => {
    router.navigate("/master");
  });
  $(".form-input-title").addEventListener("change", (e) => {
    productTitle = e.target.value;
    $(".show-product-title").innerText = productTitle;
  });

  $(".form-input-description").addEventListener("change", (e) => {
    productDescription = e.target.value;
    $(".show-product-description").innerText = productDescription;
  });
  $(".form-input-price").addEventListener("change", (e) => {
    productPrice = e.target.value;
    $(".show-product-price").innerText = productPrice + "원";
  });

  $(".form-input-tags__type")
    .querySelectorAll("input")
    .forEach((input) => {
      input.addEventListener("change", onTagSaleHandler(productTags, $, $$));
    });

  $(".tags__type").addEventListener("change", (e) => {
    let duplicatedValue = productTags.filter((element) => {
      return productType.includes(element);
    });
    console.log(duplicatedValue, "duplicatedValue");
    if (productTags.includes(e.target.value)) {
      productTags = productTags.filter((tag) => tag !== e.target.value);
      $$(".tags__show .tag").forEach((tag) => {
        if (tag.innerText === e.target.value) {
          tag.remove();
        }
      });
    }
    if (duplicatedValue.length === 0) {
      productTags.splice(0, 0, e.target.value);
      renderTags(e, $$);
    } else {
      productTags = productTags.filter((tag) => tag !== duplicatedValue[0]);
      $$(".tags__show .tag").forEach((tag) => {
        if (tag.innerText === duplicatedValue[0]) {
          tag.remove();
        }
      });

      productTags.splice(0, 0, e.target.value);
      renderTags(e, $$);
    }
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
          // $(".show-product-img").classList.remove("hidden");
          $$(".thumbnail").forEach((thumbnail) => {
            thumbnail.setAttribute("src", e.target.result);
          });
        } else {
          productDetail = e.target.result;
          // $(".show-product-img").classList.remove("hidden");
          $$(".detail").forEach((detail) => {
            detail.setAttribute("src", e.target.result);
          });
        }
      });
    };
  }

  $(".show-product-submit-btn").addEventListener("click", async () => {
    const data = {
      title: productTitle,
      price: Number(productPrice),
      description: productDescription,
      tags: productTags,
      thumbnailBase64: productThumbnail,
      photoBase64: productDetail,
    };
    console.log(data.tags);
    const res = await postMasterProduct(data);
    if (typeof res === "string") {
      alert("상품 추가에 실패했습니다.");
    } else {
      router.navigate("/master");
    }
  });
}

function renderAddProductForm() {
  const addProductFormWrapper = document.createElement("div");
  addProductFormWrapper.classList.add("add-product-form-wrapper");

  const showProductEl = document.createElement("div");
  showProductEl.classList.add("show-product");
  showProductEl.innerHTML = /* html */  `
        <div class="show-product-img">
          <span>썸네일</span>
          <img src="https://img.apti.co.kr/aptHome/images/sub/album_noimg.gif" alt="" class="thumbnail" />
          <span>상세사진</span>
          <img src="https://img.apti.co.kr/aptHome/images/sub/album_noimg.gif" alt="" class="detail" />
        </div>
        <div class="show-product-title">상품명</div>
        <div class="show-product-tags">
          <div class="tags__show"></div>
         </div>
         <div class="show-product-price">상품 가격</div>
        <div class="show-product-description">상품 설명</div>
        <button class="show-product-submit-btn darken-btn">상품 추가</button>
        <button class="show-product-cancel-btn red-btn">취소</button>
  `;

  const addProductForm = document.createElement("div");
  addProductForm.classList.add("add-product-form");
  addProductForm.innerHTML = /* html */ `
        <div class="add-product-form-title">상품 정보 입력</div>
        <div class="form-input-img">
          <div class="form-input-img__thumbnail">
            <label>
              <img src="https://www.youngone.co.kr/static/images/noimage.jpg" alt="" class="thumbnail">
              <input
                type="file"
                class="form-input-img__thumbnail"
                placeholder="상품 썸네일"/>
              <span class="darken-btn">상품 썸네일 추가</span>
            </label>
          </div>
         
          <div class="form-input-img__detail">
            <label>
              <img src="https://www.youngone.co.kr/static/images/noimage.jpg" alt="" class="detail">
              <input
                type="file"
                class="form-input-img__detail"
                placeholder="상품 상세 이미지"/>
              <span class="darken-btn">상세 이미지 추가</span>
            </label>
          </div>
        </div>
        <div class="form-input-wrapper">
          <div class="form-input-info">
            <input class="form-input-title" placeholder="상품 이름" />
            <input class="form-input-price" placeholder="상품 가격" />
            <input class="form-input-description" placeholder="상품 설명" />
          </div>
          <div class="form-input-tags">
          <div class="form-input-tags__input">
            <h1>아래에 있는 선택자를 활용하여 태그를 입력해주세요</h1>
            <div class="form-input-tags__type">
            <input type="checkbox" id="sale" value="sale"> <label for="sale">할인상품</label> 
            <input type="checkbox" id="new"  value="new"> <label for="new">신상품</label> 
            <input type="checkbox" id="best"  value="best"> <label for="best">베스트상품</label> 
            </div>
            <div class="tags__show"></div>
          </div>
          <div class="form-input-category">
            <select  class="tags__type">
              <option value="" disabled selected>가구 종류</option>
              <option value="chair">의자</option>
              <option value="bed">침대</option>
              <option value="table">테이블</option>
              <option value="closet">수납장</option>
            </select>
          </div>
        </div>
      `;

  addProductFormWrapper.append(showProductEl, addProductForm);
  return addProductFormWrapper;
}

function onTagSaleHandler(productTags, $, $$) {
  return (e) => {
    if (e.target.checked) {
      productTags.push(e.target.value);
      renderTags(e, $$);
    } else {
      productTags = productTags.filter((tag) => tag !== e.target.value);
      $$(".tags__show .tag").forEach((tag) => {
        if (tag.innerText === e.target.value) {
          tag.remove();
        }
      });
    }
  };
}

function renderTags(e, $$) {
  $$(".tags__show").forEach((tags) => {
    const tag = document.createElement("span");
    tag.classList.add("tag");
    tag.innerText = e.target.value;
    tags.appendChild(tag);
  });
}
