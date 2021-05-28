import { appendAPIURL, checkResponse, getHeaders } from "../../apiUtils";

export async function getPolicies(): Promise<string[]> {
  const request = new Request(appendAPIURL("/v1/sys/policies/acl?list=true"), {
    headers: getHeaders(),
  });
  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as { data: { keys: string[] } };
  return data.data.keys;
}
