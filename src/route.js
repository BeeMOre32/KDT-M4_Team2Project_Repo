import Navigo from "navigo";
import { CommonFn } from "./common";
import { renderCash } from "./page/cash";
import { renderCart } from "./page/cart";
import { renderMasterPage } from "./page/master";
import { renderAddProduct } from "./page/massteraddproduct";
import { renderMainPage } from "./page/main";
import { renderDetailPage } from "./page/productDetail";
import { renderMasterProductDetailPage } from "./page/masterproductdetail";

import { renderLoginPage } from "./page/login";
import { renderSignUp } from "./page/signup";
import { renderOrderHisory, renderMyAccount, renderOrderDetail, renderAccountAdd } from "./page/mypage";

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
  renderCart();
});

router.on("/product/checkout", function () {
  CommonFn();
  renderCash();
});

router.on("/mypage/order", function (params) {
  CommonFn();
  renderOrderHisory(params);
});

router.on("/mypage/order/detail/:id", function (order) {
  CommonFn();
  renderOrderDetail(order.data.id);
});

router.on("/mypage/account", function (params) {
  CommonFn();
  renderMyAccount(params);
});

router.on("/mypage/account/add", function (params) {
  CommonFn();
  renderAccountAdd(params);
});

router.on("/login", function () {
  CommonFn();
  renderLoginPage()
});

router.on("/signup", function () {
  CommonFn();
  renderSignUp()
});

router.on("/master", function () {
  CommonFn();
  renderMasterPage();
});

router.on("/master/product/detail/:id", function (match) {
  CommonFn();
  renderMasterProductDetailPage(match.data.id);
  console.log(match.data.id);
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
