export async function getMasterProductList() {
  const res = await fetch("api/master/getproductlist");
  return await res.json();
}

export async function getMasterAllSoldList() {
  const res = await fetch("api/master/getsoldlist");
  return await res.json();
}

export async function postMasterProduct(data) {
  const res = await fetch("api/master/postproduct", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function editMasterProduct(data) {
  const res = await fetch("api/master/editproduct?id=" + data.id, {
    method: "PUT",
    body: JSON.stringify(data.product),
  });
  return await res.json();
}

export async function deleteMasterProduct(id) {
  const res = await fetch("api/master/deleteproduct?id=" + id, {
    method: "DELETE",
  });
  return await res.json();
}
