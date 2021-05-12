import { appendAPIURL, getHeaders } from "../apiUtils";
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

  const response = await fetch(request);
  const data = (await response.json()) as {
    errors?: string[];
    data?: RewrapResult;
  };
  if (!response.ok) {
    throw new Error(data.errors[0]);
  } else {
    return data.data;
  }
}
