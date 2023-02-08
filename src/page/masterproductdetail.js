import "../style/masterproductdetail.scss";
import { getProductDetail } from "../utilities/productapi";
import { deleteMasterProduct, editMasterProduct } from "../utilities/masterapi";

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

  setBtnSoldout.addEventListener("click", soldOutBtnHandler($, productId));

  editBtn.addEventListener("click", editHandler(editBtn, saveBtn, $));
  saveBtn.addEventListener(
    "click",
    saveBtnHandler(editBtn, saveBtn, $, productId)
  );
  deleteBtn.addEventListener("click", async () => {
    function confirmDelete() {
      return confirm(
        "정말로 해당하는 상품을 영구히 지워지게 됩니다. 정말로 삭제하시겠습니까?"
      );
    }
    if (confirmDelete()) {
      await deleteMasterProduct(productId);
      alert("삭제되었습니다.");
      location.href = "/master";
    } else {
    }
  });
}

function alertMessageEl(parentEl, message, time) {
  const alertMessage = document.createElement("div");
  alertMessage.classList.add("alert-message");
  alertMessage.innerText = message;
  parentEl.appendChild(alertMessage);

  setTimeout(() => {
    alertMessage.classList.add("hidden");
    alertMessage.remove();
  }, time);
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
    <div class="product-detail__info__tags">${tagSpan}</div>
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

function soldOutBtnHandler($, productId) {
  return async (e) => {
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
  };
}

function editHandler(editBtn, saveBtn, $) {
  return () => {
    editBtn.classList.add("hidden");
    saveBtn.classList.remove("hidden");

    alertMessageEl(
      $(".product-detail"),
      "상품 정보를 수정할 수 있습니다.",
      2000
    );

    $(".product-detail__info__title").setAttribute("contenteditable", "true");
    $(".product-detail__info__price").setAttribute("contenteditable", "true");
    $(".product-detail__info__description").setAttribute(
      "contenteditable",
      "true"
    );
  };
}

function saveBtnHandler(editBtn, saveBtn, $, productId) {
  return async () => {
    editBtn.classList.remove("hidden");
    saveBtn.classList.add("hidden");
    const title = $(".product-detail__info__title");
    const price = $(".product-detail__info__price");
    const description = $(".product-detail__info__description");

    title.setAttribute("contenteditable", "false");
    price.setAttribute("contenteditable", "false");
    description.setAttribute("contenteditable", "false");

    const editedData = {
      id: productId,
      product: {
        title: title.innerText,
        price: price.innerText,
        description: description.innerText,
      },
    };

    await editMasterProduct(editedData);
  };
}
