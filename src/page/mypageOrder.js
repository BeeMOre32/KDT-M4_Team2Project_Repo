import "../style/mypageCommon.scss";
import "../style/mypageOrder.scss";
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

export async function renderOrderHisory() {
  const app = document.querySelector("#app");
  app.innerHTML = "";

  app.append(handlingLoading());

  const loginState = await afterLoadUserAuth(); // 토큰 유무/유효 검증
  if (!loginState) {
    const loginMessageEl = document.createElement("div");
    loginMessageEl.className = "loginMessage";
    loginMessageEl.innerText = "로그인이 필요합니다!";

    app.append(loginMessageEl);
  } else {
    const sectionEl = document.createElement("section");
    sectionEl.className = "myPage";
    const articleEl = document.createElement("article");

    const buyList = await getBuyList(userToken._token);

    await renderSideMenu(sectionEl, articleEl);

    const titleEl = document.createElement("h1");
    titleEl.textContent = "나의 주문";

    const contentEl = document.createElement("div");
    contentEl.className = "buyList";

    const buyListSort = buyList.sort(
      (a, b) => new Date(b.timePaid) - new Date(a.timePaid)
    );

    await renderBuyList(contentEl, buyListSort);

    articleEl.append(titleEl, contentEl);

    app.append(sectionEl);

    const loading = document.querySelector(".skeleton");
    loading?.remove();
  }
}

async function renderBuyList(contentEl, buyList) {
  const buyItemEl = buyList.map((item) => {
    const buyItemLiEl = document.createElement("a");
    buyItemLiEl.className = "buyItemLi";

    const stateEl = document.createElement("div");
    stateEl.className = "buyItemLi__state";
    if (item.isCanceled === false && item.done === false) {
      stateEl.textContent = "결제완료";
      stateEl.style.color = "#000";
    } else if (item.isCanceled === true) {
      stateEl.textContent = "반품환불완료";
    } else if (item.done === true) {
      stateEl.textContent = "구매확정완료";
    }

    const thumbnailEl = document.createElement("div");
    thumbnailEl.className = "buyItemLi__thumbnail";

    if (item.product.thumbnail) {
      thumbnailEl.style.backgroundImage = `url(${item.product.thumbnail})`;
      thumbnailEl.style.backgroundSize = "cover";
    }

    const summaryEl = document.createElement("div");
    summaryEl.className = "buyItemLi__summary";

    const timePaidEl = document.createElement("div");
    timePaidEl.className = "buyItemLi__summary__timePaid";
    const localTime = new Date(item.timePaid);

    timePaidEl.textContent = `${localTime.toLocaleDateString("ko-Kr")} 결제`;

    const titleEl = document.createElement("div");
    titleEl.className = "buyItemLi__summary__title";
    titleEl.textContent = `${item.product.title}`;

    const priceEl = document.createElement("div");
    priceEl.className = "buyItemLi__summary__price";
    priceEl.textContent = `${item.product.price.toLocaleString()}원`;

    summaryEl.append(timePaidEl, titleEl, priceEl);

    const repurchaseBtnEl = document.createElement("button");

    if (item.isCanceled === false && item.done === false) {
      const btnsEl = document.createElement("div");
      btnsEl.className = "buyItemLi__summary__btns";

      const isCanceledBtnEl = document.createElement("button");
      isCanceledBtnEl.setAttribute("type", "button");
      isCanceledBtnEl.textContent = "주문취소";
      isCanceledBtnEl.classList.add("red-btn");
      const doneBtnEl = document.createElement("button");
      doneBtnEl.setAttribute("type", "button");
      doneBtnEl.textContent = "구매확정";
      doneBtnEl.classList.add("darken-btn");

      btnsEl.append(isCanceledBtnEl, doneBtnEl);

      summaryEl.append(btnsEl);

      // 주문취소, 구매확정 버튼 이벤트 함수
      cancelDoneBtns(isCanceledBtnEl, doneBtnEl, item.detailId);
    } else {
      repurchaseBtnEl.setAttribute("type", "button");
      repurchaseBtnEl.textContent = "재구매";
      repurchaseBtnEl.classList.add("common-btn");

      summaryEl.append(repurchaseBtnEl);

      // === 재구매 버튼 이벤트 함수 ===
      const { product } = item;
      const { id, price, thumbnail, title } = product;
      repurchaseBtn(repurchaseBtnEl, id, price, thumbnail, title);
    }

    buyItemLiEl.append(stateEl, thumbnailEl, summaryEl);

    buyItemLiEl.setAttribute("id", `${item.detailId}`);
    buyItemLiEl.addEventListener("click", () => {
      router.navigate(`/mypage/order/detail/${buyItemLiEl.id}`);
    });

    repurchaseBtnEl.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    return buyItemLiEl;
  });
  contentEl.append(...buyItemEl);
}
