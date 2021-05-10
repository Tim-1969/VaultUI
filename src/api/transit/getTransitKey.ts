import { DoesNotExistError } from "../../types/internalErrors";
import { TransitKeyType } from "../types/transit";
import { appendAPIURL, getHeaders } from "../apiUtils";

export async function getTransitKey(baseMount: string, name: string): Promise<TransitKeyType> {
  const request = new Request(appendAPIURL(`/v1/${baseMount}/keys/${name}`), {
    headers: getHeaders(),
  });

  const resp = await fetch(request);
  if (resp.status == 404) {
    throw DoesNotExistError;
  }
  const data = await resp.json() as { data: TransitKeyType };
  return data.data;
}
