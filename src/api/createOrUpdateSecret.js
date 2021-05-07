import { appendAPIURL, getHeaders } from "./apiUtils.js";
import { removeDoubleSlash } from "../utils.js";


export async function createOrUpdateSecret(baseMount, mountType, secretPath, name, data) {
  let secretURL = "";
  let APIData = {};

  if (mountType == "kv-v2") {
    secretURL = `/v1/${baseMount}/data/${secretPath.join("/")}/${name}`;
    APIData = { "data": data };
  } else {
    secretURL = `/v1/${baseMount}/${secretPath.join("/")}/${name}`;
    APIData = data;
  }

  secretURL = removeDoubleSlash(secretURL).replace(/\/$/, "");
  const request = new Request(appendAPIURL(secretURL), {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify(APIData, null, 0)
  });
  let response = await fetch(request);
  if (!response.ok) {
    let json = await response.json();
    throw new Error(json.errors[0]);
  }
}
