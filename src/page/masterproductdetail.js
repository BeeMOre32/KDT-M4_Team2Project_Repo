import "../style/masterproductdetail.scss";
import { getProductDetail } from "../utilities/productapi";
import { editMasterProduct } from "../utilities/masterapi";

export async function renderMasterProductDetailPage(productId) {
  const app = document.querySelector("#app");
  app.innerHTML = "";
  const $ = (selector) => app.querySelector(selector);

  const data = await getProductDetail(productId);

  console.log(data);
  const productDetailPage = document.createElement("div");
  productDetailPage.classList.add("product-detail-page");
  productDetailPage.appendChild(renderProductDetail(data));
  app.appendChild(productDetailPage);

  const editBtn = $(".edit-btn");
  const saveBtn = $(".save-btn");
  const setBtnSoldout = $(".set-btn__soldout");
  const deleteBtn = $(".delete-btn");

  setBtnSoldout.addEventListener("click", async (e) => {
    const saleTag = $(".sale");

    if (saleTag.classList.contains("soldout")) {
      saleTag.classList.remove("soldout");
      saleTag.classList.add("onsale");
      saleTag.innerText = "판매중";

      e.target.classList.remove("soldout");
      e.target.classList.add("onsale");
      e.target.innerText = "매진으로 설정";

      try {
        await editMasterProduct({
          id: productId,
          product: { isSoldOut: false },
        });
      } catch (error) {
        alert("판매중으로 설정하는데 실패했습니다." + error);
      }
    } else {
      saleTag.classList.remove("onsale");
      saleTag.classList.add("soldout");
      saleTag.innerText = "매진";

      e.target.classList.remove("onsale");
      e.target.classList.add("soldout");
      e.target.innerText = "판매중으로 설정";

      try {
        await editMasterProduct({
          id: productId,
          product: { isSoldOut: true },
        });
      } catch (error) {
        alert("매진으로 설정하는데 실패했습니다." + error);
      }
    }
  });

  editBtn.addEventListener("click", editHandler(editBtn, saveBtn, $));
  saveBtn.addEventListener("click", () => {
    editBtn.classList.remove("hidden");
    saveBtn.classList.add("hidden");
    const title = $(".product-detail__info__title");
    const price = $(".product-detail__info__price");
    const description = $(".product-detail__info__description");

    title.setAttribute("contenteditable", "false");
    price.setAttribute("contenteditable", "false");
    description.setAttribute("contenteditable", "false");
  });
}

function renderProductDetail(data) {
  const productDetail = document.createElement("div");
  productDetail.classList.add("product-detail");

  let soldOutBtn = data.isSoldOut ? "판매중으로 설정" : "매진으로 설정";
  let tagSpan = data.tags;
  tagSpan = tagSpan.map((tag) => `<span>${tag}</span>`).join("");
  if (data.isSoldOut === true) {
    tagSpan += `<span class="sale soldout">매진</span>`;
  } else {
    tagSpan += `<span class="sale onsale">판매중</span>`;
  }

  productDetail.innerHTML = `
  <div class="product-detail__img">
    <img src="${data.thumbnail}" alt="${data.title}" />
    <img src="${data.photo}" alt="${data.title}" />
  </div>
  <div class="product-detail__info">
    <div class="product-detail__info__title">${data.title}</div>
    <div class="product-detail__info__price">${data.price}원</div>
    <div class="product-deatil__info__tags">${tagSpan}</div>
    <div class="product-detail__info__description">${data.description}</div>
  </div>
  <div class="product-detail__btns">
    <button class="edit-btn common-btn">상품 정보 수정</button>
    <button class="save-btn darken-btn hidden">변경사항 저장</button>
    <button class="set-btn__soldout common-btn">${soldOutBtn}</button>
    <button class="delete-btn common-btn">이 상품삭제</button>
</div>
  `;
  return productDetail;
}

function editHandler(editBtn, saveBtn, $) {
  return () => {
    editBtn.classList.add("hidden");
    saveBtn.classList.remove("hidden");
    $(".product-detail__info__title").setAttribute("contenteditable", "true");
    $(".product-detail__info__price").setAttribute("contenteditable", "true");
    $(".product-detail__info__description").setAttribute(
      "contenteditable",
      "true"
    );
  };
}
