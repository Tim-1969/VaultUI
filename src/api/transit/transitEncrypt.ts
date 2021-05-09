import { appendAPIURL, getHeaders } from "../apiUtils";
import { removeDoubleSlash } from "../../utils";

type EncryptionResult = {
  ciphertext: string;
}

export async function transitEncrypt(
  baseMount: string,
  name: string,
  data: string
): Promise<EncryptionResult> {
  const request = new Request(appendAPIURL(removeDoubleSlash(`/v1/${baseMount}/encrypt/${name}`)), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify({ plaintext: data })
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
