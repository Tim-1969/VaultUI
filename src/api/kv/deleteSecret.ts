import { appendAPIURL, getHeaders } from "../apiUtils";
import { removeDoubleSlash } from "../../utils";

export async function deleteSecret(
  baseMount: string,
  mountType: string,
  secretPath: string[],
  name: string,
  version: string | null = null
): Promise<void> {
  let secretURL = "";

  let request;

  if (mountType == "kv-v2" && version != null) {
    secretURL = `/v1/${baseMount}/delete/${secretPath.join("")}/${name}`;
    secretURL = removeDoubleSlash(secretURL).replace(/\/$/, "");
    request = new Request(appendAPIURL(secretURL), {
      method: "POST",
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: version != null ? JSON.stringify({ "versions": [version] }) : "{}"
    });
  } else {
    if (mountType == "kv-v2") {
      secretURL = `/v1/${baseMount}/metadata/${secretPath.join("")}/${name}`;
    } else {
      secretURL = `/v1/${baseMount}/${secretPath.join("")}/${name}`;
    }
    secretURL = removeDoubleSlash(secretURL).replace(/\/$/, "");
    request = new Request(appendAPIURL(secretURL), {
      method: "DELETE",
      headers: getHeaders(),
    });
  }
  const response = await fetch(request);
  if (!response.ok) {
    const json = await response.json() as {errors: string[]};
    throw new Error(json.errors[0]);
  }
}
