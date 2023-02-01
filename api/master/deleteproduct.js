import fetch from "node-fetch";
import { basicHeaders, basicUrl } from "../api";

export default async function handler(request, response) {
  const res = await fetch(basicUrl + "/products/" + request.query.id, {
    method: "DELETE",
    headers: { ...basicHeaders, masterKey: true },
  });
  const data = await res.json();

  return response.status(200).json(data);
}
