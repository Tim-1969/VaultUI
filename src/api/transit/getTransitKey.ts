import { TransitKeyType } from "../types/transit";
import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";

export async function getTransitKey(baseMount: string, name: string): Promise<TransitKeyType> {
  const request = new Request(appendAPIURL(`/v1/${baseMount}/keys/${name}`), {
    headers: getHeaders(),
  });

  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as { data: TransitKeyType };
  return data.data;
}
