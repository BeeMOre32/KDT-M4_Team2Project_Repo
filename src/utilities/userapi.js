/**
 * @description 유저 회원가입
 * @param {Object} data - 회원가입 정보
 * @param {String} data.email - 이메일
 * @param {String} data.password - 비밀번호
 * @param {String} data.displayNames - 이름
 * @param {String=} data.profileImgBase64 - Base64 이미지
 * @returns {Promise<Object>} - 회원가입 결과 및 토큰
 * */
export async function signIn(data) {
  const res = await fetch("api/account/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return await res.json();
}

/**
 * @description 유저 로그인
 * @param {Object} data - 로그인 정보
 * @param {String} data.email - 이메일
 * @param {String} data.password - 비밀번호
 * @returns {Promise<Object>} - 로그인 결과 및 토큰
 * */
export async function logIn(data) {
  const res = await fetch("api/account/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return await res.json();
}

/**
 * @description 유저의 토큰을 검증하여 유효한 토큰인지 확인하게 되면 로그인 처리
 * @param {String} access - 유저의 토큰
 * @returns {Promise<Object>} - 로그인 결과 및 토큰
 * */
export async function userAuth(access) {
  const res = await fetch("api/account/auth", {
    method: "POST",
    headers: {
      authorization: "Bearer " + access,
    },
  });
  return await res.json();
}

/**
 * @description 유저 로그아웃
 * @param {String} access - 유저의 토큰
 * @returns {Promise<Boolean>} - 로그아웃 결과
 * */
export async function userLogOut(access) {
  const res = await fetch("api/account/logout", {
    method: "POST",
    headers: {
      authorization: "Bearer " + access,
    },
  });
  return await res.json();
}
/**
 * @description 유저 정보 수정
 * @param {Object} data - 유저 정보
 * @param {String} data.userToken - 유저 토큰
 * @param {Object=} data.user - 유저 정보
 * @param {String} data.user.displayName - 유저 닉에임
 * @param {String} data.user.profileImgBase64 - 유저 프로필 이미지
 * @param {String} data.user.oldPassword - 유저 비밀번호
 * @param {String} data.user.newPassword - 유저 비밀번호 확인
 * */
export async function userInfoEdit(data) {
  const res = await fetch("api/account/userinfoedit", {
    method: "PUT",
    headers: { authorization: "Bearer " + data.userToken },
    body: JSON.stringify(data.user),
  });

  return await res.json();
}

/**
 * @description 계좌 목록들을 가져옴
 * @param {String} access - 유저의 토큰
 * @returns {Promise<Array[Object]>} - 계좌 목록
 *  */
export async function getBankAccount(access) {
  const res = await fetch("api/bank/getbankaccount", {
    method: "GET",
    headers: {
      authorization: "Bearer " + access,
    },
  });
  return await res.json();
}

/**
 * @description 현재 계좌를 가져옴
 * @param {String} access - 유저의 토큰
 * @returns {Promise<Array[Object]>} - 현재 계좌
 * */
export async function getCurrentAccount(access) {
  const res = await fetch("api/bank/getcurrentaccount", {
    method: "GET",
    headers: {
      authorization: "Bearer " + access,
    },
  });
  return await res.json();
}

/**
 * @description 계좌를 생성
 * @param {Object} data - 생성할 계좌의 정보
 * @param {String} data.userToken - 유저 토큰
 * @param {Object} data.account - 계좌 정보
 * @param {String} data.account.bankCode - 은행 코드
 * @param {String} data.account.accountNumber - 생성할 계좌 번호
 * @param {String} data.account.phoneNumber - 계좌 주인의 전화번호
 * @param {Boolean} data.account.signature - 계좌 주인의 서명 여부
 * @returns {Promise<Object>} - 생성된 계좌의 정보
 * */
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

/**
 * @description 계좌를 삭제
 * @param {Object} data - 삭제할 계좌의 정보
 * @param {String} data.userToken - 유저 토큰
 * @param {Object} data.account - 계좌 정보
 * @param {String} data.account.accountId - 삭제할 계좌의 아이디
 * @param {Boolean} data.account.signature - 계좌 주인의 서명 여부
 * @returns {Promise<Boolean>} - 삭제 결과
 * */
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
