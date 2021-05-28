import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";

type SecretMetadataType = {
  versions: Record<string, unknown>;
};

export async function getSecretMetadata(
  baseMount: string,
  secretPath: string[],
  name: string,
): Promise<SecretMetadataType> {
  const request = new Request(
    appendAPIURL(`/v1/${baseMount}/metadata/${secretPath.join("")}/${name}`),
    {
      headers: getHeaders(),
    },
  );

  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as { data: SecretMetadataType };
  return data.data;
}
