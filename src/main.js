import { logIn, userAuth, userInfoEdit, userLogOut } from "./utilities/api";

const btn = document.querySelector(".login");
const authEl = document.querySelector(".auth");
const logoutEl = document.querySelector(".logout");
const uesrInfoEl = document.querySelector(".userinfo");
let access = "";

btn.addEventListener("click", async () => {
  const email = "abc@gmail.com";
  const password = "123456789";

  const data = { email, password };

  const res = await logIn(data);
  access = res.accessToken;
  console.log(res);
});

async function userAuths() {
  const res = await userAuth(access);
  console.log(res);
}

authEl.addEventListener("click", userAuths);
logoutEl.addEventListener("click", async () => {
  const res = await userLogOut(access);
  console.log(res);
});
uesrInfoEl.addEventListener("click", async () => {
  const data = {
    userToken: access,
    user: {
      displayName: "abc",
    },
  };
  const res = await userInfoEdit(data);
  console.log(res);
});
