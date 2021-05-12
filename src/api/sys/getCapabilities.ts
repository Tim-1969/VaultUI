import { appendAPIURL, getHeaders } from "../apiUtils";
import { removeDoubleSlash } from "../../utils";

export async function getCapabilitiesPath(path: string): Promise<string[]> {
  const request = new Request(appendAPIURL("/v1/sys/capabilities-self"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(),
    },
    body: JSON.stringify({
      paths: [removeDoubleSlash(path)],
    }),
  });
  const response = await fetch(request);
  const data = (await response.json()) as { capabilities: string[] };
  return data.capabilities;
}

export async function getCapabilities(
  baseMount: string,
  secretPath: string[],
  name: string,
): Promise<string[]> {
  return await getCapabilitiesPath(
    removeDoubleSlash(baseMount + secretPath.join("/") + "/" + name),
  );
}
