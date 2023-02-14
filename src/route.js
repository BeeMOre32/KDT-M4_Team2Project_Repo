import Navigo from "navigo";
import { renderCash } from "./page/cash";
import { renderCart } from "./page/cart";
import { renderMasterPage } from "./page/master";
import { renderAddProduct } from "./page/massteraddproduct";
import { renderMainPage } from "./page/main";
import { renderDetailPage } from "./page/productDetail";
import { renderMasterProductDetailPage } from "./page/masterproductdetail";
import { renderOrderHisory, renderMyAccount } from "./page/mypage";

import { renderSoldProduct } from "./page/mastersoldlist";
import { renderAllProducts } from "./page/allproducts";

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
  renderCart();
});

router.on("/product/checkout", function () {
  renderCash();
});

router.on("/mypage/orderHistory", function (params) {
  renderOrderHisory(params);
});

router.on("/mypage/account", function (params) {
  renderMyAccount(params);
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
