import { pageState } from "../globalPageState.ts";

export function getHeaders() {
  return {
    "X-Vault-Token": pageState.token,
  }
}

export const appendAPIURL = (url) => pageState.apiURL + url;