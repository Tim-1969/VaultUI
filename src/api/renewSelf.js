import { appendAPIURL, getHeaders } from "./apiUtils.js";


export async function renewSelf() {
  const request = new Request(appendAPIURL("/v1/auth/token/renew-self"), {
    method: 'POST',
    headers: {
      ...getHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    if ("errors" in data) {
      throw new Error(data.errors[0]);
    }
  });
}
