export interface StorageType {
  clear(): void;
  getItem(key: string): string;
  setItem(key: string, value: string);
}