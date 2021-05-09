import { DoesNotExistError } from "../../types/internalErrors";
import { appendAPIURL, getHeaders } from "../apiUtils";
import { TransitKeyType } from "../types/transit";

export async function getTransitKey(baseMount: string, name: string): Promise<TransitKeyType> {
  const request = new Request(appendAPIURL(`/v1/${baseMount}/keys/${name}`), {
    headers: getHeaders(),
  });
  return fetch(request).then(response => {
    if (response.status == 404) {
      throw DoesNotExistError;
    }
    return response.json();
  }).then(data => {
    return data.data;
  });
}
