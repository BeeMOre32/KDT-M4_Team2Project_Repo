import { userAuth } from "./userapi";

/**
 * @description 유저 토큰을 관리하는 객체
 * @type {{_token: string, token}}
 * @type {string} _token
 * @type {string} token
 * @type {function} set token
 */
export const userToken = {
  _token: "",

  get token() {
    if (this._token === "") {
      this._token = getUserTokenLocalStorage();
    }
    return this._token;
  },
  set token(value) {
    setUserTokenLocalStorage(value);
    this._token = value;
  },
};

/**
 * @description 유저 토큰을 검증하는 함수
 * @returns {Promise<void>} 유저 토큰이 유효한지 검증
 * @type {string} token
 * @return {Promise<Object>} 유저 토큰이 유효하면 유저 정보를 반환
 * @return {Promise<String>} 유저 토큰이 유효하지 않으면 "유효하지 않은 토큰입니다. 로그인을 해주세요."를 반환
 */
export async function afterLoadUserAuth() {
  const token = userToken.token;
  let authResult;

  if (token === "" || token === null) {
    return "토큰이 없습니다. 로그인을 해주세요.";
  } else {
    authResult = await userAuth(token);
    return checkUserAuth(authResult);
  }
}

/**
 * @description 유저 토큰이 유효한지 검증하는 함수
 * @param authResult
 * @returns {Object} 유저 토큰이 유효하면 "유효한 토큰입니다."를 반환
 * @returns {String} 유저 토큰이 유효하지 않으면 "유효하지 않은 토큰입니다. 로그인을 해주세요."를 반환
 */
function checkUserAuth(authResult) {
  if (typeof authResult === "object") {
    return authResult;
  } else {
    return "유효하지 않은 토큰입니다. 로그인을 해주세요.";
  }
}

function setUserTokenLocalStorage(token) {
  localStorage.setItem("userToken", token);
}

function getUserTokenLocalStorage() {
  return localStorage.getItem("userToken");
}
