import { appendAPIURL, getHeaders } from "../apiUtils";
import { AuthListAPIType, AuthListType } from "../types/auth";

export async function listAuth(): Promise<AuthListType> {
  const request = new Request(appendAPIURL(`/v1/sys/auth`), {
    headers: getHeaders(),
  });
  const resp = await fetch(request);
  const data = (await resp.json()) as AuthListAPIType;
  return data.data;
}
