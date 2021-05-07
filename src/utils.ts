export function removeDoubleSlash(str: string): string {
  return str.replace(/\/\/+/g, "/");
}

export const getObjectKeys = (obj: Object) => Object.getOwnPropertyNames(obj);
export const objectToMap = (obj: Object) => new Map(Object.entries(obj));
export const sortedObjectMap = (obj: Object) => new Map(Object.entries(obj).sort());

export function getKeyByObjectPropertyValue(map: object, searchValue: any) {
  for (let key of getObjectKeys(map)) {
    if ((map as any)[key] === searchValue)
      return key;
  }
}

export function verifyJSONString(str: string): Boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}