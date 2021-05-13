import { appendAPIURL, getHeaders } from "../apiUtils";
import { removeDoubleSlash } from "../../utils";

type NewMountParams = {
  name: string;
  type: string;
  options?: {
    version: string;
  };
};

export async function newMount(parms: NewMountParams): Promise<void> {
  const request = new Request(appendAPIURL(removeDoubleSlash(`/v1/sys/mounts/${parms.name}`)), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(),
    },
    body: JSON.stringify(parms),
  });
  const resp = await fetch(request);
  if (!resp.ok) {
    const data = (await resp.json()) as { errors?: string[] };
    if ("errors" in data) {
      throw new Error(data.errors[0]);
    }
  }
}
