import { appendAPIURL, getHeaders } from "./apiUtils.js";


export async function getMounts() {
  const request = new Request(appendAPIURL("/v1/sys/internal/ui/mounts"), {
    headers: getHeaders(),
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data.data.secret;
  });
}
