import { appendAPIURL } from "../apiUtils";

export type SealStatusType = {
  progress: number;
  t: number;
  sealed: boolean;
};

export async function getSealStatus(): Promise<SealStatusType> {
  const request = new Request(appendAPIURL("/v1/sys/seal-status"));
  const resp = await fetch(request);
  const data = (await resp.json()) as SealStatusType;
  return data;
}
