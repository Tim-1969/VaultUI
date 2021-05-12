import { pageState } from "../globalPageState";

export function getHeaders(): Record<string, string> {
  return {
    "X-Vault-Token": pageState.token,
  };
}

export const appendAPIURL = (url: string): string => pageState.apiURL + url;
