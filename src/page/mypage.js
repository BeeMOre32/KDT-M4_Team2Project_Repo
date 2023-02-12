import "../style/mypage.scss";
import { router } from "../route";
import { userToken, afterLoadUserAuth } from "../utilities/userAuth";
import { userAuth } from "../utilities/userapi";

export async function renderOrderHisory() {
  const app = document.querySelector("#app");
  app.innerHTML = "";

  const sectionEl = document.createElement('section');
  sectionEl.className = "myPage";
  const articleEl = document.createElement('article');
  renderSideMenu(sectionEl, articleEl);
  
  
  app.append(sectionEl);
}

function renderSideMenu(sectionEl, articleEl) {
  // 화면 왼쪽 사이드 메뉴 생성(프로필, 주문•배송, 잔액, 구매, 계좌, 정보)
  const leftSideMenuEl = document.createElement('nav');
  leftSideMenuEl.className = "leftSideMenu";
  
  // 프로필 표시
  const profileEl = document.createElement('div')
  profileEl.className = "profile";
  
  // 프로필 표시할 항목(이미지, 표시이름, 이메일)
  const profileUlEl = document.createElement('ul');
  profileUlEl.className = "profile__list"
  profileEl.append(profileUlEl);

  // 이미지
  const imgLiEl = document.createElement('li');
  imgLiEl.className = "profile__list--img";

  // 표시이름
  const displayNameLiEl = document.createElement('li');
  displayNameLiEl.className = "profile__list--displayName";
  displayNameLiEl.innerText = "Miriam de Jesus";

  // 이메일
  const emailLiEl = document.createElement('li');
  emailLiEl.className = "profile__list--email";
  emailLiEl.innerText = "h.mariano@gmail.com";

  profileUlEl.append(imgLiEl, displayNameLiEl, emailLiEl);

  // 메뉴의 버튼들 생성
  const myPageBtnsEl = document.createElement('div');
  myPageBtnsEl.className = "myPageBtns";

  // 주문•배송, 나의 잔액 표시할 div 생성
  const myPageSummaryEl = document.createElement('div');
  myPageSummaryEl.className = "myPageSummary";

  // 주문•배송
  const orderDeliveryEl = document.createElement('div');
  orderDeliveryEl.className = "myPageSummary__btns";

  const orderDeliveryNameEl = document.createElement('div');
  orderDeliveryNameEl.className = "myPageSummary__btns__name";
  orderDeliveryNameEl.innerHTML = 
  '<span class="material-symbols-outlined">local_shipping</span> 주문•배송';

  const orderDeliveryValueEl = document.createElement('div');
  orderDeliveryValueEl.className = "myPageSummary__btns__value";
  orderDeliveryValueEl.innerText = "7 건";

  orderDeliveryEl.append(orderDeliveryNameEl, orderDeliveryValueEl);

  // 나의 잔액
  const balanceEl = document.createElement('div');
  balanceEl.className = "myPageSummary__btns";

  const balanceNameEl = document.createElement('div');
  balanceNameEl.className = "myPageSummary__btns__name";
  balanceNameEl.innerHTML = 
  '<span class="material-symbols-outlined">local_atm</span> 나의 잔액';

  const balanceValueEl = document.createElement('div');
  balanceValueEl.className = "myPageSummary__btns__value";
  balanceValueEl.innerText = "2,351 원";

  balanceEl.append(balanceNameEl, balanceValueEl);

  myPageSummaryEl.append(orderDeliveryEl, balanceEl);

  // 나의 구매
  const myOrderBtnEl = document.createElement('a');
  myOrderBtnEl.innerHTML = 
  '<span class="material-symbols-outlined">shop_two</span> 나의 구매';

  // 나의 계좌
  const myAccountBtnEl = document.createElement('a');
  myAccountBtnEl.innerHTML = 
  '<span class="material-symbols-outlined">payments</span> 나의 계좌';

  // 나의 정보
  const myInfoBtnEl = document.createElement('a');
  myInfoBtnEl.innerHTML = 
  '<span class="material-symbols-outlined">person</span> 나의 정보';

  myPageBtnsEl.append(myPageSummaryEl, myOrderBtnEl, myAccountBtnEl, myInfoBtnEl);

  leftSideMenuEl.append(profileEl, myPageBtnsEl);

  sectionEl.append(leftSideMenuEl, articleEl);
}