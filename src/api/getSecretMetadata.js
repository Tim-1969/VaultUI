import { appendAPIURL, getHeaders } from "./apiUtils.js";


export async function getSecretMetadata(baseMount, secretPath, name) {
  const request = new Request(appendAPIURL(`/v1/${baseMount}/metadata/${secretPath.join("")}/${name}`), {
    headers: getHeaders(),
  });

  return fetch(request).then(response => {
    return response.json();
  }).then(data => {
    return data.data;
  });
}
