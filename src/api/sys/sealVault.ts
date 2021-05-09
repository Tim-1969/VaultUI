import { appendAPIURL, getHeaders } from "../apiUtils";


export async function sealVault(): Promise<void> {
  const request = new Request(appendAPIURL("/v1/sys/seal"), {
    method: 'PUT',
    headers: getHeaders(),
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    if ("errors" in data) {
      throw new Error(data.errors[0]);
    }
  });
}
