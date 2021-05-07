import { DoesNotExistError } from "../types/internalErrors";
import { appendAPIURL, getHeaders } from "./apiUtils.js";


export async function getSecrets(baseMount, mountType, secretPath) {
  let secretURL = "";
  if (mountType == "kv-v2") {
    secretURL = `/v1/${baseMount}/metadata/${secretPath.join("")}?list=true`;
  } else {
    // cubbyhole and v1 are identical
    secretURL = `/v1/${baseMount}/${secretPath.join("")}?list=true`;
  }
  const request = new Request(appendAPIURL(secretURL), {
    headers: getHeaders(),
  });
  return fetch(request).then(response => {
    if (response.status == 404) {
      throw DoesNotExistError;
    }
    return response.json();
  }).then(data => {
    return data.data.keys;
  });
}
