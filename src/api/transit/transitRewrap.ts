import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";
import { removeDoubleSlash } from "../../utils";

type RewrapResult = {
  ciphertext: string;
};

type RewrapPayload = {
  ciphertext: string;
  key_version?: number;
};

export async function transitRewrap(
  baseMount: string,
  name: string,
  payload: RewrapPayload,
): Promise<RewrapResult> {
  const request = new Request(appendAPIURL(removeDoubleSlash(`/v1/${baseMount}/rewrap/${name}`)), {
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
    data?: RewrapResult;
  };

  return data.data;
}
