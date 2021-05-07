import { appendAPIURL, getHeaders } from "./apiUtils.js";
import { removeDoubleSlash } from "../utils.js";


export async function addNewTOTP(baseMount, parms) {
  const request = new Request(appendAPIURL(removeDoubleSlash(`/v1/${baseMount}/keys/${parms.name}`)), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify(parms)
  });
  let response = await fetch(request);
  if (!response.ok) {
    let json = await response.json();
    throw new Error(json.errors[0]);
  }
}
