import { appendAPIURL, getHeaders } from "./apiUtils.js";
import { removeDoubleSlash } from "../utils";


export async function transitEncrypt(baseMount, name, data) {
  const request = new Request(appendAPIURL(removeDoubleSlash(`/v1/${baseMount}/encrypt/${name}`)), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify({ plaintext: data })
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
