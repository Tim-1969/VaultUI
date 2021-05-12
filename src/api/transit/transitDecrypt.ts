import { appendAPIURL, getHeaders } from "../apiUtils";
import { removeDoubleSlash } from "../../utils";

type DecryptionResult = {
  plaintext: string;
};

type DecryptionPayload = {
  ciphertext: string;
};

export async function transitDecrypt(
  baseMount: string,
  name: string,
  payload: DecryptionPayload,
): Promise<DecryptionResult> {
  const request = new Request(appendAPIURL(removeDoubleSlash(`/v1/${baseMount}/decrypt/${name}`)), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const response = await fetch(request);
  const data = (await response.json()) as {
    errors?: string[];
    data?: DecryptionResult;
  };
  if (!response.ok) {
    throw new Error(data.errors[0]);
  } else {
    return data.data;
  }
}
