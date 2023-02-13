const searchEl = document.querySelector("header form");
const inputEl = document.querySelector("header input");
const cartCountEl = document.querySelector(".cart-count");

searchEl.addEventListener("submit", (evt) => {
  evt.preventDefault();
  if (inputEl.value === "") return;
  router.navigate(`/search/${inputEl.value}`);
});

if (localStorage.getItem("cart")) {
  cartCountEl.textContent = JSON.parse(localStorage.getItem("cart")).length;
}
