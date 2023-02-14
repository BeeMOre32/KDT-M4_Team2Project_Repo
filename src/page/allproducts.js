import '../style/allproducts.scss';

import { getMasterProductList } from "../utilities/masterapi";
import { router } from "../route"

export async function renderAllProducts(headCategory) {
  window.scrollTo({top: 0, behavior: "smooth"});

  const app = document.getElementById('app');

  app.innerHTML = /* html */ `
  <div class="container product-list-page">
    <div class="side">
      <div class="sticky-box">
        <h2>카테고리</h2>
        <ul class="category--selector">
          <li class="bed active">
            <span class="category--name">침대</span>
            <span class="material-symbols-outlined icon">chevron_right</span>
          </li>
          <li class="chair">
            <span class="category--name">소파</span>
            <span class="material-symbols-outlined icon">chevron_right</span>
          </li>
          <li class="table">
            <span class="category--name">테이블</span>
            <span class="material-symbols-outlined icon">chevron_right</span>
          </li>
          <li class="closet">
            <span class="category--name">수납</span>
            <span class="material-symbols-outlined icon">chevron_right</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="products">
      <div class="products--header">
        <h2>${headCategory === 'all' ? '전체상품' : headCategory.toUpperCase() + ' ITEMS'}</h2>

        <select id="filter">
          <option value="title">이름순</option>
          <option value="price">낮은가격순</option>
        </select>
      </div>
      <div class="products--list">
        <ul>
          <!-- 상품추가 -->
        </ul>
        <div class="loading"></div>
      </div>
    </div>
  </div>
  `;

  let items = await getMasterProductList();  
  if (headCategory !== 'all') {
    items = items.filter(item => item.tags.includes(headCategory));
  }

  const categoryUlEl = document.querySelector('.side .category--selector');
  const selectOptionEl = document.getElementById('filter');
  const loadingEl = document.querySelector('.products .loading');

  let bodyCategory = 'bed';
  let sortOption = 'title';

  renderClassifiedItems(items, bodyCategory, sortOption);
  console.log(items);

  categoryUlEl.addEventListener('click', evt => {
    const liEl = evt.target.closest('li') 
    if(liEl.classList.contains('active')) {
      return
    } else {
      Array.from(categoryUlEl.children).forEach((li) => {
        li.classList.remove('active');
      });

      window.scrollTo({top: 0, behavior: "smooth"});

      bodyCategory = liEl.className;
      renderClassifiedItems(items, bodyCategory, sortOption);
      liEl.classList.add('active');
      
    }
  });

  selectOptionEl.addEventListener('change', () => {
    sortOption = selectOptionEl.value;
    console.log(sortOption)
    renderClassifiedItems(items, bodyCategory, sortOption);
  })

  loadingEl.remove();
}

function renderClassifiedItems(items, category, option) {
  const productsUlEl = document.querySelector('.products .products--list ul');
  productsUlEl.innerHTML = "";

  items = items.filter((item) =>  item.tags.includes(category));
  items = sortItems(items,option);

  items.forEach((item) => {
    const liEl = document.createElement('li');
    const thumbnailEl = document.createElement('div');
    const descEl = document.createElement('div');
    const tagsEl = document.createElement('div');
    const itemNameEl = document.createElement('h3');
    const priceEl = document.createElement('span');

    itemNameEl.textContent = item.title;
    priceEl.textContent = item.isSoldOut ? '￦ 품절되었습니다' : `￦ ${item.price.toLocaleString()}`;
  
    thumbnailEl.style.backgroundImage = `url(${item.thumbnail})`;

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

    productsUlEl.append(liEl);
    liEl.append(thumbnailEl, descEl);
    descEl.append(tagsEl, itemNameEl, priceEl);

    liEl.addEventListener('click', () => {
      router.navigate(`/product/detail/${item.id}`);
    });
  });
}

function sortItems(items,option) {
  items.sort((a,b) => {
    if (a[option] < b[option]) {
      return -1;
    }
    if (a[option] > b[option]) {
      return 1;
    }

    return 0;
  })

  return items
}