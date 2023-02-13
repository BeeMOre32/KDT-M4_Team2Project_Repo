/**
 * @description - 관리자 상품 리스트 조회
 * @returns {Promise<Array[Object]>} - 상품 리스트
 * */
export async function getMasterProductList() {
  const res = await fetch("/api/master/getproductlist");
  return await res.json();
}
/**
 * @description - 관리자 판매된 상품 리스트 조회
 * @returns {Promise<Array[Object]>} - 판매된 상품 리스트
 * */
export async function getMasterAllSoldList() {
  const res = await fetch("/api/master/getsoldlist");
  return await res.json();
}

/**
 * @description - 관리자 상품 등록
 * @param {Object} data - 상품 정보
 * @returns {Promise<Object>}
 */
export async function postMasterProduct(data) {
  const res = await fetch("/api/master/postproduct", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return await res.json();
}

/**
 * @description - 관리자 상품 수정
 * @param {{isSoldOut: boolean, id}} data - 상품 정보
 * @param {String} data.id - 상품 아이디
 * @param {Object} data.product - 상품 정보
 * @returns {Promise<Object>} - 수정된 상품 정보
 */
export async function editMasterProduct(data) {
  const res = await fetch("/api/master/editproduct?id=" + data.id, {
    method: "PUT",
    body: JSON.stringify(data.product),
  });
  return await res.json();
}

/**
 * @description - 관리자 상품 삭제
 * @param {String} id - 삭제할 상품 아이디
 * @returns {Promise<Boolean>} - 삭제 성공 여부
 */
export async function deleteMasterProduct(id) {
  const res = await fetch("/api/master/deleteproduct?id=" + id, {
    method: "DELETE",
  });
  return await res.json();
}

/**
 * @description - 관리자 상품 판매 확정
 * @param {String} detailId - 상품 아이디
 * @param {Object} data - 상품 정보
 * @returns {Promise<boolean>} - 수정된 여부
 */
export async function editMasterSold(detailId, data) {
  const res = await fetch("/api/master/editmastersold?id=" + detailId, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return await res.json();
}
