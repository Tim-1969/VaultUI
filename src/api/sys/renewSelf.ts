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
  const resp = await fetch(request)
  const data = await resp.json() as { errors?: string[] };
  if ("errors" in data) {
    throw new Error(data.errors[0]);
  }
}
