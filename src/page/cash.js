import "../style/cash.scss";
import { router } from "../route";

import Swiper, { Pagination } from "swiper";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "swiper/modules/pagination/pagination-element.min.css";

import { afterLoadUserAuth, userToken } from "../utilities/userAuth";
import { getCurrentAccount } from "../utilities/userapi";
import { buyProduct, getProductDetail } from "../utilities/productapi";
import { getItems, setItems } from "../utilities/local";

export async function renderCash() {
  const userAuth = await afterLoadUserAuth();
  const accessToken = userToken.token;
  const accountInfo = await getCurrentAccount(accessToken);
  const userbanks = accountInfo.accounts;

  const app = document.querySelector("#app");
  let state = getItems("cart");

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
          <div class="tag">결제 수단 선택</div>
          <div class="swiper">
            <div class="swiper-wrapper"></div>
            <div class="swiper-pagination"></div>    
          </div>
        </div>
      </div>
      <div class="price-container"></div>
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
              <div class="price">${price}원</div>
            `;
        return item;
      })
    );
    const items = document.querySelector(".item-container");
    items.append(...itemArr);

    const currentbanks = userbanks.map((userbank, idx) => {
      const bank = document.createElement("div");
      bank.setAttribute("class", "swiper-slide");
      bank.setAttribute("id", `${idx}`);

      bank.innerHTML = /*HTML*/ `
        <div>${userbank.bankName}</div>
        <div>${userbank.accountNumber}</div>
        <div>${userbank.balance}원</div>
      `;
      bank.addEventListener("click", (e) => {
        selectedbankIdx = e.target.closest(".swiper-slide").getAttribute("id");
        console.log(userbanks[selectedbankIdx]);
        alert(`${userbanks[selectedbankIdx].bankName}이 선택되었습니다.`);
      });
      return bank;
    });
    const card = document.querySelector(".card-container");
    const bankarr = card.querySelector(".swiper-wrapper");
    bankarr.append(...currentbanks);
    const totalPrice = document.querySelector(".price-container");
    totalPrice.innerHTML = /*HTML*/ `
      <div class="price">
        <div>총 주문 금액:</div>
        <div>${sum}원</div>
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
        <div>${sum}원</div>
      </div>
      <div class="cash-button">
        <button class="pay-button">결제하기</button>
      </div>
      
    `;

    const paybutton = totalPrice.querySelector(".pay-button");

    paybutton.addEventListener("click", async () => {
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
          alert("잔액이 부족합니다.");
          return;
        }
      }
      setState([]);
      alert("결제에 성공했습니다.");
      console.log(app);
      router.navigate("/mypage/order");
    });

    const swiper = card.querySelector(".swiper");
    new Swiper(swiper, {
      modules: [Pagination],
      slidesPerView: "auto",
      spaceBetween: 15,
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
    setItems("cart", state);
    const cartCount = document.querySelector(".cart-count");
    cartCount.textContent = state.length;
  };
}
