import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";

export async function renewSelf(): Promise<void> {
  const request = new Request(appendAPIURL("/v1/auth/token/renew-self"), {
    method: "POST",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const resp = await fetch(request);
  await checkResponse(resp);
}
