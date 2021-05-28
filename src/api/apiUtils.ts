import { pageState } from "../globalPageState";
import { DoesNotExistError } from "../types/internalErrors";
import { BaseAPIResponse } from "./types/api";

export function getHeaders(): Record<string, string> {
  return {
    "X-Vault-Token": pageState.token,
  };
}

export const appendAPIURL = (url: string): string => pageState.apiURL + url;

export async function checkResponse(resp: Response): Promise<void> {
  if (resp.ok) return;
  if (resp.status == 404) throw DoesNotExistError;

  let json: BaseAPIResponse;
  try {
    json = (await resp.json()) as BaseAPIResponse;
  } catch {
    // Do Nothing
  }

  if (json?.errors?.length >= 1) {
    throw new Error(json.errors[0]);
  }
}