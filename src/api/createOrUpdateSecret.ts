import { appendAPIURL, getHeaders } from "./apiUtils";
import { removeDoubleSlash } from "../utils";


export async function createOrUpdateSecret(
  baseMount: string,
  mountType: string,
  secretPath: string[],
  name: string,
  data: Record<string, unknown>
): Promise<void> {
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
  const response = await fetch(request);
  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.errors[0]);
  }
}
