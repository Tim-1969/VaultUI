import { appendAPIURL, getHeaders } from "../apiUtils";

export async function renewSelf(): Promise<void> {
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
