import { appendAPIURL, getHeaders } from "../../apiUtils";
import { removeDoubleSlash } from "../../../utils";

export async function deleteUserPassUser(path: string, username: string): Promise<void> {
  const request = new Request(
    appendAPIURL(removeDoubleSlash(`/v1/auth/${path}/users/${username}`)),
    {
      method: "DELETE",
      headers: getHeaders(),
    },
  );
  const response = await fetch(request);
  if (!response.ok) {
    const json = (await response.json()) as { errors: string[] };
    throw new Error(json.errors[0]);
  }
}
