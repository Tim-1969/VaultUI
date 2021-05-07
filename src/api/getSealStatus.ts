import { appendAPIURL } from "./apiUtils";

type SealStatusType = {
  progress: number;
  t: number;
  sealed: boolean;
}

export async function getSealStatus(): Promise<SealStatusType> {
  const request = new Request(appendAPIURL("/v1/sys/seal-status"));
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data;
  });
}
