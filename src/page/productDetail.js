import "../style/productDetail.scss"

import { getMasterProductList } from "../utilities/masterapi";
import { getProductDetail } from "../utilities/productapi";
import { router } from "../route"

import Swiper, {Navigation} from 'swiper';

export async function renderDetailPage(params) {
  const app = document.getElementById('app');
  const product = await getProductDetail(params.data.productId)

  app.innerHTML = /* html */`
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
              <span>best</span>
              <span>new</span>
            </div>
          </div>

          <div class="buy-product">
            <button class="darken-btn">바로구매</button>
            <button class="common-btn">장바구니</button>
          </div>
        </div>
      </div>
    </div>

    <div class="recommend">
      <h2>같은 카테고리 제품 둘러보기</h2>

      <div class="swiper ">
          <div class="swiper-wrapper">
            <!-- 제품추가 -->
          </div>
          <!-- <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div> -->
        </div>
        <span class="loading">loading</span>
      </div>
    <div>
  `;


  const swiperEl = document.querySelector('.recommend .swiper')
  const swiperWrapper = document.querySelector('.recommend .swiper-wrapper')

  ;(
    async function () {
      const res = await getMasterProductList();
      console.log(res);

      renderRecommendItems(res)
    }
  )();
  
  function renderRecommendItems(items) {
    items = items.filter((item) =>  item.tags[0] === product.tags[0] && item.id !== product.id);

    const loadingEl = document.querySelector('.recommend .loading')
  
    items.forEach((item) => {
      const divEl = document.createElement('div');
      const thumbnailEl = document.createElement('div');
      const descEl = document.createElement('div');
      const tagsEl = document.createElement('div');
      const itemNameEl = document.createElement('h3');
      const priceEl = document.createElement('span');
  
      itemNameEl.textContent = item.title;
      priceEl.textContent = `￦ ${item.price.toLocaleString()}`;
    
      thumbnailEl.style.backgroundImage = `url(${item.thumbnail})`;
  
      divEl.classList.add('swiper-slide');
      thumbnailEl.classList.add('thumbnail');
      descEl.classList.add('desc');
      tagsEl.classList.add('tags');
      priceEl.classList.add('price')
    
      item.tags.map((tag, idx) => {
        if ( idx === 0 ) return
  
        const tagEl = document.createElement('span');
  
        tagEl.textContent = tag;
        tagEl.classList.add(tag)
  
        tagsEl.append(tagEl);
      });
  
      swiperWrapper.append(divEl);
      divEl.append(thumbnailEl, descEl);
      descEl.append(tagsEl, itemNameEl, priceEl);

      divEl.addEventListener('click', () => {
        router.navigate(`/detail/${item.id}`);
      });
    });
  
    loadingEl.remove();
  }

  new Swiper(swiperEl, {
    modules: [Navigation],
    slidesPerView : auto,
    spaceBetween: 35,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  console.log(product);
}