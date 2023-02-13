import "../style/productDetail.scss";

import { afterLoadUserAuth } from "../utilities/userAuth";
import { getMasterProductList } from "../utilities/masterapi";
import { getProductDetail } from "../utilities/productapi";
import { router } from "../route";

import Swiper, { Navigation } from "swiper";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "swiper/modules/navigation/navigation-element.min.css";

export async function renderDetailPage(params) {
  const app = document.getElementById("app");
  const product = await getProductDetail(params.data.productId);

  window.scrollTo({ top: 0, behavior: "smooth" });

  app.innerHTML = /* html */ `
    <div class="container">
      <div class="main">
        <img class="thumbnail" src="${product.thumbnail}" alt="thumbnail">

        <p class="description">
          ${product.description}
        </p>

        <img class="detail" src="${product.photo}" alt="detail photo">
      </div>
      <div class="side">
        <div class="card">
          <h3>${product.title}</h3>
          <p class="price">￦ ${product.price.toLocaleString()}</p>

          <span class="line"></span>

          <div class="category-card">
            <span class="material-symbols-outlined icon">
                dresser 
            </span>
            <div>
              <span class="category-title">Category</span>
              <span class="category">${product.tags[0]}</span>
            </div>
          </div>

          <div class="tag">
            <span class="tag-title">Tags</span>
            <div class="tags">
              <!-- tag추가 -->
            </div>
          </div>

          <div class="buy-product">
            <button class="darken-btn buy-now">바로구매</button>
            <button class="common-btn cart">장바구니</button>
            <button class="red-btn soldout-btn">품절되었습니다</button>
          </div>
        </div>
      </div>
    </div>

    <div class="recommend">
      <h2>같은 카테고리 제품 둘러보기</h2>

      <div class="no-item" style="text-align: center;"></div>
      <div class="swiper ">
          <div class="swiper-wrapper">
            <!-- 제품추가 -->
          </div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
        <span class="loading">loading</span>
      </div>
    </div>

    <div class="modal-bg">
      <div class="modal">
        <div class="icon">
          <span class="material-symbols-outlined cart-icon">
            shopping_cart
          </span>
          <span class="material-symbols-outlined already-in-icon">
            production_quantity_limits
          </span>
        </div>
        <h2>상품이 장바구니에 추가되었습니다</h2>
        <div class="btns">
          <button class="common-btn keep">쇼핑 계속하기</button>
          <button class="darken-btn go-cart">장바구니로 이동</button>
        </div>
      </div>
    </div>
  `;

  const tagsEl = document.querySelector(".card .tag .tags");
  const buyBtns = document.querySelector(".card .buy-product");
  const noItemEl = document.querySelector(".recommend .no-item");
  const swiperEl = document.querySelector(".recommend .swiper");
  const swiperWrapper = document.querySelector(".recommend .swiper-wrapper");
  const buyNowBtnEl = buyBtns.querySelector(".buy-now");
  const mainCartBtnEl = buyBtns.querySelector(".cart");
  const modalBgEl = document.querySelector(".modal-bg");
  const modalKeepBtnEl = modalBgEl.querySelector(".keep");
  const modalCartBtnEl = modalBgEl.querySelector(".go-cart");

  const userAuth = await afterLoadUserAuth();

  (function () {
    product.isSoldOut
      ? buyBtns.classList.add("soldout")
      : buyBtns.classList.remove("soldout");
  })();

  (async function () {
    const res = await getMasterProductList();
    renderRecommendItems(res);
  })();

  buyNowBtnEl.addEventListener("click", () => {
    if (typeof userAuth === "string") {
      return router.navigate("/login");
    } else {
      //결제페이지로 바로이동
    }
  });

  mainCartBtnEl.addEventListener("click", () => {
    if (typeof userAuth === "string") {
      return router.navigate("/login");
    }
    ProductCartIn(params.data.productId);
  });

  modalCartBtnEl.addEventListener("click", () => {
    router.navigate("/product/cart");
  });

  modalKeepBtnEl.addEventListener("click", () => {
    modalBgEl.classList.remove("show");
    document.body.style.overflow = "unset";
  });

  modalBgEl.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      modalKeepBtnEl.click();
    }
  });

  (function renderTags() {
    product.tags.forEach((tag, idx) => {
      if (idx === 0) return;
      const spanEl = document.createElement("span");

      spanEl.textContent = tag;
      tagsEl.append(spanEl);
    });
  })();

  function renderRecommendItems(items) {
    const loadingEl = document.querySelector(".recommend .loading");
    items = items.filter(
      (item) => item.tags[0] === product.tags[0] && item.id !== product.id
    );

    if (items.length === 0) {
      noItemEl.textContent = "일치하는 제품이 없습니다";
      loadingEl.remove();
      return;
    }

    noItemEl.remove();

    items.forEach((item) => {
      const divEl = document.createElement("div");
      const thumbnailEl = document.createElement("div");
      const descEl = document.createElement("div");
      const tagsEl = document.createElement("div");
      const itemNameEl = document.createElement("h3");
      const priceEl = document.createElement("span");

      itemNameEl.textContent = item.title;
      priceEl.textContent = item.isSoldOut
        ? "￦ 품절되었습니다"
        : `￦ ${item.price.toLocaleString()}`;

      thumbnailEl.style.backgroundImage = `url(${item.thumbnail})`;

      divEl.classList.add("swiper-slide");
      thumbnailEl.classList.add("thumbnail");
      descEl.classList.add("desc");
      tagsEl.classList.add("tags");
      priceEl.classList.add("price");

      item.tags.map((tag, idx) => {
        if (idx === 0) return;

        const tagEl = document.createElement("span");

        tagEl.textContent = tag;
        tagEl.classList.add(tag);

        tagsEl.append(tagEl);
      });

      swiperWrapper.append(divEl);
      divEl.append(thumbnailEl, descEl);
      descEl.append(tagsEl, itemNameEl, priceEl);

      divEl.addEventListener("click", () => {
        router.navigate(`/product/detail/${item.id}`);
      });
    });

    loadingEl.remove();
  }

  function ProductCartIn(id) {
    const savedCart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];

    if (savedCart.includes(id)) {
      showModal(true);
      return;
    }

    savedCart.push(id);
    localStorage.setItem("cart", JSON.stringify(savedCart));

    const cartCountEl = document.querySelector(".cart-count");
    cartCountEl.textContent = savedCart.length;

    showModal();
  }

  function showModal(isAlreadyIn) {
    const h2El = modalBgEl.querySelector("h2");
    const iconEl = modalBgEl.querySelector(".icon");

    modalBgEl.classList.add("show");
    isAlreadyIn ? iconEl.classList.add("already-in") : "";

    document.body.style.overflow = "hidden";
    h2El.textContent = isAlreadyIn
      ? "해당상품이 장바구니에 이미 담겨있습니다"
      : "해당상품이 장바구니에 추가되었습니다";
  }

  new Swiper(swiperEl, {
    modules: [Navigation],
    slidesPerView: 4,
    spaceBetween: 35,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  console.log(product);
}
