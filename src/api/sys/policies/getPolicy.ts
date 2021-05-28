import { appendAPIURL, checkResponse, getHeaders } from "../../apiUtils";

export async function getPolicy(name: string): Promise<string> {
  const request = new Request(appendAPIURL("/v1/sys/policies/acl/" + name), {
    headers: getHeaders(),
  });
  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as { data: { policy: string } };
  return data.data.policy;
}
