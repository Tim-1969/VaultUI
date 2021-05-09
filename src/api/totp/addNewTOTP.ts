import { appendAPIURL, getHeaders } from "../apiUtils";
import { removeDoubleSlash } from "../../utils";


export async function addNewTOTP(baseMount: string, parms: {name: string}): Promise<void>  {
  const request = new Request(appendAPIURL(removeDoubleSlash(`/v1/${baseMount}/keys/${parms.name}`)), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify(parms)
  });
  const response = await fetch(request);
  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.errors[0]);
  }
}
