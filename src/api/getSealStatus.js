import { appendAPIURL } from "./apiUtils.js";


export async function getSealStatus() {
  const request = new Request(appendAPIURL("/v1/sys/seal-status"));
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data;
  });
}
