import Navigo from "navigo";
import { renderMasterPage } from "./page/master";
import { renderAddProduct } from "./page/massteraddproduct";
import { renderMainPage } from "./page/main"
import { renderDetailPage } from "./page/productDetail"; 
import { renderMasterProductDetailPage } from "./page/masterproductdetail";
import { loginPage } from "./page/login";

export const router = new Navigo("/");
const app = document.querySelector("#app");

router.on("/", function () {
  renderMainPage();
});

router.on("/search/:query", function (params) {
  console.log(params.query);
});

router.on("/product/detail/:productId", function (params) {
  renderDetailPage(params);
});

router.on("/product/cart", function () {
  console.log("cart");
});

router.on("/product/checkout", function () {
  console.log("checkout");
});

router.on("/mypage", function () {
  app.innerHTML = `<h1>My Page</h1>`;
});

router.on("/mypage/bank", function () {
  console.log("mypage/bank");
});

router.on("/login", function () {
  renderLoginPage();
});

router.on("/master", function () {
  renderMasterPage();
});

router.on("/master/product/detail/:id", function (match) {
  renderMasterProductDetailPage(match.data.id);
});

router.on("/master/product/add", function () {
  renderAddProduct();
});

router.resolve();
