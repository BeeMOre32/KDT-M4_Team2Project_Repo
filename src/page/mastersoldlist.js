import { editMasterSold, getMasterAllSoldList } from "../utilities/masterapi";
import "../style/mastersoldlist.scss";
export async function renderSoldProduct() {
  const app = document.querySelector("#app");
  const $ = (selector) => app.querySelector(selector);
  const $$ = (selector) => app.querySelectorAll(selector);
  let page = 1;
  app.innerHTML = "";

  const loading = document.createElement("span");
  loading.classList.add("loading");
  loading.innerText = "loading...";
  app.appendChild(loading);

  const soldProductPage = document.createElement("div");

  soldProductPage.classList.add("sold-product-page");
  const soldProductPageTitle = document.createElement("h1");
  soldProductPageTitle.innerText = "팔린 상품 목록";
  const soldProductDetail = document.createElement("div");
  soldProductDetail.classList.add("sold-product-detail");

  const data = await getMasterAllSoldList();

  soldProductPage.append(
    soldProductPageTitle,
    soldProductDetail,
    renderSoldTitle(),
    await renderSoldList(data, page, true, soldProductPage, $, $$)
  );
  app.appendChild(soldProductPage);

  $$(".page-nation-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      page = e.target.dataset.page;
      $$(".page-nation-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      e.target.classList.add("active");
      soldProductPage.replaceChild(
        await renderSoldList(data, page, false, soldProductPage, $, $$),
        $$(".sold-list")[0]
      );
    });
  });
}

