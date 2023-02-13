import { getProductDetail } from "../../utilities/productapi";
import { router } from "../../route";
export function cartOrder(target, initialState) {
  this.element = document.createElement("div");
  this.element.setAttribute("class", "price-container");
  this.state = initialState;

  this.render = async function () {
    let sum = await this.state.reduce(async (val, cartId) => {
      let start = await val;
      let cart = await getProductDetail(cartId);
      return start + cart.price;
    }, 0);

    this.element.innerHTML = /*HTML*/ `
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
        <div>${sum}원</div>
      </div>
      <div class="price">
        <div>총 결제 금액:</div>
        <div>${sum}원</div>
      </div>
      <div class="order-button">
        <button class="cart-button">주문하기</button>
      </div>
      
    `;
    target.append(this.element);
    const cartButton = this.element.querySelector(".cart-button");
    cartButton.addEventListener("click", () => {
      router.navigate("/product/checkout");
    });
  };
  this.render();

  this.setState = function (nextState) {
    this.state = nextState;
    this.render();
  };
}
