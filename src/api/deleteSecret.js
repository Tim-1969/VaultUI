import { appendAPIURL, getHeaders } from "./apiUtils.js";
import { removeDoubleSlash } from "../utils.js";


export async function deleteSecret(baseMount, mountType, secretPath, name, version = null) {
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
  let response = await fetch(request);
  if (!response.ok) {
    let json = await response.json();
    throw new Error(json.errors[0]);
  }
}
