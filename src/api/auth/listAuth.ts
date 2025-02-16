import { AuthListAPIType, AuthListType } from "../types/auth";
import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";

export async function listAuth(): Promise<AuthListType> {
  const request = new Request(appendAPIURL(`/v1/sys/auth`), {
    headers: getHeaders(),
  });
  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as AuthListAPIType;
  return data.data;
}
