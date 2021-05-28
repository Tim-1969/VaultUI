import { appendAPIURL, checkResponse, getHeaders } from "../../apiUtils";
import { removeDoubleSlash } from "../../../utils";

export async function deleteUserPassUser(path: string, username: string): Promise<void> {
  const request = new Request(
    appendAPIURL(removeDoubleSlash(`/v1/auth/${path}/users/${username}`)),
    {
      method: "DELETE",
      headers: getHeaders(),
    },
  );
  const resp = await fetch(request);
  await checkResponse(resp);
}
