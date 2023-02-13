import "../../style/cart.scss";
import { cartItems } from "./cartItems";
import { cartOrder } from "./cartOrder";

let cartIds = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

export function renderCart() {
  const app = document.querySelector("#app");
  app.innerHTML = ``;
  this.element = document.createElement("div");
  this.element.setAttribute("class", "cart-container");
  this.state = cartIds;
  let items = new cartItems(this.element, this.state, (idx) => {
    let nextState = [...this.state];
    nextState.splice(idx, 1);
    this.setState(nextState);
  });
  let order = new cartOrder(this.element, this.state);
  this.render = function () {
    app.append(this.element);
  };
  this.render();
  this.setState = function (nextState) {
    this.state = nextState;
    items.setState(this.state);
    order.setState(this.state);
    const cartCount = document.querySelector(".cart-count");
    cartCount.textContent = this.state.length;
    this.render();
  };
}
