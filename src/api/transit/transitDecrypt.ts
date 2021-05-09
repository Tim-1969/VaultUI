import { appendAPIURL, getHeaders } from "../apiUtils";
import { removeDoubleSlash } from "../../utils";

type DecryptionResult = {
  plaintext: string;
}

export async function transitDecrypt(
  baseMount: string,
  name: string,
  data: string
): Promise<DecryptionResult> {
  const request = new Request(appendAPIURL(removeDoubleSlash(`/v1/${baseMount}/decrypt/${name}`)), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify({ ciphertext: data })
  });
  const response = await fetch(request);
  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.errors[0]);
  } else {
    const json = await response.json();
    return json.data;
  }
}
