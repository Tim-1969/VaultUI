import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";

export async function getSecret(
  baseMount: string,
  secretMountType: string,
  secretPath: string[],
  name: string,
  version: string | null = null,
): Promise<Record<string, unknown>> {
  let secretURL = "";
  if (secretMountType == "kv-v2") {
    secretURL = `/v1/${baseMount}/data/${secretPath.join("")}/${name}`;
    if (version != null) secretURL += `?version=${version}`;
  } else {
    secretURL = `/v1/${baseMount}/${secretPath.join("")}/${name}`;
  }
  const request = new Request(appendAPIURL(secretURL), {
    headers: getHeaders(),
  });

  const resp = await fetch(request);
  await checkResponse(resp);


  const data = (await resp.json()) as unknown;
  if (secretMountType == "kv-v2") {
    return (data as { data: { data: Record<string, unknown> } }).data.data;
  } else {
    return (data as { data: Record<string, unknown> }).data;
  }
}
