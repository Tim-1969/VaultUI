import { appendAPIURL, getHeaders } from "../../apiUtils";

type OptionalErrors = { errors?: string[] };

export async function createOrUpdatePolicy(name: string, policy_data: string): Promise<void> {
  const request = new Request(appendAPIURL("/v1/sys/policies/acl/" + name), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(),
    },
    body: JSON.stringify({ policy: policy_data }, null, 0),
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
