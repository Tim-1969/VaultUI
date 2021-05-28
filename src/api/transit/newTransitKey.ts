import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";
import { removeDoubleSlash } from "../../utils";

export async function newTransitKey(
  baseMount: string,
  parms: { name: string; type: string },
): Promise<void> {
  const request = new Request(
    appendAPIURL(removeDoubleSlash(`/v1/${baseMount}/keys/${parms.name}`)),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getHeaders(),
      },
      body: JSON.stringify(parms),
    },
  );
  const resp = await fetch(request);
  await checkResponse(resp);
}
