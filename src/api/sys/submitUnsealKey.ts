import { appendAPIURL } from "../apiUtils";

export async function submitUnsealKey(key: string): Promise<void> {
  const request = new Request(appendAPIURL("/v1/sys/unseal"), {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "key": key
    })
  });
  const resp = await fetch(request)
  if (!resp.ok) {
    const data = await resp.json() as { errors?: string[] };
    if ("errors" in data) {
      throw new Error(data.errors[0]);
    }
  }
}
