import "../style/search.scss";

import { searchProduct } from "../utilities/productapi";
import { router } from "../route";

export async function renderSearchPage(params) {
  const app = document.querySelector('#app');
  const searchText = params.data.query;

  app.innerHTML = /* html */`
    <div class="container search-page">
      <h2><span>'${searchText}' <span>(으)로 검색한 결과입니다</h2>
      
      <div class="search--result">
        <div class="sort--toggle">
          <span class="option title">이름순</span>
          <span class="material-symbols-outlined">
            arrow_drop_down
          </span>
        </div>
        <span class="loading"></span>
        <ul>
        </ul>
      </div>
    </div>
  `;

  let matchItems = await searchProduct({searchText});

  const sortEl = document.querySelector('.sort--toggle .option');

  let sortOption = 'title';
  
  matchItems = sortItems(matchItems, sortOption);
  renderMatchItems(searchText, matchItems);

  sortEl.addEventListener('click',() => {
    if(sortEl.classList.contains('title')) {
      sortEl.classList.remove('title')
      sortEl.textContent = '가격순';
      sortOption = 'price';
    } else {
      sortEl.classList.add('title');
      sortEl.textContent = '이름순';
      sortOption = 'title';
    }

    matchItems = sortItems(matchItems, sortOption);
    renderMatchItems(searchText, matchItems);
  });
}

function renderMatchItems(searchText, matchItems) {
  const ulEl = document.querySelector('.search--result ul');
  const loadingEl = document.querySelector('.search--result .loading');
  ulEl.innerHTML = '';

  if(matchItems.length === 0) {
    const h2El = document.querySelector('h2');
    const sortEl = document.querySelector('.sort--toggle');

    h2El.innerHTML = `<span>'${searchText}' <span>와(과) 일치하는 검색결과가 없습니다`
    sortEl.classList.add('hidden');
  }

  matchItems.forEach(item => {
    const liEl = document.createElement('li');
    const imgEl = document.createElement('div');
    const infoEl = document.createElement('div');
    const titleEl = document.createElement('h3');
    const categoryEl = document.createElement('span');
    const tagsEl = document.createElement('div');
    const priceEl = document.createElement('div');
    const descEl = document.createElement('p');

    imgEl.classList.add('product--image');
    infoEl.classList.add('product--info');
    categoryEl.classList.add('category');
    tagsEl.classList.add('tags');
    priceEl.classList.add('price');

    imgEl.style.backgroundImage = `url(${item.thumbnail})`;

    item.tags.forEach((tag, idx) => {
      if(idx === 0) return;
      const tagEl = document.createElement('span');
      tagEl.textContent = tag;
      tagsEl.append(tagEl);
    })

    titleEl.textContent = item.title;
    categoryEl.textContent = CategoryToKorean(item.tags[0]);
    priceEl.textContent = `￦ ${item.price.toLocaleString()}`;
    descEl.innerHTML = /* html */`${item.description}... <span>자세히보기</span>`

    infoEl.append(titleEl, categoryEl, tagsEl, priceEl, descEl)
    liEl.append(imgEl, infoEl);
    ulEl.append(liEl);

    liEl.addEventListener('click', () => {
      router.navigate(`/product/detail/${item.id}`);
    })
  })

  loadingEl.remove();
}

function CategoryToKorean(category) {
  switch(category) {
    case 'bed':
      return '침대'
    case 'chair':
      return '의자/소파'
    case 'table':
      return '테이블'
    case 'closet':
      return '수납'
    
    default:
      return category;
  }
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