import { afterLoadUserAuth } from "./utilities/userAuth";
import { userLogOut } from "./utilities/userapi";
import { router } from "./route";

export async function CommonFn() {
  const searchEl = document.querySelector('header form');
  const inputEl = document.querySelector('header input');
  const loginEl = document.querySelector('header .login');
  const loginIconEl = document.querySelector('header .login .icon');
  const loginTextEl = document.querySelector('header .login .login--text');
  const contextEl = document.querySelector('header .login .login--context');
  const logoutEl = document.querySelector('header .login .login--context .logout');
  const cartCountEl =  document.querySelector('header .cart .cart-count');
  
  const userAuth = await afterLoadUserAuth();
  console.log(userAuth)

  searchEl.addEventListener('submit', evt => {
    evt.preventDefault();
    if(inputEl.value === "") return ;
    router.navigate(`/search/${inputEl.value}`);
  });
  
  contextEl.addEventListener('click', event => {
    loginEl.classList.remove('show-context');
    router.navigate(event.target.dataset.href);
  })

  loginEl.addEventListener('click', () => {
    if(userAuth === null) {
      router.navigate('/login');
    } else {
      loginEl.classList.toggle('show-context');
    }
  })

  logoutEl.addEventListener('click', async () => {
    const res = await userLogOut(localStorage.getItem('userToken'));

    if(res) {
      loginIconEl.classList.remove('profile');
      loginTextEl.textContent = "Login";
      loginIconEl.backgroungImage = "";
    }
  })



  ;(function() {
    //로그인 시 헤더에 이름 노출
    if(userAuth && typeof userAuth !== "string") {
      loginTextEl.innerHTML = /* html */`
        ${userAuth.displayName} 님!
        <span class="material-symbols-outlined">
          arrow_drop_down
        </span>
        `;
    } else {
      loginTextEl.textContent = "Login";
      loginIconEl.classList.remove('profile')
    }

    //로그인 시 헤더에 프로필이미지 노출
    if(userAuth && userAuth.profileImg) {
      loginIconEl.classList.add('profile')
      loginIconEl.backgroungImage = `url(${userAuth.profileImg})`
    } else {
      loginIconEl.classList.remove('profile')
    }
  })()
    
  if ( localStorage.getItem('cart') ) {
    cartCountEl.textContent = JSON.parse(localStorage.getItem('cart')).length;
  }
}