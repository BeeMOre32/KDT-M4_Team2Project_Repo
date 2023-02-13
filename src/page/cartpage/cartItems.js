import { getProductDetail } from "../../utilities/productapi";
export function cartItems(target, initialState, onRemove) {
  this.element = document.createElement("ul");
  this.element.setAttribute("class", "item-container");
  this.state = initialState;
  this.render = async function () {
    let itemArr = await Promise.all(
      this.state.map(async (cartId) => {
        let cart = await getProductDetail(cartId);

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
          onRemove(idx);
          localStorage.setItem("cart", JSON.stringify(this.state));
        });

        return item;
      })
    );
    this.element.innerHTML = "";
    this.element.append(...itemArr);
    target.append(this.element);
  };
  this.render();
  this.setState = function (nextState) {
    this.state = nextState;
    this.render();
  };
}
