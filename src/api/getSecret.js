import { appendAPIURL, getHeaders } from "./apiUtils.js";


export async function getSecret(baseMount, mountType, secretPath, name, version = null) {
  let secretURL = "";
  if (mountType == "kv-v2") {
    secretURL = `/v1/${baseMount}/data/${secretPath.join("")}/${name}`;
    if (version != null)
      secretURL += `?version=${version}`;
  } else {
    secretURL = `/v1/${baseMount}/${secretPath.join("")}/${name}`;
  }
  const request = new Request(appendAPIURL(secretURL), {
    headers: getHeaders(),
  });

  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return mountType == "kv-v2" ? data.data.data : data.data;
  });
}
