import { appendAPIURL } from "./apiUtils.js";


export async function submitUnsealKey(key) {
  const request = new Request(appendAPIURL("/v1/sys/unseal"), {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "key": key
    })
  });
  let response = await fetch(request);
  if (!response.ok) {
    let json = await response.json();
    throw new Error(json.errors[0]);
  }
}
