import Swiper from 'swiper';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import 'swiper/modules/navigation/navigation-element.min.css'
import 'swiper/modules/pagination/pagination-element.min.css'

import { getMasterProductList } from "../utilities/masterapi";

const visualSliderEl = document.querySelector('.visual .swiper')

const newItemSliderEl = document.querySelector('.new-items .swiper')
const newItemSliderWrapperEl = newItemSliderEl.querySelector('.swiper-wrapper')

;(
  async function () {
    const res = await getMasterProductList();
    products = res;
    console.log(res);

    renderNewItems(res)
  }
)();

function renderNewItems(items) {
  items = items.filter((item) =>  item.price > 10000)

  items.forEach((item) => {
    const divEl = document.createElement('div');
    const thumbnailEl = document.createElement('div');
    const itemNameEl = document.createElement('h3');

    itemNameEl.textContent = item.title;

    thumbnailEl.style.backgroundImage = `url(${item.thumbnail})`;

    divEl.classList.add('swiper-slide');
    thumbnailEl.classList.add('thumbnail');

    divEl.append(thumbnailEl, itemNameEl)
    newItemSliderWrapperEl.append(divEl);
  })
}
    
new Swiper(newItemSliderEl, {
  // loop : true,
  slidesPerView : 4,
  spaceBetween: 15,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  autoplay: true
});

new Swiper(visualSliderEl, {
  // loop : true,
  slidesPerView: 1,
  speed : 1000,
  autoplay:  {
    delay: 2500,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el : '.swiper-pagination',
  }
})

console.log(visualSliderEl)