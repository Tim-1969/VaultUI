import { TokenInfo } from "../types/token";
import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";

export async function lookupSelf(): Promise<TokenInfo> {
  const request = new Request(appendAPIURL("/v1/auth/token/lookup-self"), {
    headers: getHeaders(),
  });
  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as { data: TokenInfo };
  return data.data;
}
