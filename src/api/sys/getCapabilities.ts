import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";
import { removeDoubleSlash } from "../../utils";

export type CapabilitiesType = {
  [path: string]: string[];
  capabilities?: string[];
};

export async function getCapabilitiesPath(path: string | string[]): Promise<CapabilitiesType> {
  if (!Array.isArray(path)) {
    path = [path];
  }

  const request = new Request(appendAPIURL("/v1/sys/capabilities-self"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(),
    },
    body: JSON.stringify({
      paths: path,
    }),
  });
  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as { capabilities: string[] };
  return data;
}

export async function getCapabilities(
  baseMount: string,
  secretPath: string[],
  name: string,
): Promise<CapabilitiesType> {
  return await getCapabilitiesPath(
    removeDoubleSlash(baseMount + secretPath.join("/") + "/" + name),
  );
}
