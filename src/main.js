import {
  addBankAccount,
  deleteBankAccount,
  getBankAccount,
  getCurrentAccount,
  logIn,
  userLogOut,
  userToken,
} from "./utilities/userapi";
import {
  deleteMasterProduct,
  editMasterProduct,
  getMasterAllSoldList,
  getMasterProductList,
  postMasterProduct,
} from "./utilities/masterapi";
import {
  buyProduct,
  cancelBuy,
  confirmBuy,
  getBuyDetail,
  getBuyList,
  getProductDetail,
  searchProduct,
} from "./utilities/productapi";
import { afterLoadUserAuth, userToken } from "./utilities/userAuth";

const loginEl = document.querySelector(".login");
const logoutEl = document.querySelector(".logout");
const getBankEl = document.querySelector(".get-bank");
const bankAccountEl = document.querySelector(".get-bank-account");
const addBankEl = document.querySelector(".add-bank");
const delBankEl = document.querySelector(".del-bank");
const getMasterProduct = document.querySelector(".master-get-list");
const getMasterSoldList = document.querySelector(".master-get-sold-list");
const postMasterProductEl = document.querySelector(".master-post-product");
const editMasterProductEl = document.querySelector(".master-edit-product");
const deleteMasterProductEl = document.querySelector(".master-delete-product");
const getProductDetailEL = document.querySelector(".get-product-details");
const searchProductEl = document.querySelector(".search-product");
const buyProductEl = document.querySelector(".buy-product");
const getBuyListEl = document.querySelector(".get-buy-list");
const cancelBuyEl = document.querySelector(".cancel-buy");
const confirmBuyEl = document.querySelector(".confirm-buy");
const getBuyDetailEl = document.querySelector(".get-buy-detail");

let access = "";
let products = [];
let buyList = [];

afterLoadUserAuth().then((r) => console.log(r));

loginEl.addEventListener("click", async () => {
  const email = "abc@gmail.com";
  const password = "123456789";

  const data = { email, password };

  const res = await logIn(data);
  userToken.token = res.accessToken;
  console.log(res);
});

logoutEl.addEventListener("click", async () => {
  const res = await userLogOut(userToken.token);
  console.log(res);
});
getBankEl.addEventListener("click", async () => {
  const res = await getBankAccount(access);
  console.log(res);
});

bankAccountEl.addEventListener("click", async () => {
  const res = await getCurrentAccount(access);
  console.log(res);
});

addBankEl.addEventListener("click", async () => {
  const data = {
    userToken: access,
    account: {
      bankCode: "088",
      accountNumber: "123456789012",
      phoneNumber: "01012345678",
      signature: true,
    },
  };

  const res = await addBankAccount(data);
  console.log(res);
});

delBankEl.addEventListener("click", async () => {
  const data = {
    userToken: access,
    account: {
      accountId: "JwIyOuc2u5jiofrAp8bW",
      signature: true,
    },
  };
  const res = await deleteBankAccount(data);
  console.log(res);
});

getMasterProduct.addEventListener("click", async () => {
  const res = await getMasterProductList();
  products = res;
  console.log(res);
});

getMasterSoldList.addEventListener("click", async () => {
  const res = await getMasterAllSoldList();
  console.log(res);
});

postMasterProductEl.addEventListener("click", async () => {
  const data = { title: "abc", price: 1000, description: "test" };

  const res = await postMasterProduct(data);
  console.log(res);
});

editMasterProductEl.addEventListener("click", async () => {
  const data = {
    id: "3fxhvQ3ilU5LXIbkjGfp",
    product: {
      title: "test",
      price: 1500,
    },
  };

  const res = await editMasterProduct(data);
  console.log(res);
});

deleteMasterProductEl.addEventListener("click", async () => {
  console.log(products[0].id);
  const res = await deleteMasterProduct(products[0].id);
  console.log(res);
});

getProductDetailEL.addEventListener("click", async () => {
  const res = await getProductDetail(products[0].id);
  console.log(res);
});

searchProductEl.addEventListener("click", async () => {
  const data = {
    searchText: "abc",
  };
  const res = await searchProduct(data);
  console.log(res);
});

buyProductEl.addEventListener("click", async () => {
  const data = {
    userToken: userToken._token,
    info: {
      productId: "y2aUHChiZght5WELD73T",
      accountId: "U9tTlCcON8ZuRmEdV8jJ",
    },
  };
  console.log(data);
  const res = await buyProduct(data);
  console.log(res);
});

getBuyListEl.addEventListener("click", async () => {
  const res = await getBuyList(access);
  buyList = res;
  console.log(res);
});

cancelBuyEl.addEventListener("click", async () => {
  const userToken = access;
  const buyId = buyList[0].detailId;
  const res = await cancelBuy(userToken, buyId);
  console.log(res);
});

confirmBuyEl.addEventListener("click", async () => {
  const res = await confirmBuy(access, buyList[1].detailId);
  console.log(res);
});

getBuyDetailEl.addEventListener("click", async () => {
  const res = await getBuyDetail(access, buyList[1].detailId);
  console.log(res);
});
