import "../style/cart.scss";
import { getProductDetail } from "../utilities/productapi";
import { router } from "../route";

let cartIds = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

export function renderCart() {
  const app = document.querySelector("#app");
  app.innerHTML = ``;
  this.element = document.createElement("div");
  this.element.setAttribute("class", "cart-container");
  this.state = cartIds;

  this.render = async function () {
    const items = document.createElement("ul");
    items.setAttribute("class", "item-container");
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
              <button class="delete">취소</button>
            `;
        const deleteButton = item.querySelector(".delete");
        deleteButton.addEventListener("click", (e) => {
          const id = e.target.closest("li").getAttribute("id");
          const idx = this.state.findIndex((cartId) => cartId === id);
          this.state.splice(idx, 1);
          this.setState(this.state);
          localStorage.setItem("cart", JSON.stringify(this.state));
        });

        return item;
      })
    );
    items.innerHTML = "";
    items.append(...itemArr);

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
      <div class="order-button">
        <button class="cart-button">주문하기</button>
      </div>
      
    `;
    const cartButton = totalPrice.querySelector(".cart-button");
    cartButton.addEventListener("click", () => {
      router.navigate("/product/checkout");
    });

    this.element.innerHTML = "";
    this.element.append(items, totalPrice);
    app.append(this.element);
  };
  this.render();

  this.setState = function (nextState) {
    this.state = nextState;
    const cartCount = document.querySelector(".cart-count");
    cartCount.textContent = this.state.length;
    this.render();
  };
}
