import { appendAPIURL, getHeaders } from "../../apiUtils";

export async function getPolicies(): Promise<string[]> {
  const request = new Request(appendAPIURL("/v1/sys/policies/acl?list=true"), {
    headers: getHeaders(),
  });
  const response = await fetch(request);
  const data = (await response.json()) as { data: { keys: string[] } };
  return data.data.keys;
}
