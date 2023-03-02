import Navigo from "navigo";
import { CommonFn } from "./page/common";
import { renderCash } from "./page/cash";
import { renderCart } from "./page/cart";
import { renderMasterPage } from "./page/master";
import { renderAddProduct } from "./page/massteraddproduct";
import { renderMainPage } from "./page/main";
import { renderDetailPage } from "./page/productDetail";
import { renderMasterProductDetailPage } from "./page/masterproductdetail";

import { renderLoginPage } from "./page/login";
import { renderSignUp } from "./page/signup";

import { renderOrderHisory } from "./page/mypageOrder";
import { renderOrderDetail } from "./page/mypageOrderDetail";
import { renderMyAccount } from "./page/mypageAccount";
import { renderAccountAdd } from "./page/mypageAccountAdd";
import { renderMyProfile } from "./page/mypageProfile";

import { renderSoldProduct } from "./page/mastersoldlist";
import { renderAllProducts } from "./page/allproducts";
import { renderSearchPage } from "./page/search";

export const router = new Navigo("/");

router.hooks({
  before: (done) => {
    CommonFn()
    done()
  }
})

router.on("/", function () {
  renderMainPage();
});

router.on("/search/:query", function (params) {
  renderSearchPage(params);
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

router.on("/mypage", function() {
  renderMyProfile();
})

router.on("/mypage/order", function (params) {
  renderOrderHisory(params);
});

router.on("/mypage/order/detail/:id", function (order) {
  renderOrderDetail(order.data.id);
});

router.on("/mypage/account", function (params) {
  renderMyAccount(params);
});

router.on("/mypage/account/add", function (params) {
  renderAccountAdd(params);
});

router.on("/login", function () {
  renderLoginPage()
});

router.on("/signup", function () {
  renderSignUp()
});

router.on("/master", function () {
  renderMasterPage();
});

router.on("/master/product/detail/:id", function (match) {
  renderMasterProductDetailPage(match.data.id);
  console.log(match.data.id);
});

router.on("/master/product/add", function () {
  renderAddProduct();
});

router.on("/master/sold", function () {
  renderSoldProduct();
});

router.resolve();
