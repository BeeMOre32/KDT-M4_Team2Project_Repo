/**
 * @param {String} id - 상품의 id
 * @returns {Promise<Object>} - 상품의 정보 반환
 * */
export async function getProductDetail(id) {
  const res = await fetch("/api/customer/getproductdetail?id=" + id);
  return await res.json();
}

/**
 * @param keyword {Object} - 검색할 태그 혹은 제목을 전달해야함
 * @param {String=} keyword.searchText - 제목
 * @param {String[]=} keyword.searchTags- 태그
 * @returns {Promise<Array>} - 검색 결과 반환
 * */
export async function searchProduct(keyword) {
  const res = await fetch("/api/customer/searchproduct", {
    method: "POST",
    body: JSON.stringify(keyword),
  });
  return await res.json();
}

/**
 * @param {Object} data - 상품을 구매하기 위한 정보
 * @param {String} data.userToken - 유저의 세션 토큰
 * @param {Object} data.info - 구매 정보
 * @param {String} data.info.productId - 구매할 상품의 id
 * @param {String} data.info.accountId - 결제할 계좌의 id
 * @returns {Promise<Boolean>} - 구매 성공 여부 반환
 */
export async function buyProduct(data) {
  const res = await fetch("/api/customer/buyproduct", {
    method: "POST",
    headers: { authorization: data.userToken },
    body: JSON.stringify(data.info),
  });
  console.log(res);
  return await res.json();
}

/**
 * @param {String} access - 유저의 세션 토큰
 * @returns {Promise<Array>} - 구매 내역 반환
 */
export async function getBuyList(access) {
  const res = await fetch("/api/customer/getbuylist", {
    method: "GET",
    headers: { authorization: access },
  });
  return await res.json();
}

/**
 * @param access - 유저의 세션 토큰
 * @param id - 거래내역에 있는 detailId
 * @returns {Promise<Object>}
 */
export async function getBuyDetail(access, id) {
  const res = await fetch("/api/customer/getbuydetail", {
    method: "POST",
    headers: { authorization: access },
    body: JSON.stringify({ detailId: id }),
  });
  return await res.json();
}

/**
 * @param {String} access - 유저의 세션 토큰
 * @param {String} id - 거래내역에 있는 detailId
 * @returns {Promise<Boolean>} - 성공 여부 반환
 * */
export async function cancelBuy(access, id) {
  const res = await fetch("/api/customer/cancelbuy", {
    method: "POST",
    headers: { authorization: access },
    body: JSON.stringify({ detailId: id }),
  });
  return await res.json();
}

/**
 * @param {String} access - 유저의 세션 토큰
 * @param {String} id - 거래내역에 있는 detailId
 * @returns {Promise<Boolean>} - 성공 여부 반환
 */
export async function confirmBuy(access, id) {
  const res = await fetch("/api/customer/confirmbuy", {
    method: "POST",
    headers: { authorization: access },
    body: JSON.stringify({ detailId: id }),
  });
  return await res.json();
}
