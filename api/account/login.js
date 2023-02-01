import fetch from "node-fetch";
import { basicHeaders, basicUrl } from "../api";

export default async function handler(request, response) {
  const res = await fetch(basicUrl + "/auth/login", {
    method: "POST",
    headers: basicHeaders,
    body: request.body,
  });
  const data = await res.json();

  return response.status(200).json(data);
}
