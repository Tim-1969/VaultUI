import { appendAPIURL } from "./apiUtils.js";


export async function usernameLogin(username, password) {
  const request = new Request(appendAPIURL(`/v1/auth/userpass/login/${username}`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "username": username, "password": password })
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    if ("auth" in data) {
      return data.auth.client_token;
    } else if ("errors" in data) {
      throw new Error(data.errors[0]);
    }
  });
}
