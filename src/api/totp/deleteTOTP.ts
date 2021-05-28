import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";

export async function deleteTOTP(baseMount: string, name: string): Promise<void> {
  const request = new Request(appendAPIURL(`/v1/${baseMount}/keys/${name}`), {
    method: "DELETE",
    headers: getHeaders(),
  });
  const resp = await fetch(request);
  await checkResponse(resp);
}
