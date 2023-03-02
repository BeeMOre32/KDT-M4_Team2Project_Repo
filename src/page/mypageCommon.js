import "../style/mypageCommon.scss";
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

import { getItems, setItems } from "../utilities/local";

// 주문취소, 구매확정 버튼 이벤트 함수
export async function cancelDoneBtns(isCanceledBtnEl, doneBtnEl, detailId) {
  isCanceledBtnEl.addEventListener("click", async () => {
    await cancelBuy(userToken._token, detailId);
    location.reload();
  });
  doneBtnEl.addEventListener("click", async () => {
    await confirmBuy(userToken._token, detailId);
    location.reload();
  });
}

// === 재구매 버튼 이벤트 함수 ===
export async function repurchaseBtn(
  repurchaseBtnEl,
  id,
  price,
  thumbnail,
  title
) {
  repurchaseBtnEl.addEventListener("click", () => {
    const savedCart = getItems("cart");
    savedCart.push({ id, price, thumbnail, title, num: 1 });
    setItems("cart", savedCart);
    const cartCountEl = document.querySelector(".cart-count");
    cartCountEl.textContent = savedCart.length;
    router.navigate("/product/cart");
  });
}

// 마이페이지 사이드 메뉴 렌더링 함수
export async function renderSideMenu(sectionEl, articleEl) {
  const profile = await userAuth(userToken._token);
  const buyList = await getBuyList(userToken._token);
  const accountList = await getCurrentAccount(userToken._token);

  // 화면 왼쪽 사이드 메뉴 생성(프로필, 주문•배송, 잔액, 주문, 계좌, 정보)
  const leftSideMenuEl = document.createElement("nav");
  leftSideMenuEl.className = "leftSideMenu";

  // 프로필 표시
  const profileEl = document.createElement("div");
  profileEl.className = "profile";

  // 프로필 표시할 항목(이미지, 표시이름, 이메일)
  const profileUlEl = document.createElement("ul");
  profileUlEl.className = "profile__list";
  profileEl.append(profileUlEl);

  // 이미지
  const imgLiEl = document.createElement("li");
  imgLiEl.className = "profile__list--img";

  // profileImg가 존재 할 경우 해당 이미지를 현재 태그 배경으로 설정
  if (profile.profileImg) {
    imgLiEl.style.backgroundImage = `url(${profile.profileImg})`;
    imgLiEl.style.backgroundSize = "cover";
  }

  // 표시이름
  const displayNameLiEl = document.createElement("li");
  displayNameLiEl.className = "profile__list--displayName";
  displayNameLiEl.innerText = profile.displayName;

  // 이메일
  const emailLiEl = document.createElement("li");
  emailLiEl.className = "profile__list--email";
  emailLiEl.innerText = profile.email;

  profileUlEl.append(imgLiEl, displayNameLiEl, emailLiEl);

  // 메뉴의 버튼들 생성
  const myPageBtnsEl = document.createElement("div");
  myPageBtnsEl.className = "myPageBtns";

  // 주문•배송, 나의 잔액 표시할 div 생성
  const myPageSummaryEl = document.createElement("div");
  myPageSummaryEl.className = "myPageSummary";

  // 주문•배송
  const orderDeliveryEl = document.createElement("div");
  orderDeliveryEl.className = "myPageSummary__btns";

  // 주문•배송 이름 부분 div 생성
  const orderDeliveryNameEl = document.createElement("div");
  orderDeliveryNameEl.className = "myPageSummary__btns__name";
  orderDeliveryNameEl.innerHTML =
    '<span class="material-symbols-outlined">local_shipping</span> 주문•배송';

  // 주문•배송 현황 값 가져오기
  const orderDeliveryValue = buyList.filter(
    (e) => e.done === false && e.isCanceled === false // 아직 구매취소x, 구매확정x
  ).length;

  // 주문•배송 현황 값 표시
  const orderDeliveryValueEl = document.createElement("a");
  orderDeliveryValueEl.className = "myPageSummary__btns__value";
  orderDeliveryValueEl.innerText = `${orderDeliveryValue} 건`;
  orderDeliveryValueEl.addEventListener("click", () => {
    router.navigate("/mypage/order");
  });

  orderDeliveryEl.append(orderDeliveryNameEl, orderDeliveryValueEl);

  // 나의 잔액
  const balanceEl = document.createElement("div");
  balanceEl.className = "myPageSummary__btns";

  // 나의 잔액 이름 부분 div 생성
  const balanceNameEl = document.createElement("div");
  balanceNameEl.className = "myPageSummary__btns__name";
  balanceNameEl.innerHTML =
    '<span class="material-symbols-outlined">local_atm</span> 나의 잔액';

  // 나의 잔액 값 가져오기
  const balanceValue = accountList.totalBalance.toLocaleString();

  // 나의 잔액 값 표시
  const balanceValueEl = document.createElement("a");
  balanceValueEl.className = "myPageSummary__btns__value";
  balanceValueEl.innerText = `${balanceValue} 원`;
  balanceValueEl.addEventListener("click", () => {
    router.navigate("/mypage/account");
  });

  balanceEl.append(balanceNameEl, balanceValueEl);

  myPageSummaryEl.append(orderDeliveryEl, balanceEl);

  // 나의 주문
  const myOrderBtnEl = document.createElement("a");
  myOrderBtnEl.className = "myPageBtns__link";
  myOrderBtnEl.innerHTML =
    '<span class="material-symbols-outlined">shop_two</span> 나의 주문';
  myOrderBtnEl.addEventListener("click", () => {
    router.navigate("/mypage/order");
  });

  // 나의 계좌
  const myAccountBtnEl = document.createElement("a");
  myAccountBtnEl.className = "myPageBtns__link";
  myAccountBtnEl.innerHTML =
    '<span class="material-symbols-outlined">payments</span> 나의 계좌';
  myAccountBtnEl.addEventListener("click", () => {
    router.navigate("/mypage/account");
  });

  // 나의 정보
  const myInfoBtnEl = document.createElement("a");
  myInfoBtnEl.className = "myPageBtns__link";
  myInfoBtnEl.innerHTML =
    '<span class="material-symbols-outlined">person</span> 나의 정보';
  myInfoBtnEl.addEventListener("click", () => {
    router.navigate("/mypage");
  });

  myPageBtnsEl.append(
    myPageSummaryEl,
    myOrderBtnEl,
    myAccountBtnEl,
    myInfoBtnEl
  );

  leftSideMenuEl.append(profileEl, myPageBtnsEl);

  sectionEl.append(leftSideMenuEl, articleEl);
}

