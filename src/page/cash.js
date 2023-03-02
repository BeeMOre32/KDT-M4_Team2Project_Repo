import "../style/cash.scss";
import { router } from "../route";

import Swiper, { Pagination } from "swiper";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "swiper/modules/pagination/pagination-element.min.css";

import { afterLoadUserAuth, userToken } from "../utilities/userAuth";
import { getCurrentAccount } from "../utilities/userapi";
import { buyProduct } from "../utilities/productapi";
import { getItems, setItems } from "../utilities/local";

export async function renderCash() {
  const userAuth = await afterLoadUserAuth();
  const accessToken = userToken.token;
  const accountInfo = await getCurrentAccount(accessToken);
  const userbanks = accountInfo.accounts;

  const app = document.querySelector("#app");
  let state = getItems("cash");

  let selectedbankIdx = 0;

  const render = async function () {
    app.classList.add("loading");
    app.innerHTML = /*HTML*/ `
    <div class="title">결제페이지</div>
    <div class="cash-container">
      <div class="info-container">
        <ul class="item-container">
          <div class="tag">주문상품</div>
        </ul>
        <div class="userInfo-container">
          <div class="tag">주문자 정보</div>
          <div class="orderer">
            <div>주문자:</div> 
            <div>${userAuth.displayName}님</div>
          </div>
          <div class="email">
            <div>이메일:</div>
            <div>${userAuth.email}</div> 
          </div>  
        </div>
        <div class="card-container">
          <div class="tag">결제 수단</div>
          <div class="select-card">
            <div class="name">선택된 계좌:</div> 
            <div style="color:#ddd;">계좌를 선택해주세요</div>
          </div>
          <div class="select-card">
            <div class="accountNumber">선택된 계좌번호:</div> 
            <div></div>
          </div>
          <div class="select-card">
            <div class="balance">선택된 계좌잔액:</div> 
            <div></div>
          </div>
          <div class="swiper">
            <div class="empty-bank" ><a href="/mypage/account" data-navigo>계좌를 연결해주세요.</a></div>
            <div class="swiper-wrapper"></div>
            <div class="swiper-pagination"></div>    
          </div>
        </div>
      </div>
      <div class="price-container"></div>
    </div>
    <div class="modal-bg cash-modal">
      <div class="modal">
        <h2></h2>
        <div class="btns">
          <button class="confirmed">확인</button>
        </div>
      </div>
    </div>
  `;
    let sum = 0;
    let itemArr = await Promise.all(
      state.map(async ({ id, price, thumbnail, title, num }) => {
        sum += price * num;
        let item = document.createElement("li");
        item.setAttribute("class", "item");
        item.setAttribute("id", `${id}`);
        item.innerHTML = /*HTML*/ `
              <img src=${thumbnail} alt=${thumbnail}>
              <div class="name">${title}</div>
              <div class="count">${num}개</div>
              <div class="price">${price.toLocaleString()}원</div>
            `;
        return item;
      })
    );
    const items = document.querySelector(".item-container");
    items.append(...itemArr);

    const currentbanks = userbanks.map((userbank, idx) => {
      const bank = document.createElement("img");
      bank.setAttribute("class", "swiper-slide");
      bank.setAttribute("id", `${idx}`);

      switch (userbank.bankName) {
        case "KB국민은행":
          bank.src = "https://zeepdive.netlify.app/kb.bba4347c.png";
          break;
        case "신한은행":
          bank.src = "https://zeepdive.netlify.app/shinhan.6c24635c.png";
          break;
        case "우리은행":
          bank.src = "https://zeepdive.netlify.app/woori.9d49275f.png";
          break;
        case "하나은행":
          bank.src = "https://zeepdive.netlify.app/hana.0d4cb28f.png";
          break;
        case "케이뱅크":
          bank.src = "https://zeepdive.netlify.app/kbank.0b4f9ee2.png";
          break;
        case "카카오뱅크":
          bank.src = "https://zeepdive.netlify.app/kakao.7145cd6e.png";
          break;
        case "NH농협은행":
          bank.src = "https://zeepdive.netlify.app/nong.5c7e8a7e.png";
          break;
      }

      bank.addEventListener("click", (e) => {
        selectedbankIdx = e.target.closest(".swiper-slide").getAttribute("id");
        const cardName = document.querySelector(".select-card .name");
        cardName.nextElementSibling.style.color = "black";
        cardName.nextElementSibling.textContent = `${userbanks[selectedbankIdx].bankName}`;
        const cardAccountNumber = document.querySelector(
          ".select-card .accountNumber"
        );
        cardAccountNumber.nextElementSibling.textContent = `${userbanks[selectedbankIdx].accountNumber}`;
        const cardBalance = document.querySelector(".select-card .balance");
        cardBalance.nextElementSibling.textContent = `${userbanks[
          selectedbankIdx
        ].balance.toLocaleString()}원`;
      });
      return bank;
    });
    const card = document.querySelector(".card-container");
    const bankarr = card.querySelector(".swiper-wrapper");
    const empty = card.querySelector(".empty-bank");
    if (!currentbanks.length) empty.style.display = "flex";
    bankarr.append(...currentbanks);
    const totalPrice = document.querySelector(".price-container");
    totalPrice.innerHTML = /*HTML*/ `
      <div class="price">
        <div>총 주문 금액:</div>
        <div>${sum.toLocaleString()}원</div>
      </div>
      <div class="discount">
        <div>할인 금액:</div>
        <div>0원</div>
      </div>
      <div class="moveprice">
        <div>배송비:</div>
        <div>0원</div>
      </div>
      <div class="price">
        <div>총 결제 금액:</div>
        <div>${sum.toLocaleString()}원</div>
      </div>
      <div class="cash-button">
        <button class="pay-button">결제하기</button>
      </div>
      
    `;

    const paybutton = totalPrice.querySelector(".pay-button");

    paybutton.addEventListener("click", async () => {
      const modal = document.querySelector(".modal-bg");
      const h2 = modal.querySelector("h2");
      const confirmedBtn = modal.querySelector(".confirmed");
      h2.innerText = "";
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
      confirmedBtn.addEventListener("click", (e) => {
        modal.classList.remove("show");
        document.body.style.overflow = "unset";

        if (
          e.target.parentElement.previousElementSibling.textContent ===
          "결제에 성공했습니다. 결제내역으로 이동합니다."
        ) {
          router.navigate("/mypage/order");
        }
      });
      for (let item of state) {
        const data = {
          userToken: accessToken,
          info: {
            productId: item.id,
            accountId: userbanks[selectedbankIdx].id,
          },
        };

        const res = await buyProduct(data);

        if (!res || userbanks[selectedbankIdx].balance < sum) {
          h2.textContent = "잔액이 부족합니다. 계좌를 다시 선택해주세요";
          return;
        }
      }
      setState([]);
      h2.textContent = "결제에 성공했습니다. 결제내역으로 이동합니다.";
    });

    const swiper = card.querySelector(".swiper");
    new Swiper(swiper, {
      modules: [Pagination],
      slidesPerView: "auto",
      spaceBetween: 30,
      centeredSlides: true,

      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
      },
    });
    app.classList.remove("loading");
  };

  render();
  const setState = function (nextState) {
    state = nextState;
    setItems("cash", state);
  };
}
