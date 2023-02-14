import { afterLoadUserAuth } from "./utilities/userAuth";
import Navigo from "navigo";

const searchEl = document.querySelector('header form');
const inputEl = document.querySelector('header input');
const loginEl = document.querySelector('header .login');
const cartCountEl =  document.querySelector('header .cart .cart-count');

const userAuth = afterLoadUserAuth();

// const router = new Navigo("/");

searchEl.addEventListener('submit', evt => {
  evt.preventDefault();
  if(inputEl.value === "") return ;
  // router.navigate(`/search/${inputEl.value}`);
});

loginEl.addEventListener('click', () => {
  if(typeof userAuth === 'string') {
    // return router.navigate('/login');
  } else {
    // return router.navigate('/mypage');
  }
})

if ( localStorage.getItem('cart') ) {
  cartCountEl.textContent = JSON.parse(localStorage.getItem('cart')).length;
}