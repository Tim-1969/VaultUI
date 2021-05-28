import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";

export async function getSecretKV1(
  baseMount: string,
  secretPath: string[],
  name: string,
): Promise<Record<string, unknown>> {
  const request = new Request(appendAPIURL(`/v1/${baseMount}/${secretPath.join("")}/${name}`), {
    headers: getHeaders(),
  });

  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as unknown;

  return (data as { data: Record<string, unknown> }).data;
}

export async function getSecretKV2(
  baseMount: string,
  secretPath: string[],
  name: string,
  version: string | null = null,
): Promise<Record<string, unknown>> {
  let secretURL = "";

  secretURL = `/v1/${baseMount}/data/${secretPath.join("")}/${name}`;
  if (version != null) secretURL += `?version=${version}`;

  const request = new Request(appendAPIURL(secretURL), {
    headers: getHeaders(),
  });

  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as unknown;
  return (data as { data: { data: Record<string, unknown> } }).data.data;
}

export async function getSecret(
  baseMount: string,
  secretMountType: string,
  secretPath: string[],
  name: string,
  version: string | null = null,
): Promise<Record<string, unknown>> {
  if (secretMountType == "kv-v2") {
    return await getSecretKV2(baseMount, secretPath, name, version);
  } else {
    return await getSecretKV1(baseMount, secretPath, name);
  }
}
