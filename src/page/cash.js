import { router } from "../route";
import { afterLoadUserAuth, userToken } from "../utilities/userAuth";
import { getBankAccount, getCurrentAccount } from "../utilities/userapi";
import { buyProduct, getProductDetail } from "../utilities/productapi";
import "../style/cash.scss";
let cartIds = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];
export async function renderCash() {
  const app = document.querySelector("#app");
  app.innerHTML = ``;

  this.element = document.createElement("div");
  this.element.setAttribute("class", "cash-container");

  this.state = cartIds;

  const userAuth = await afterLoadUserAuth();
  const accessToken = userToken.token;
  const accountInfo = await getCurrentAccount(accessToken);
  const userbanks = accountInfo.accounts;

  this.render = async function () {
    const info = document.createElement("div");
    info.setAttribute("class", "info-container");
    const items = document.createElement("ul");
    items.setAttribute("class", "item-container");
    const userInfo = document.createElement("div");
    userInfo.setAttribute("class", "userInfo-container");
    const card = document.createElement("div");
    const totalPrice = document.createElement("div");
    totalPrice.setAttribute("class", "price-container");
    let sum = 0;

    let itemArr = await Promise.all(
      this.state.map(async (cartId) => {
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
  <h2>결제 수단</h2>

  `;
    const bankarr = document.createElement("ul");
    const currentbanks = userbanks.map((userbank) => {
      console.log(userbank);
      const bank = document.createElement("li");
      bank.setAttribute("class", "bank-container");
      bank.innerHTML = /*HTML*/ `
    <div>${userbank.bankName}</div>
    <div>${userbank.accountNumber}</div>
    <div>${userbank.balance}</div>
  
  `;
      return bank;
    });
    bankarr.append(...currentbanks);
    card.append(bankarr);

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
        <button class="pay-button">주문하기</button>
      </div>
      
    `;

    const paybutton = totalPrice.querySelector(".pay-button");

    paybutton.addEventListener("click", async () => {
      for (let cartId of cartIds) {
        const data = {
          userToken: accessToken,
          info: {
            productId: cartId,
            accountId: userbanks[0].id,
          },
        };

        const res = await buyProduct(data);
        if (!res) {
          alert("결제에 실패했습니다.");
          return;
        }
      }
      alert("결제에 성공했습니다.");
    });

    this.element.append(info, totalPrice);
    app.append(this.element);
  };
  this.render();
  this.setState = function (nextState) {
    this.state = nextState;
    this.render();
  };
}
