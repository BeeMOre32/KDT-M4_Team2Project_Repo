import { afterLoadUserAuth, userToken } from "../utilities/userAuth";
import { userLogOut } from "../utilities/userapi";
import { router } from "../route";
import { getItems } from "../utilities/local";
export async function CommonFn() {
  const header = document.querySelector("header");
  header.innerHTML = /* html */ `
  <div class="header--container">
    <h1>
      <a href="/">
        <img src="https://user-images.githubusercontent.com/112364408/221510219-4741144a-aab7-4fde-adf7-18a7eb1e3334.svg" alt="Next Furniture" />
        Next Furniture
      </a>
    </h1>

    <nav>
      <ul>
        <li><a href="/product/all" data-navigo>ALL PRODUCTS</a></li>
        <li><a href="/product/best" data-navigo>BEST</a></li>
        <li><a href="/product/new" data-navigo>NEW</a></li>
      </ul>
    </nav>

    <div class="side">
      <form>
        <input type="text" placeholder="Search" />
        <button class="material-symbols-outlined">search</button>
      </form>

      <a class="cart" href="/product/cart" data-navigo>
        <span class="material-symbols-outlined"> local_mall </span>
        <span class="cart-count">0</span>
      </a>

      <div class="login">
        <span class="profile material-symbols-outlined icon">
          account_circle
        </span>
        <span class="login--text">Login</span>
        <ul class="login--dropdown hidden">
          <li data-href="/mypage">내 프로필</li>
          <li data-href="/mypage/order">주문/결제</li>
          <li data-href="/mypage/account">자산목록</li>
          <li class="logout" data-href="/">로그아웃</li>
        </ul>
      </div>
    </div>
  </div>
  `;
  const searchEl = document.querySelector("header form");
  const inputEl = document.querySelector("header input");
  const loginEl = document.querySelector("header .login");
  const loginIconEl = document.querySelector("header .login .icon");
  const loginTextEl = document.querySelector("header .login .login--text");
  const dropdownEl = document.querySelector("header .login .login--dropdown");
  const logoutEl = document.querySelector(
    "header .login .login--dropdown .logout"
  );
  const cartCountEl = document.querySelector("header .cart .cart-count");

  let userAuth = await afterLoadUserAuth();
  checkLogin(userAuth);

  searchEl.addEventListener("submit", (evt) => {
    evt.preventDefault();
    if (inputEl.value === "") return;
    router.navigate(`/search/${inputEl.value}`);
  });

  dropdownEl.addEventListener("click", (event) => {
    router.navigate(event.target.dataset.href);
  });

  loginEl.addEventListener("click", async () => {
    console.log("click");
    if (!userAuth) {
      router.navigate("/login");
      return;
    }

    dropdownEl.classList.toggle("hidden");
  });

  logoutEl.addEventListener("click", async () => {
    const res = await userLogOut(userToken.token);
    console.log(res);

    if (res) {
      localStorage.removeItem("userToken");
      loginIconEl.classList.remove("profile");
      loginTextEl.textContent = "Login";
      loginIconEl.style.backgroundImage = "";

      userAuth = await afterLoadUserAuth();
      checkLogin(userAuth);
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest(".login")) return;

    dropdownEl.classList.add("hidden");
  });

  function checkLogin(userAuth) {
    console.log(userAuth);

    //로그인 시 헤더에 이름 노출
    if (userAuth) {
      loginTextEl.innerHTML = /* html */ `
        ${userAuth.displayName} 님!
        <span class="material-symbols-outlined">
          arrow_drop_down
        </span>
        `;
      loginEl.classList.add("logged-in");
    } else {
      loginTextEl.textContent = "Login";
      loginIconEl.classList.remove("profile");
      loginEl.classList.remove("logged-in");
    }

    //로그인 시 헤더에 프로필이미지 노출
    if (userAuth && userAuth.profileImg) {
      loginIconEl.classList.add("profile");
      loginIconEl.style.backgroundImage = `url(${userAuth.profileImg})`;
    } else {
      loginIconEl.classList.remove("profile");
    }
  }

  if (getItems("cart")) {
    cartCountEl.textContent = getItems("cart").length;
  }
}
