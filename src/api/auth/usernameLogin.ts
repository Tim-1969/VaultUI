import { appendAPIURL, checkResponse } from "../apiUtils";

export async function usernameLogin(username: string, password: string): Promise<string> {
  const request = new Request(appendAPIURL(`/v1/auth/userpass/login/${username}`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  });

  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as {
    auth: { client_token: string };
  };
  return data.auth.client_token;
}
