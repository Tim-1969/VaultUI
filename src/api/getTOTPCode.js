import { appendAPIURL, getHeaders } from "./apiUtils.js";


export async function getTOTPCode(baseMount, name) {
  const request = new Request(appendAPIURL(`/v1/${baseMount}/code/${name}`), {
    headers: getHeaders(),
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data.data.code;
  });
}
