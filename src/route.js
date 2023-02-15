import Navigo from "navigo";
import { CommonFn } from "./common";
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
  CommonFn();
  renderMainPage();
});

router.on("/search/:query", function (params) {
  CommonFn();
  renderSearchPage(params);
});

router.on("/product/detail/:productId", function (params) {
  CommonFn();
  renderDetailPage(params);
});

router.on("/product/all", function () {
  CommonFn();
  renderAllProducts("all");
});

router.on("/product/best", function () {
  CommonFn();
  renderAllProducts("best");
});

router.on("/product/new", function () {
  CommonFn();
  renderAllProducts("new");
});

router.on("/product/cart", function () {
  CommonFn();
  console.log("cart");
});

router.on("/product/checkout", function () {
  CommonFn();
  console.log("checkout");
});

router.on("/mypage", function () {
  CommonFn();
  app.innerHTML = `<h1>My Page</h1>`;
});

router.on("/mypage/bank", function () {
  CommonFn();
  console.log("mypage/bank");
});

router.on("/login", function () {
  CommonFn();
  console.log("login");
});

router.on("/master", function () {
  CommonFn();
  renderMasterPage();
});

router.on("/master/product/detail/:id", function (match) {
  CommonFn();
  renderMasterProductDetailPage(match.data.id);
});

router.on("/master/product/add", function () {
  CommonFn();
  renderAddProduct();
});

router.on("/master/sold", function () {
  CommonFn();
  renderSoldProduct();
});

router.resolve();
