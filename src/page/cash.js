import { router } from "../route";
import "../style/cash.scss";
import Swiper, { Pagination } from "swiper";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "swiper/modules/pagination/pagination-element.min.css";

import { afterLoadUserAuth, userToken } from "../utilities/userAuth";
import { getCurrentAccount } from "../utilities/userapi";
import { buyProduct, getProductDetail } from "../utilities/productapi";

import { getItems, setItems } from "../utilities/local";

export async function renderCash() {
  const app = document.querySelector("#app");
  app.innerHTML = ``;

  const element = document.createElement("div");
  element.setAttribute("class", "cash-container");

  let state = getItems("cart");

  const userAuth = await afterLoadUserAuth();
  const accessToken = userToken.token;
  const accountInfo = await getCurrentAccount(accessToken);
  const userbanks = accountInfo.accounts;
  let selectedbankIdx = 0;
  const render = async function () {
    const info = document.createElement("div");
    info.setAttribute("class", "info-container");
    const items = document.createElement("ul");
    items.setAttribute("class", "item-container");
    const userInfo = document.createElement("div");
    userInfo.setAttribute("class", "userInfo-container");
    const card = document.createElement("div");
    card.setAttribute("class", "card-container");
    const totalPrice = document.createElement("div");
    totalPrice.setAttribute("class", "price-container");
    let sum = 0;

    let itemArr = await Promise.all(
      state.map(async (cartId) => {
        let cart = await getProductDetail(cartId);
        sum += cart.price;
        let item = document.createElement("li");
        item.setAttribute("class", "item");
        item.setAttribute("id", `${cart.id}`);
        item.innerHTML = /*HTML*/ `
              <img src=${cart.thumbnail}>
              <div class="name">${cart.title}</div>
              <div class="count">${"1"}개</div>
              <div class="price">${cart.price}원</div>
            `;
        return item;
      })
    );
    items.innerHTML = "";
    items.append(...itemArr);

    userInfo.innerHTML = /*HTML*/ `
      <h2>주문자 정보</h2>
      <div>주문자: ${userAuth.displayName}님</div>
      <div>이메일: ${userAuth.email}</div>
    `;

    card.innerHTML = /*HTML*/ `
      <h2>결제 수단 선택</h2>
      <div class="swiper">
        <div class="swiper-wrapper"></div>
        <div class="swiper-pagination"></div>    
      </div>
    `;
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
    const bankarr = card.querySelector(".swiper-wrapper");
    bankarr.append(...currentbanks);

    info.append(items, userInfo, card);

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
      for (let cartId of state) {
        const data = {
          userToken: accessToken,
          info: {
            productId: cartId,
            accountId: userbanks[selectedbankIdx].id,
          },
        };

        const res = await buyProduct(data);
        if (!res || userbanks[selectedbankIdx].balance < sum) {
          alert("결제에 실패했습니다.");
          return;
        }
      }
      setState([]);
      alert("결제에 성공했습니다.");
      console.log(app);
      console.log(element);
      router.navigate("/mypage/orderHistory");
    });
    element.innerHTML = "";
    element.append(info, totalPrice);
    app.append(element);
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
  };

  render();
  const setState = function (nextState) {
    state = nextState;
    setItems("cart", state);
    const cartCount = document.querySelector(".cart-count");
    cartCount.textContent = state.length;
    //render();
  };
}
