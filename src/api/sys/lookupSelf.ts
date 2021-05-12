import { TokenInfo } from "../types/token";
import { appendAPIURL, getHeaders } from "../apiUtils";

export async function lookupSelf(): Promise<TokenInfo> {
  const request = new Request(appendAPIURL("/v1/auth/token/lookup-self"), {
    headers: getHeaders(),
  });
  const resp = await fetch(request);
  const data = (await resp.json()) as { data?: TokenInfo; errors?: string[] };
  if ("data" in data) {
    return data.data;
  } else if ("errors" in data) {
    throw new Error(data.errors[0]);
  }
}