export function handlingLoading(account = false) {
  const loadingEl = document.createElement("div");

  loadingEl.classList.add("skeleton");
  if (account) {
    loadingEl.innerHTML = `
   <div class="nav__loading">
     <div class="nav__loading--img"></div>
     <div class="nav__loading--text"></div>
     <div class="nav__loading--text"></div>
     <div class="nav__loading--current">
      <div></div>
      <div></div>
     </div>
     <div class="nav__loading--content"></div>
     <div class="nav__loading--content"></div>
     <div class="nav__loading--content"></div>
   </div>
   <div class="main__loading account">
    <div class="main__loading--title"></div>
    <div class="main__loading--content"></div>
    <div class="main__loading--content"></div>
    <div class="main__loading--content"></div>
   </div>
   `;
  } else {
    loadingEl.innerHTML = `
   <div class="nav__loading">
     <div class="nav__loading--img"></div>
     <div class="nav__loading--text"></div>
     <div class="nav__loading--text"></div>
     <div class="nav__loading--current">
      <div></div>
      <div></div>
     </div>
     <div class="nav__loading--content"></div>
     <div class="nav__loading--content"></div>
     <div class="nav__loading--content"></div>
   </div>
   <div class="main__loading">
    <div class="main__loading--title"></div>
    <div class="main__loading--content">
      <div class="content--img"></div>
      <div class="content--text"></div>
      <div class="content--text"></div>
      <div class="content--btn"></div>
   </div>
    <div class="main__loading--content">
      <div class="content--img"></div>
      <div class="content--text"></div>
      <div class="content--text"></div>
      <div class="content--btn"></div>
   </div>
    <div class="main__loading--content">
      <div class="content--img"></div>
      <div class="content--text"></div>
      <div class="content--text"></div>
      <div class="content--btn"></div>
   </div>
   </div>
   `;
  }

  return loadingEl;
}
