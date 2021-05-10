import { appendAPIURL } from "../apiUtils";

export async function usernameLogin(username: string, password: string): Promise<string> {
  const request = new Request(appendAPIURL(`/v1/auth/userpass/login/${username}`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "username": username, "password": password })
  });

  const resp = await fetch(request);
  const data = await resp.json() as { auth?: { client_token: string }; errors?: string[] };
  if ("auth" in data) {
    return data.auth.client_token;
  } else if ("errors" in data) {
    throw new Error(data.errors[0]);
  }
}
