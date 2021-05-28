import { UserType } from "../../types/userpass/user";
import { appendAPIURL, checkResponse, getHeaders } from "../../apiUtils";
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
  const resp = await fetch(request);
  await checkResponse(resp);
}
