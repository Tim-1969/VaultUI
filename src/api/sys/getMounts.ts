import { appendAPIURL, getHeaders } from "../apiUtils";

type MountsType = {
  [key: string]: {
    type: string
    options: {
      version: string
    }
  }
}

export async function getMounts(): Promise<MountsType> {
  const request = new Request(appendAPIURL("/v1/sys/internal/ui/mounts"), {
    headers: (getHeaders() as any),
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data.data.secret;
  });
}
