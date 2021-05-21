import { UserType } from "../../types/userpass/user";
import { appendAPIURL, getHeaders } from "../../apiUtils";
import { removeDoubleSlash } from "../../../utils";

export async function createOrUpdateUserPassUser(
  path: string,
  username: string,
  data: Partial<UserType>,
): Promise<void> {
  const request = new Request(
    appendAPIURL(removeDoubleSlash(`/v1/auth/${path}/users/${username}`)),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getHeaders(),
      },
      body: JSON.stringify(data, null, 0),
    },
  );
  const response = await fetch(request);
  if (!response.ok) {
    const json = (await response.json()) as { errors: string[] };
    throw new Error(json.errors[0]);
  }
}
