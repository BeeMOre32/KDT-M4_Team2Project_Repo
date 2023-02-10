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
  const categorySelect = $("select");
  const tagSelect = $("form");
  const checkboxes = tagSelect.querySelectorAll("input[type=checkbox]");

  let newTags = [...data.tags];

  renderTags(newTags)
  categorySelect.value = data.tags[0];
  checkboxes.forEach((checkbox) => {
    if(newTags.includes(checkbox.value)) {
      checkbox.checked = true;
    }
  })

  categorySelect.addEventListener("change", () => {
    newTags[0] = categorySelect.value;
    renderTags(newTags)
  });

  tagSelect.addEventListener('change', (e) => {
    const inputEl = e.target;

    if(inputEl.checked && !newTags.includes(e.target.value)) {
      newTags.push(e.target.value)
    }
    if(!inputEl.checked && newTags.includes(e.target.value)) {
      newTags = newTags.filter((tag) => tag !== e.target.value)
    }

    renderTags(newTags)
  })

  setBtnSoldout.addEventListener("click", soldOutBtnHandler($, productId));

  editBtn.addEventListener("click", editHandler(editBtn, saveBtn, $));
  saveBtn.addEventListener(
    "click", () => {
      saveBtnHandler(editBtn, saveBtn, $, newTags, productId)
    }
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
  const onSale =  data.isSoldOut ? "매진" : "판매중"

  productDetail.innerHTML = /* html */`
  <div class="product-detail__img">
    <span>썸네일 이미지<span>
    <img src="${data.thumbnail}" alt="${data.title}" />
    <span>상세정보 이미지<span>
    <img src="${data.photo}" alt="${data.title}" />
  </div>
  <div class="product-detail__info">
    <div class="product-detail__info__sale">
      <span class="sale soldout">${onSale}</span>
    </div>
    <div class="product-detail__info__title">${data.title}</div>
    <div class="product-detail__info__price">${data.price}원</div>
    <div class="product-detail__info__tags">
      <div class="tags"></div>
      <div class="edit__tags hidden">
        <select name="category" id="category">
          <option value="bed">침대</option>
          <option value="table">테이블</option>
          <option value="chair">의자</option>
          <option value="closet">수납</option>
        </select>
        <form class="select-tag">
          <label>
            <input type="checkbox" name="tag" value="new" />
            <span>new</span>
          </label>
          <label>
            <input type="checkbox" name="tag" value="best" />
            <span>best</span>
          </label>
          <label>
            <input type="checkbox" name="tag" value="sale" />
            <span>sale</span>
          </label>
        </form>
      </div>
    </div>
    <div class="product-detail__info__description">${data.description}</div>
    <div class="product-detail__btns">
      <button class="edit-btn common-btn">상품 정보 수정</button>
      <button class="save-btn darken-btn hidden">변경사항 저장</button>
      <button class="set-btn__soldout common-btn">${soldOutBtn}</button>
      <button class="delete-btn common-btn">이 상품삭제</button>
    </div>
  </div>
  `;

  return productDetail;
}

function renderTags(tags) {
  const tagsEl = document.querySelector(".product-detail__info__tags .tags");
  tagsEl.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join("")
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
    $(".edit__tags").classList.remove("hidden");

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

async function saveBtnHandler(editBtn, saveBtn, $, newTags, productId) {
  editBtn.classList.remove("hidden");
  saveBtn.classList.add("hidden");
  $(".edit__tags").classList.add("hidden");

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
      tags: newTags
    },
  };

  await editMasterProduct(editedData);
}
