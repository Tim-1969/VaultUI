import { appendAPIURL, getHeaders } from "../apiUtils";

export async function sealVault(): Promise<void> {
  const request = new Request(appendAPIURL("/v1/sys/seal"), {
    method: "PUT",
    headers: getHeaders(),
  });
  await fetch(request);
}
