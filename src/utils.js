export function removeDoubleSlash(str) {
  return str.replace(/\/\/+/g, "/");
}

export function getKeyByObjectPropertyValue(map, searchValue) {
  for (let key of Object.getOwnPropertyNames(map)) {
    if (map[key] === searchValue)
      return key;
  }
}

export function verifyJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function getToken() {
  return pageState.token.length > 0 ? pageState.token : null;
}

export function getAPIURL() {
  return pageState.apiURL.length > 0 ? pageState.apiURL : null
}