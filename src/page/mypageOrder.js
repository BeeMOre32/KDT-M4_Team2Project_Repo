import "../style/mypageCommon.scss";
import "../style/mypageOrder.scss";
import "../style/loadingmypage.scss";
import { router } from "../route";
import { userToken, afterLoadUserAuth } from "../utilities/userAuth";
import { userAuth, getCurrentAccount } from "../utilities/userapi";
import { getBuyList } from "../utilities/productapi";
import {
  renderSideMenu,
  cancelDoneBtns,
  repurchaseBtn,
  handlingLoading,
} from "../page/mypageCommon";

// mypage/order 페이지
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

    const profile = await userAuth(userToken._token);
    const buyList = await getBuyList(userToken._token);
    const accountList = await getCurrentAccount(userToken._token);

    await renderSideMenu(sectionEl, articleEl, profile, buyList, accountList);

    const titleEl = document.createElement("h1");
    titleEl.textContent = "나의 주문";

    const contentEl = document.createElement("div");
    contentEl.className = "buyList";

    // 주문내역이 아직 없는 경우와 있는 경우를 구분하여 화면 출력
    if(buyList.length === 0){
      contentEl.innerHTML = /*html*/`
      <span class="emptyBuyList">아직 주문 내역이 없습니다!</span>
      `
    }
    else{
      const buyListSort = buyList.sort(
        (a, b) => new Date(b.timePaid) - new Date(a.timePaid)
      );
  
      // 나의 주문 리스트 렌더링 함수
      await renderBuyList(contentEl, buyListSort);
    }

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

    // timePaidEl, titleEl, priceEl, 버튼을 담을 div(레이아웃 용도)
    const summaryEl = document.createElement("div");
    summaryEl.className = "buyItemLi__summary";

    // 주문 날짜
    const timePaidEl = document.createElement("div");
    timePaidEl.className = "buyItemLi__summary__timePaid";
    const localTime = new Date(item.timePaid);

    timePaidEl.textContent = `${localTime.toLocaleDateString("ko-Kr")} 결제`;

    // 주문 상품 이름
    const titleEl = document.createElement("div");
    titleEl.className = "buyItemLi__summary__title";
    titleEl.textContent = `${item.product.title}`;

    // 주문 상품 가격
    const priceEl = document.createElement("div");
    priceEl.className = "buyItemLi__summary__price";
    priceEl.textContent = `${item.product.price.toLocaleString()}원`;

    summaryEl.append(timePaidEl, titleEl, priceEl);

    const repurchaseBtnEl = document.createElement("button"); // 재구매 버튼

    // 조건에 따라 주문취소, 구매확정 버튼/재주문 버튼 추가
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

      // 재구매 버튼 이벤트 함수
      const { product } = item;
      const { id, price, thumbnail, title } = product;
      repurchaseBtn(repurchaseBtnEl, id, price, thumbnail, title);
    }

    buyItemLiEl.append(stateEl, thumbnailEl, summaryEl);

    // navigo를 이용한 라우팅 위해 id속성 부여 
    buyItemLiEl.setAttribute("id", `${item.detailId}`);
    buyItemLiEl.addEventListener("click", () => {
      router.navigate(`/mypage/order/detail/${buyItemLiEl.id}`);
    });

    // 재구매 버튼에 대해 이벤트 캡처링을 제거(buyItemLiEl의 자손)
    // 재구매 버튼의 경우 클릭시 장바구니로 이동
    repurchaseBtnEl.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    // 주문취소, 구매확정 버튼은 이후 경로가 mypage/order/detail 페이지로 
    // buyItemLiEl과 동일하기 때문에 그대로 두었다.

    return buyItemLiEl;
  });
  contentEl.append(...buyItemEl);
}
