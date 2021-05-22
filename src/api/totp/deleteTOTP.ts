import { appendAPIURL, getHeaders } from "../apiUtils";

export async function deleteTOTP(baseMount: string, name: string): Promise<void> {
  const request = new Request(appendAPIURL(`/v1/${baseMount}/keys/${name}`), {
    method: "DELETE",
    headers: getHeaders(),
  });
  const resp = await fetch(request);
  if (!resp.ok) {
    const data = (await resp.json()) as { errors?: string[] };
    if ("errors" in data) {
      throw new Error(data.errors[0]);
    }
  }
}
