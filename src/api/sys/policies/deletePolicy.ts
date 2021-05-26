import { appendAPIURL, getHeaders } from "../../apiUtils";

type OptionalErrors = { errors?: string[] };

export async function deletePolicy(name: string): Promise<void> {
  const request = new Request(appendAPIURL("/v1/sys/policies/acl/" + name), {
    method: "DELETE",
    headers: getHeaders(),
  });
  const response = await fetch(request);
  let data: OptionalErrors = {};
  try {
    data = (await response.json()) as OptionalErrors;
  } catch {
    // Do Nothing
  }

  if ("errors" in data) {
    throw new Error(data.errors[0]);
  }
}
