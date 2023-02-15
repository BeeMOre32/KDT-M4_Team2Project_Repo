import { searchProduct } from "../utilities/productapi";
import { router } from "../route";

export async function renderSearchPage(params) {
  const app = document.querySelector('#app');
  const searchText = params.data.query;

  app.innerHTML = /* html */`
    <div class="container search-page">
      <h1><span>'${searchText}'<span>로 검색한 결과입니다</h1>

      <div class="search--result">
        <ul>
          <li class="item">
            <div class="item--image"></div>
            <div class="item--info"></div>
          </li>
        </ul>
      </div>
    </div>
  `;

  const matchItems = await searchProduct({searchText});
  console.log(matchItems);
}