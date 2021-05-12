import { appendAPIURL, getHeaders } from "../apiUtils";
import { removeDoubleSlash } from "../../utils";

type EncryptionResult = {
  ciphertext: string;
};

type EncryptionPayload = {
  plaintext: string;
};

export async function transitEncrypt(
  baseMount: string,
  name: string,
  payload: EncryptionPayload,
): Promise<EncryptionResult> {
  const request = new Request(appendAPIURL(removeDoubleSlash(`/v1/${baseMount}/encrypt/${name}`)), {
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
    data?: EncryptionResult;
  };
  if (!response.ok) {
    throw new Error(data.errors[0]);
  } else {
    return data.data;
  }
}
