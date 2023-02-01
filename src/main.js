import {
  addBankAccount,
  deleteBankAccount,
  getBankAccount,
  getCurrentAccount,
  logIn,
} from "./utilities/userapi";
import {
  deleteMasterProduct,
  editMasterProduct,
  getMasterAllSoldList,
  getMasterProductList,
  postMasterProduct,
} from "./utilities/masterapi";
const loginEl = document.querySelector(".login");
const getBankEl = document.querySelector(".get-bank");
const bankAccountEl = document.querySelector(".get-bank-account");
const addBankEl = document.querySelector(".add-bank");
const delBankEl = document.querySelector(".del-bank");
const getMasterProduct = document.querySelector(".master-get-list");
const getMasterSoldList = document.querySelector(".master-get-sold-list");
const postMasterProductEl = document.querySelector(".master-post-product");
const editMasterProductEl = document.querySelector(".master-edit-product");
const deleteMasterProductEl = document.querySelector(".master-delete-product");

let access = "";
let products = [];
loginEl.addEventListener("click", async () => {
  const email = "abc@gmail.com";
  const password = "123456789";

  const data = { email, password };

  const res = await logIn(data);
  access = res.accessToken;
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
  const res = await getMasterProductList(access);
  products = res;
  console.log(res);
});

getMasterSoldList.addEventListener("click", async () => {
  const res = await getMasterAllSoldList(access);
  console.log(res);
});

postMasterProductEl.addEventListener("click", async () => {
  const data = { title: "test", price: 1000, description: "test" };

  const res = await postMasterProduct(data);
  console.log(res);
});

editMasterProductEl.addEventListener("click", async () => {
  const data = {
    id: "3p8jrxf83BClbeUyC1HA",
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
