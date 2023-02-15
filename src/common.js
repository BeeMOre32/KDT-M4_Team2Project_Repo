import { afterLoadUserAuth } from "./utilities/userAuth";
import { router } from "./route";

export async function CommonFn() {
  const searchEl = document.querySelector('header form');
  const inputEl = document.querySelector('header input');
  const loginEl = document.querySelector('header .login');
  const loginIconEl = document.querySelector('header .login .icon');
  const loginTextEl = document.querySelector('header .login .login--text');
  const cartCountEl =  document.querySelector('header .cart .cart-count');
  
  const userAuth = await afterLoadUserAuth();
  console.log(userAuth)
  
  searchEl.addEventListener('submit', evt => {
    evt.preventDefault();
    if(inputEl.value === "") return ;
    router.navigate(`/search/${inputEl.value}`);
  });
  
  loginEl.addEventListener('click', () => {
    if(userAuth === null || typeof userAuth === "string") {
      router.navigate('/login');
      return;
    } else {
      router.navigate('/mypage');
      return;
    }
  })

  ;(function() {
    //로그인 시 헤더에 이름 노출
    if(userAuth && typeof userAuth !== "string") {
      loginTextEl.textContent = userAuth.displayName + " 님!";
    } else {
      loginTextEl.textContent = "Login";
    }

    //로그인 시 헤더에 프로필이미지 노출
    if(userAuth.profileImg) {
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