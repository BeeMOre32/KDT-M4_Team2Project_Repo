const searchEl = document.querySelector('header form');
const inputEl = document.querySelector('header input');
const cartCountEl =  document.querySelector('header .cart .cart-count');

searchEl.addEventListener('submit', evt => {
  evt.preventDefault();
  if(inputEl.value === "") return ;
  router.navigate(`/search/${inputEl.value}`);
})

cartCountEl.textContent = JSON.parse(localStorage.getItem('cart')).length;