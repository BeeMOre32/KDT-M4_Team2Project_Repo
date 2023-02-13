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
    const items = document.createElement("ul");
    items.setAttribute("class", "item-container");
    const userInfo = document.createElement("div");
    userInfo.setAttribute("class", "userInfo-container");
    const card = document.createElement("div");
    const totalPrice = document.createElement("div");
    const paybutton = document.createElement("button");
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

    totalPrice.innerHTML = /*HTML*/ `
      <h2>총 결제금액:${sum}원</h2>
    `;

    paybutton.innerText = `총 ${sum}원 결제하기`;
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

    this.element.append(items, userInfo, card, totalPrice, paybutton);
    app.append(this.element);
  };
  this.render();
}
