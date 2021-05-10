import { appendAPIURL, getHeaders } from "../apiUtils";


export async function sealVault(): Promise<void> {
  const request = new Request(appendAPIURL("/v1/sys/seal"), {
    method: 'PUT',
    headers: getHeaders(),
  });
  const resp = await fetch(request)
  const data = await resp.json() as { errors?: string[] };
  if ("errors" in data) {
    throw new Error(data.errors[0]);
  }
}
