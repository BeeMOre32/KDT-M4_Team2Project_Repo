import Navigo from "navigo";
import { renderMasterPage } from "./page/master";
import { renderAddProduct } from "./page/massteraddproduct";
import { renderMainPage } from "./page/main";
import { renderDetailPage } from "./page/productDetail";
import { renderMasterProductDetailPage } from "./page/masterproductdetail";
import { renderSoldProduct } from "./page/mastersoldlist";
import { renderAllProducts } from "./page/allproducts";
import { renderSearchPage } from "./page/search";

export const router = new Navigo("/");
const app = document.querySelector("#app");

router.on("/", function () {
  renderMainPage();
});

router.on("/search/:query", function (params) {
  console.log(params.query);
  renderSearchPage();
});

router.on("/product/detail/:productId", function (params) {
  renderDetailPage(params);
});

router.on("/product/all", function () {
  renderAllProducts("all");
});

router.on("/product/best", function () {
  renderAllProducts("best");
});

router.on("/product/new", function () {
  renderAllProducts("new");
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
  console.log("login");
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

router.on("/master/sold", function () {
  renderSoldProduct();
});

router.resolve();
