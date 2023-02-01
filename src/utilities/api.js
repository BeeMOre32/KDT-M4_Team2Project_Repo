// Data는 반드시 객체 형태이고, api 문서 그대로 보내주어야 한다.
export async function signIn(data) {
  const res = await fetch("api/account/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return await res.json();
}
// Data는 반드시 객체 형태이고, api 문서 그대로 보내주어야 한다.
export async function logIn(data) {
  const res = await fetch("api/account/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return await res.json();
}
// Data는 반드시 Access Token 형태로 보내주어야 하며, 반환 되는 값은 객체 형태이다.
export async function userAuth(access) {
  const res = await fetch("api/account/auth", {
    method: "POST",
    headers: {
      authorization: "Bearer " + access,
    },
  });
  return await res.json();
}
// Data는 반드시 Access Token 형태로 보내주어야 하며, 반환 되는 값은 Boolean 형태이다.
export async function userLogOut(access) {
  const res = await fetch("api/account/logout", {
    method: "POST",
    headers: {
      authorization: "Bearer " + access,
    },
  });
  return await res.json();
}
// Data는 반드시 갹체 형태로 보내주어야 하며, 반환 되는 값은 객체 형태이다.
export async function userInfoEdit(data) {
  const res = await fetch("api/account/userinfoedit", {
    method: "PUT",
    headers: { authorization: "Bearer " + data.userToken },
    body: JSON.stringify(data.user),
  });

  return await res.json();
}
// Data는 반드시 Access Token 형태로 보내주어야 하며, 반환 되는 값은 객체 형태이다.
export async function getBankAccount(access) {
  const res = await fetch("api/bank/getbankaccount", {
    method: "GET",
    headers: {
      authorization: "Bearer " + access,
    },
  });
  return await res.json();
}
// Data는 반드시 Access Token 형태로 보내주어야 하며, 반환 되는 값은 객체 형태이다.
export async function getCurrentAccount(access) {
  const res = await fetch("api/bank/getcurrentaccount", {
    method: "GET",
    headers: {
      authorization: "Bearer " + access,
    },
  });
  return await res.json();
}
// Data는 반드시 객체의 형태로 보내주어야 하며, 반환 되는 값은 객체 형태이다.
export async function addBankAccount(data) {
  const res = await fetch("api/bank/addbankaccount", {
    method: "POST",
    headers: {
      authorization: "Bearer " + data.userToken,
    },
    body: JSON.stringify(data.account),
  });
  return await res.json();
}
// Data는 반드시 객체의 형태로 보내주어야 하며, 반환 되는 값은 객체 형태이다.
export async function deleteBankAccount(data) {
  const res = await fetch("api/bank/deletebankaccount", {
    method: "DELETE",
    headers: {
      authorization: "Bearer " + data.userToken,
    },
    body: JSON.stringify(data.account),
  });
  return await res.json();
}
