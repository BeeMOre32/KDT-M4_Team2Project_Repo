import {
  addBankAccount,
  deleteBankAccount,
  getBankAccount,
  getCurrentAccount,
  logIn,
} from "./utilities/api";

const loginEl = document.querySelector(".login");
const getBankEl = document.querySelector(".get-bank");
const bankAccountEl = document.querySelector(".get-bank-account");
const addBankEl = document.querySelector(".add-bank");
const delBankEl = document.querySelector(".del-bank");
let access = "";

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
