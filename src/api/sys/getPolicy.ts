import { appendAPIURL, getHeaders } from "../apiUtils";

export async function getPolicy(name: string): Promise<string> {
  const request = new Request(appendAPIURL("/v1/sys/policies/acl/" + name), {
    headers: getHeaders(),
  });
  const response = await fetch(request);
  const data = (await response.json()) as { data: { policy: string } };
  return data.data.policy;
}
