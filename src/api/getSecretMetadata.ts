import { appendAPIURL, getHeaders } from "./apiUtils";

type SecretMetadataType = {
  versions: Record<string, Record<any, any>>
}

export async function getSecretMetadata(
  baseMount: string,
  secretPath: string[],
  name: string
): Promise<SecretMetadataType> {
  const request = new Request(appendAPIURL(`/v1/${baseMount}/metadata/${secretPath.join("")}/${name}`), {
    headers: (getHeaders() as any),
  });

  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data.data;
  });
}
