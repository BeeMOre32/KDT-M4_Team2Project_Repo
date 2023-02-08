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
  const navEl = document.createElement('nav');
  
  const profileEl = document.createElement('div')
  profileEl.className = "profile";

  const profileUlEl = document.createElement('ul');
  profileUlEl.className = "profile__list"
  profileEl.append(profileUlEl);

  const imgLiEl = document.createElement('li');
  imgLiEl.className = "profile__list--img";
  const displayNameLiEl = document.createElement('li');
  displayNameLiEl.className = "profile__list--displayName";
  displayNameLiEl.innerText = "Miriam de Jesus";
  const emailLiEl = document.createElement('li');
  emailLiEl.className = "profile__list--email";
  emailLiEl.innerText = "h.mariano@gmail.com";
  profileUlEl.append(imgLiEl, displayNameLiEl, emailLiEl);

  const myPageBtnsEl = document.createElement('div');
  myPageBtnsEl.className = "myPageBtns"

  const myOrderBtnEl = document.createElement('a');
  myOrderBtnEl.innerHTML = 
  '<span class="material-symbols-outlined">shop_two</span> 나의 구매';

  const myAccountBtnEl = document.createElement('a');
  myAccountBtnEl.innerHTML = 
  '<span class="material-symbols-outlined">payments</span> 나의 계좌';

  const myInfoBtnEl = document.createElement('a');
  myInfoBtnEl.innerHTML = 
  '<span class="material-symbols-outlined">person</span> 나의 정보';

  myPageBtnsEl.append(myOrderBtnEl, myAccountBtnEl, myInfoBtnEl);

  navEl.append(profileEl, myPageBtnsEl);

  sectionEl.append(navEl, articleEl);
}