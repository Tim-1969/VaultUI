import { removeDoubleSlash } from "../utils.js";
import { appendAPIURL, getHeaders } from "./apiUtils.js";


export async function getCapabilitiesPath(path) {
  const request = new Request(appendAPIURL("/v1/sys/capabilities-self"), {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify(
      {
        "paths": [removeDoubleSlash(path)]
      }
    )
  });
  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data.capabilities;
  });
}

export async function getCapabilities(baseMount, secretPath, name) {
  return await getCapabilitiesPath(removeDoubleSlash(baseMount + secretPath.join("/") + "/" + name));
}
