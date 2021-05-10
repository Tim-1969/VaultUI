import { DoesNotExistError } from "../../types/internalErrors";
import { appendAPIURL, getHeaders } from "../apiUtils";

export async function getTransitKeys(baseMount: string): Promise<string[]> {
  const request = new Request(appendAPIURL(`/v1/${baseMount}/keys?list=true`), {
    headers: getHeaders(),
  });
  const resp = await fetch(request);
  if (resp.status == 404) {
    throw DoesNotExistError;
  }
  const data = await resp.json() as { data:  string[] };
  return data.data;
}
