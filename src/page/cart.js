import "../style/cart.scss";
import { router } from "../route";

import { getItems, setItems } from "../utilities/local";

export function renderCart() {
  const app = document.querySelector("#app");
  let state = getItems("cart");

  const render = async function () {
    app.classList.add("loading");
    app.innerHTML = /*HTML*/ `
      <div class="title">장바구니</div>
      <div class="cart-container">
        <ul class="item-container">
          <div class="cart-empty">장바구니가 비어 있습니다.</div>
        </ul>
        <div class="price-container"></div>
      </div>
    `;

    let sum = 0;
    let itemArr = state.map(({ id, price, thumbnail, title, num }, idx) => {
      sum += price * num;
      let item = document.createElement("li");
      item.setAttribute("class", "item");
      item.setAttribute("id", `${id}`);
      item.innerHTML = /*HTML*/ `
              <img src=${thumbnail} alt=${thumbnail}>
              <div class="name">${title}</div>
              <div class="count">
                <button class="minus">-<button>
                <div>${num}</div>
                <button class="plus">+</button>
              </div>
              <div class="price">${price.toLocaleString()}원</div>
              <button class="delete">취소</button>
            `;
      item.addEventListener("click", (e) => {
        if (e.target.classList.contains("minus")) {
          if (state[idx].num <= 1) return;
          state[idx].num--;
          console.log(state);
        } else if (e.target.classList.contains("plus")) {
          state[idx].num++;
        } else if (e.target.classList.contains("delete")) {
          state.splice(idx, 1);
        }
        setState(state);
      });

      return item;
    });

    const items = document.querySelector(".item-container");
    const empty = items.querySelector(".cart-empty");
    if (!itemArr.length) empty.style.display = "block";
    items.append(...itemArr);
    const totalPrice = document.querySelector(".price-container");
    totalPrice.innerHTML = /*HTML*/ `
      <div class="order-price">
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
      <div class="total-price">
        <div>총 결제 금액:</div>
        <div>${sum.toLocaleString()}원</div>
      </div>
      <div class="order">
        <button class="cart-button">주문하기</button>
      </div>
      
    `;
    const cartButton = totalPrice.querySelector(".cart-button");
    cartButton.addEventListener("click", () => {
      if (!state.length) {
        cartButton.disabled = true;
      } else {
        let cashState = getItems("cash");
        state.forEach((item) => {
          cashState.push(item);
        });
        setItems("cash", cashState);
        setState([]);
        router.navigate("/product/checkout");
      }
    });
    app.classList.remove("loading");
  };

  render();

  const setState = function (nextState) {
    state = nextState;
    setItems("cart", state);
    const cartCount = document.querySelector(".cart-count");
    cartCount.textContent = state.length;
    render();
  };
}
