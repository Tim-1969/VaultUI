import { DoesNotExistError } from "../../types/internalErrors";
import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";

export async function getTransitKeys(baseMount: string): Promise<string[]> {
  const request = new Request(appendAPIURL(`/v1/${baseMount}/keys?list=true`), {
    headers: getHeaders(),
  });

  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as { data: { keys: string[] } };
  return data.data.keys;
}
