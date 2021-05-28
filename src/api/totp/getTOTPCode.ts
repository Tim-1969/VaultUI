import { appendAPIURL, checkResponse, getHeaders } from "../apiUtils";

export async function getTOTPCode(baseMount: string, name: string): Promise<string> {
  const request = new Request(appendAPIURL(`/v1/${baseMount}/code/${name}`), {
    headers: getHeaders(),
  });

  const resp = await fetch(request);
  await checkResponse(resp);

  const data = (await resp.json()) as { data: { code: string } };
  return data.data.code;
}
