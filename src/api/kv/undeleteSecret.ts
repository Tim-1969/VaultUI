import { appendAPIURL, getHeaders } from "../apiUtils";
import { getObjectKeys, removeDoubleSlash } from "../../utils";
import { getSecretMetadata } from "./getSecretMetadata";

export async function undeleteSecret(
  baseMount: string,
  secretPath: string[],
  name: string,
  version: string|null = null
): Promise<void> {
  let secretURL = `/v1/${baseMount}/undelete/${secretPath.join("/")}/${name}`;
  secretURL = removeDoubleSlash(secretURL).replace(/\/$/, "");
  if (version == null) {
    const meta = await getSecretMetadata(
      baseMount,
      secretPath,
      name
    );
    const versions = getObjectKeys(meta.versions);
    version = String(versions[versions.length - 1]);
  }

  const request = new Request(appendAPIURL(secretURL), {
    method: "POST",
    headers: {
      ...getHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "versions": [version] })
  });
  const response = await fetch(request);
  if (!response.ok) {
    const json = await response.json() as {errors: string[]};
    throw new Error(json.errors[0]);
  }
}
