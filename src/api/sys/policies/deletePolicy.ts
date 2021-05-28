import { appendAPIURL, checkResponse, getHeaders } from "../../apiUtils";

export async function deletePolicy(name: string): Promise<void> {
  const request = new Request(appendAPIURL("/v1/sys/policies/acl/" + name), {
    method: "DELETE",
    headers: getHeaders(),
  });
  const resp = await fetch(request);
  await checkResponse(resp);
}