async function renderSoldList(data, page, isFirst = true, parentNode, $, $$) {
  data = data.sort((a, b) => {
    return new Date(b.timePaid) - new Date(a.timePaid);
  });
  let dataArr = data.slice((page - 1) * 8, page * 8);

  const soldList = document.createElement("div");
  soldList.classList.add("sold-list");

  const pageNumber = Math.ceil(data.length / 8);

  if (isFirst) {
    parentNode.append(renderPageNationBtn(pageNumber));
  } else soldList.innerHTML = "";

  document.querySelector(".loading")?.remove();

  dataArr.forEach((product) => {
    const soldProduct = document.createElement("div");
    soldProduct.classList.add("sold-product");
    soldProduct.dataset.id = product.detailId;
    const soldDate = product.timePaid.slice(0, 10);

    soldProduct.addEventListener("click", async (e) => {
      console.log(e.target.closest(".sold-product").dataset.id);
      const detailId = e.target.closest(".sold-product").dataset.id;
      await renderSoldDetail(detailId, data, $, $$);
    });

    const productSold = document.createElement("div");
    productSold.classList.add("sold-product-sold");
    productSold.classList.add("list");
    productSold.dataset.id = product.detailId;
    if (product.done === false) {
      productSold.innerHTML = `
       <div class="product-sold-indicator sale"></div>
       <span class="product-sold-span">구매 미확정</span>
      `;
    } else {
      productSold.innerHTML = `
       <div class="product-sold-indicator sold"></div>
       <span class="product-sold-span">구매 확정!</span>
      `;
    }

    soldProduct.innerHTML = `
        <div class="sold-product-name">${product.product.title}</div>
        <div class="sold-product-price">${product.product.price}원</div>
        <div class="sold-product-sold-date">${soldDate}</div>
    `;

    soldProduct.append(productSold);
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
    <div class="sold-product-done"> 판매완료
      <span class="material-symbols-outlined">done</span>
    </div>
  `;

  return soldTitle;
}

function renderPageNationBtn(totalPage) {
  const pageNationBtn = document.createElement("div");
  pageNationBtn.classList.add("page-nation");

  for (let i = 1; i <= totalPage; i++) {
    const pageNation = document.createElement("button");
    pageNation.classList.add("page-nation-btn");
    pageNation.innerText = String(i);
    pageNation.dataset.page = String(i);
    if (i === 1) pageNation.classList.add("active");
    pageNationBtn.appendChild(pageNation);
  }

  return pageNationBtn;
}

async function renderSoldDetail(detailId, data, $, $$) {
  data = data.find((product) => {
    return product.detailId === detailId;
  });

  const soldDetail = $(".sold-product-detail");
  soldDetail.innerHTML = "";
  soldDetail.classList.add("active");

  const paidDate = data.timePaid.slice(0, 10);
  const tags = data.product.tags;

  const tagEl = tags
    .map((tag) => {
      return `<span class="product-tag">${tag}</span>`;
    })
    .join("");

  const productSold = document.createElement("div");
  if (data.done === false) {
    productSold.innerHTML = `
       <div class="product-sold-indicator sale"></div>
       <span class="product-sold-span">구매 미확정</span>
      `;
  } else {
    productSold.innerHTML = `
       <div class="product-sold-indicator sold"></div>
       <span class="product-sold-span">구매 확정!</span>
      `;
  }

  soldDetail.innerHTML = `
  <div class="detail-title" style="background-image: url(${data.product.thumbnail})">
   <span class="material-symbols-outlined detail-close">close</span>
   <span class="detail-title-title">${data.product.title}</span>
  </div>
  <div class="detail-data">
   <div class="detail-date">
    <span>결제된 날 <span class="material-symbols-outlined">date_range</span></span>
    <span>${paidDate}</span>
   </div>
    <div class="detail-customer">
     <span>구매자 정보 <span class="material-symbols-outlined">person</span></span>
      <span>${data.user.displayName}</span>
    </div>
  </div>
  <div class="detail-product">
   <div class="detail-product-price">
    <span>가격 <span class="material-symbols-outlined">payments</span></span>
    <span>${data.product.price}원</span>
   </div>
    <div class="detail-product-tags">
      <span>태그 <span class="material-symbols-outlined">local_offer</span></span>
      <div>${tagEl}</div>
   </div>
  </div>
  <div class="detail-payment">
   <span>결제 정보 <span class="material-symbols-outlined">payment</span></span>
   <div class="detail-payment-info">
      <div class="detail-payment-info-content">계좌 종류: ${data.account.bankName}</div>
      <div class="detail-payment-info-content">계좌 번호: ${data.account.accountNumber}</div>
    </div>
  </div>
  <div class="detail-sold">
    현재 상태
    <div class="sold-product-sold">${productSold.innerHTML}</div>
    <div class="detail-sold-button">
      <button class="detail-sold-button-cancel sale">판매 취소</button>
      <button class="detail-sold-button-done sold">판매 완료</button>
    </div>
  </div>
  `;

  $(".detail-close").addEventListener("click", () => {
    soldDetail.classList.remove("active");
  });

  $(".detail-sold-button-cancel").addEventListener("click", async () => {
    const data = {
      isCanceled: true,
      done: false,
    };

    const result = await editMasterSold(detailId, data);
    if (result === true) {
      $(".sold-product-sold").innerHTML = `
        <div class="product-sold-indicator sale"></div>
        <span class="product-sold-span">구매 미확정</span>
      `;

      $$(".sold-product-sold.list").forEach((el) => {
        if (el.dataset.id === detailId) {
          el.innerHTML = `
            <div class="product-sold-indicator sale"></div>
            <span class="product-sold-span">구매 미확정</span>
          `;
        }
      });
    }
  });

  $(".detail-sold-button-done").addEventListener("click", async () => {
    const data = {
      done: true,
    };

    const result = await editMasterSold(detailId, data);
    if (result === true) {
      $(".sold-product-sold").innerHTML = `
        <div class="product-sold-indicator sold"></div>
        <span class="product-sold-span">구매 확정!</span>
      `;
      $$(".sold-product-sold.list").forEach((el) => {
        if (el.dataset.id === detailId) {
          el.innerHTML = `
            <div class="product-sold-indicator sold"></div>
            <span class="product-sold-span">구매 확정!</span>
          `;
        }
      });
    }
  });
}
