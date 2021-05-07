import { appendAPIURL, getHeaders } from "./apiUtils.js";
import { removeDoubleSlash } from "../utils.js";


export async function transitDecrypt(baseMount, name, data) {
  const request = new Request(appendAPIURL(removeDoubleSlash(`/v1/${baseMount}/decrypt/${name}`)), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify({ ciphertext: data })
  });
  let response = await fetch(request);
  if (!response.ok) {
    let json = await response.json();
    throw new Error(json.errors[0]);
  } else {
    let json = await response.json();
    return json.data;
  }
}
