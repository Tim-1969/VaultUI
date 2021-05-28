import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";

export type MountType = {
  type: string;
  options: {
    version: string;
  };
};

export type MountsType = {
  [key: string]: MountType;
};

export async function getMounts(): Promise<MountsType> {
  const request = new Request(appendAPIURL("/v1/sys/internal/ui/mounts"), {
    headers: getHeaders(),
  });
  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as { data: { secret: MountsType } };
  return data.data.secret;
}
