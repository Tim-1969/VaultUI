import { appendAPIURL } from "./apiUtils";

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
  const response = await fetch(request);
  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.errors[0]);
  }
}
