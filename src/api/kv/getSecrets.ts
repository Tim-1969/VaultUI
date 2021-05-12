import { DoesNotExistError } from "../../types/internalErrors";
import { appendAPIURL, getHeaders } from "../apiUtils";

export async function getSecrets(
  baseMount: string,
  mountType: string,
  secretPath: string[],
): Promise<string[]> {
  let secretURL = "";
  if (mountType == "kv-v2") {
    secretURL = `/v1/${baseMount}/metadata/${secretPath.join("")}?list=true`;
  } else {
    // cubbyhole and v1 are identical
    secretURL = `/v1/${baseMount}/${secretPath.join("")}?list=true`;
  }
  const request = new Request(appendAPIURL(secretURL), {
    headers: getHeaders(),
  });
  const resp = await fetch(request);
  if (resp.status == 404) {
    throw DoesNotExistError;
  }
  const data = (await resp.json()) as { data: { keys: string[] } };
  return data.data.keys;
}
