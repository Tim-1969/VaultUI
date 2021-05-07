export function removeDoubleSlash(str) {
  return str.replace(/\/\/+/g, "/");
}

export const getObjectKeys = (obj) => Object.getOwnPropertyNames(obj);
export const objectToMap = (obj) => new Map(Object.entries(obj));

export function getKeyByObjectPropertyValue(map, searchValue) {
  for (let key of getObjectKeys(map)) {
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