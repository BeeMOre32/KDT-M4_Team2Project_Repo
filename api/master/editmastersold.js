import fetch from "node-fetch";
import { basicHeaders, basicUrl } from "../api";

export default async function handler(request, response) {
  const res = await fetch(
    basicUrl + "/products/transactions/" + request.query.id,
    {
      method: "PUT",
      headers: { ...basicHeaders, masterKey: true },
      body: request.body,
    }
  );
  const data = await res.json();

  return response.status(200).json(data);
}
