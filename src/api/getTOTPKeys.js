import { DoesNotExistError } from "../types/internalErrors.js";
import { appendAPIURL, getHeaders } from "./apiUtils.js";


export async function getTOTPKeys(baseMount) {
  const request = new Request(appendAPIURL(`/v1/${baseMount}/keys?list=true`), {
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
