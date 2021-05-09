import { appendAPIURL, getHeaders } from "../apiUtils";
import { removeDoubleSlash } from "../../utils";

type RewrapResult = {
  ciphertext: string;
}

type RewrapPayload = {
  ciphertext: string;
  key_version?: number;
}

export async function transitRewrap(
  baseMount: string,
  name: string,
  payload: RewrapPayload
): Promise<RewrapResult> {
  const request = new Request(appendAPIURL(removeDoubleSlash(`/v1/${baseMount}/rewrap/${name}`)), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify(payload)
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
