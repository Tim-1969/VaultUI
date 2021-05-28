import { appendAPIURL, checkResponse, getHeaders } from "../../apiUtils";

export async function listUserPassUsers(path: string): Promise<string[]> {
  const request = new Request(appendAPIURL(`/v1/auth/${path}/users?list=true`), {
    headers: getHeaders(),
  });
  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as { data: { keys: string[] } };
  return data.data.keys;
}
