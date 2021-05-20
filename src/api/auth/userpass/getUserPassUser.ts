import { UserType, UserTypeAPIResp } from "../../types/userpass/user";
import { appendAPIURL, getHeaders } from "../../apiUtils";

export async function getUserPassUser(path: string, username: string): Promise<UserType> {
  const request = new Request(appendAPIURL(`/v1/auth/${path}/users/${username}`), {
    headers: getHeaders(),
  });
  const resp = await fetch(request);
  const data = (await resp.json()) as UserTypeAPIResp;
  return data.data;
}
