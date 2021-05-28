import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";
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

  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as {
    data?: EncryptionResult;
  };

  return data.data;
}
