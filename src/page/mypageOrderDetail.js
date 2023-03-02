import "../style/mypageCommon.scss";
import "../style/mypageOrderDetail.scss";
import "../style/loadingmypage.scss";
import { router } from "../route";
import { userToken, afterLoadUserAuth } from "../utilities/userAuth";
import {
  userAuth,
  userInfoEdit,
  getBankAccount,
  getCurrentAccount,
  addBankAccount,
} from "../utilities/userapi";
import {
  getBuyList,
  getBuyDetail,
  getProductDetail,
  cancelBuy,
  confirmBuy,
} from "../utilities/productapi";
import {
  renderSideMenu,
  cancelDoneBtns,
  repurchaseBtn,
  handlingLoading,
} from "../page/mypageCommon";

export async function renderOrderDetail(detailId) {
  const app = document.querySelector("#app");
  app.innerHTML = "";
  app.append(handlingLoading(true));

  const loginState = await afterLoadUserAuth(); // 토큰 유무/유효 검증
  if (!loginState) {
    const loading = document.querySelector(".skeleton");
    loading.remove();

    const loginMessageEl = document.createElement("div");
    loginMessageEl.className = "loginMessage";
    loginMessageEl.innerText = "로그인이 필요합니다!";

    app.append(loginMessageEl);
  } else {
    const sectionEl = document.createElement("section");
    sectionEl.className = "myPage";
    const articleEl = document.createElement("article");

    const profile = await userAuth(userToken._token);

    await renderSideMenu(sectionEl, articleEl);

    const orderDetail = await getBuyDetail(userToken._token, detailId);
    const localTime = new Date(orderDetail.timePaid);
    console.log(orderDetail);

    articleEl.innerHTML = /*html*/ `
    <h1>주문 상세</h1>
    <div class="productInfo info">
      <div class="header">상품 정보</div>
      <div class="productInfo__img backgroundimg">
        <img src="${
          orderDetail.product.thumbnail
        }" alt="profileImg" class="productInfo__img img">
      </div>
      <div class="productInfo__state"></div>
      <div class="productInfo__title">${orderDetail.product.title}</div>
      <div class="productInfo__price">${orderDetail.product.price.toLocaleString()}원</div>
      <div class="productInfo__button"></div>   
    </div>
    <div class="ordererInfo info">
      <div class="header">주문자 정보</div>
      <div class="ordererInfo__name"><span>이름</span>${
        profile.displayName
      }</div>
      <div class="ordererInfo__email"><span>메일</span>${profile.email}</div>
    </div>
    <div class="paymentInfo info">
      <div class="header">결제 정보</div>
      <div class="paymentInfo__way">계좌 간편결제</div>
      <div class="paymentInfo__bankName">${orderDetail.account.bankName}</div>
      <div class="paymentInfo__accountNumber">${
        orderDetail.account.accountNumber
      }</div>
      <div class="paymentInfo__price">${orderDetail.product.price.toLocaleString()}원</div>
      <div class="paymentInfo__timePaid">${localTime.toLocaleString(
        "ko-kr"
      )}</div>
    </div>
    `;
    app.append(sectionEl);

    const stateEl = document.querySelector(".productInfo__state");
    if (orderDetail.isCanceled === false && orderDetail.done === false) {
      stateEl.textContent = "[결제완료]";
      stateEl.style.color = "#000";
    } else if (orderDetail.isCanceled === true) {
      stateEl.textContent = "[반품환불완료]";
    } else if (orderDetail.done === true) {
      stateEl.textContent = "[구매확정완료]";
    }

    const thumbnailEl = document.querySelector(".img");

    if (!orderDetail.product.thumbnail) {
      thumbnailEl.remove();
    }

    const productInfoBtns = document.querySelector(".productInfo__button");

    if (orderDetail.isCanceled === false && orderDetail.done === false) {
      const btnsEl = document.createElement("div");
      btnsEl.className = "productInfo__button__btns";

      const isCanceledBtnEl = document.createElement("button");
      isCanceledBtnEl.setAttribute("type", "button");
      isCanceledBtnEl.textContent = "주문취소";
      isCanceledBtnEl.classList.add("red-btn");
      const doneBtnEl = document.createElement("button");
      doneBtnEl.setAttribute("type", "button");
      doneBtnEl.textContent = "구매확정";
      doneBtnEl.classList.add("darken-btn");

      btnsEl.append(isCanceledBtnEl, doneBtnEl);

      productInfoBtns.append(btnsEl);

      // 주문취소, 구매확정 버튼 이벤트 함수
      cancelDoneBtns(isCanceledBtnEl, doneBtnEl, orderDetail.detailId);
    } else {
      const repurchaseBtnEl = document.createElement("button");
      repurchaseBtnEl.setAttribute("type", "button");
      repurchaseBtnEl.textContent = "재구매";
      repurchaseBtnEl.classList.add("common-btn");

      productInfoBtns.append(repurchaseBtnEl);

      // === 재구매 버튼 이벤트 함수 ===
      const { product } = orderDetail;
      const { id, price, thumbnail, title } = product;
      repurchaseBtn(repurchaseBtnEl, id, price, thumbnail, title);
    }

    // 해당 제품이 현재 판매중인지 확인
    const isCurrentTrue = await getProductDetail(orderDetail.product.productId);

    const productInfoEl = document.querySelector(".productInfo");
    productInfoEl.setAttribute("id", `${orderDetail.product.productId}`);
    productInfoEl.addEventListener("click", () => {
      if (isCurrentTrue === "유효한 제품 정보가 아닙니다.") {
        window.alert("현재 판매하는 제품이 아닙니다.");
      } else {
        router.navigate(`/product/detail/${productInfoEl.id}`);
      }
    });

    // (제품정보 페이지 이동) 이벤트 capturing 막기 위함
    // -> 버튼은 다른 동작필요
    productInfoBtns.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    const loading = document.querySelector(".skeleton");
    loading.remove();
  }
}
