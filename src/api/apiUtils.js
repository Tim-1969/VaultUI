import { pageState } from "../globalPageState.js";

export function getHeaders() {
  return {
    "X-Vault-Token": pageState.token,
  }
}

export const appendAPIURL = (url) => pageState.apiURL + url;