import { appendAPIURL, getHeaders } from "../apiUtils";

type TokenInfo = {
  expire_time: string;
}

export async function lookupSelf(): Promise<TokenInfo> {
  const request = new Request(appendAPIURL("/v1/auth/token/lookup-self"), {
    headers: getHeaders(),
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    if ("data" in data) {
      return data.data;
    } else if ("errors" in data) {
      throw new Error(data.errors[0]);
    }
  });
}
