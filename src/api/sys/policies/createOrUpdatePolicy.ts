import { appendAPIURL, checkResponse, getHeaders } from "../../apiUtils";

export async function createOrUpdatePolicy(name: string, policy_data: string): Promise<void> {
  const request = new Request(appendAPIURL("/v1/sys/policies/acl/" + name), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(),
    },
    body: JSON.stringify({ policy: policy_data }, null, 0),
  });

  const resp = await fetch(request);
  await checkResponse(resp);
}
