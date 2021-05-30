import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";

export async function deleteMount(mountPath: string): Promise<void> {
  const request = new Request(appendAPIURL("/v1/sys/mounts/" + mountPath), {
    method: "DELETE",
    headers: getHeaders(),
  });
  const resp = await fetch(request);
  await checkResponse(resp);
}
