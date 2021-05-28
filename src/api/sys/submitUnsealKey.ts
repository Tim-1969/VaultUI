import { appendAPIURL, checkResponse } from "../apiUtils";

export async function submitUnsealKey(key: string): Promise<void> {
  const request = new Request(appendAPIURL("/v1/sys/unseal"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: key,
    }),
  });
  const resp = await fetch(request);
  await checkResponse(resp);
}
