export function removeDoubleSlash(str: string): string {
  return str.replace(/\/\/+/g, "/");
}

export const getObjectKeys =
  (obj: Record<string, unknown>): string[] => Object.getOwnPropertyNames(obj);
export const objectToMap =
  (obj: Record<any, any>): Map<any, any> => new Map(Object.entries(obj));
export const sortedObjectMap =
  (obj: Record<string, unknown>): Map<any, any> => new Map(Object.entries(obj).sort());

export function getKeyByObjectPropertyValue(map: Record<string, unknown>, searchValue: unknown): string {
  for (const key of getObjectKeys(map)) {
    if ((map as any)[key] === searchValue)
      return key;
  }
}

export function verifyJSONString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}