import { getObjectKeys, removeDoubleSlash } from "../utils.js";
import { appendAPIURL, getHeaders } from "./apiUtils.js";
import { getSecretMetadata } from "./getSecretMetadata";


export async function undeleteSecret(baseMount, secretPath, name, version = null) {
  let secretURL = `/v1/${baseMount}/undelete/${secretPath.join("/")}/${name}`;
  secretURL = removeDoubleSlash(secretURL).replace(/\/$/, "");
  if (version == null) {
    let meta = await getSecretMetadata(
      baseMount,
      secretPath,
      name
    );
    let versions = getObjectKeys(meta.versions);
    version = String(versions[versions.length - 1]);
  }

  let request = new Request(appendAPIURL(secretURL), {
    method: "POST",
    headers: {
      ...getHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "versions": [version] })
  });
  let response = await fetch(request);
  if (!response.ok) {
    let json = await response.json();
    throw new Error(json.errors[0]);
  }
}
