import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";
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

  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as {
    data?: DecryptionResult;
  };

  return data.data;
}
