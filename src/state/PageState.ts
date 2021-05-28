import { StorageType } from "./storage/StorageType";

export class PageState {
  constructor() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("reset")) this.storage.clear();
    if (params.has("incognito")) {
      this.storage = sessionStorage;
    } else {
      this.storage = localStorage;
    }
  }

  private storage: StorageType;

  // NOTE: When a item in the page state isn't a string (e.g it is a array or object),
  // you need to add helper methods to mutate it or else it wont save.
  // example: secretPath is a array so when you try to .push() to it
  // it will modify the object that was getted from this class
  // then when you try to access it again, there will be a different object.
  // I guess you could make another class that emulates a Array or Map
  // by using a bunch of functions and modifying localStorage in order to remove some of
  // the clunkyness of this approach, but for now, this works.

  get apiURL(): string | null {
    const apiurl = this.storage.getItem("apiURL") || "";
    return apiurl.length > 0 ? apiurl : null;
  }
  set apiURL(value: string) {
    this.storage.setItem("apiURL", value);
  }

  get token(): string | null {
    const tok = this.storage.getItem("token") || "";
    return tok.length > 0 ? tok : null;
  }
  set token(value: string) {
    this.storage.setItem("token", value);
  }

  get pageDirection(): string {
    return this.storage.getItem("pageDirection") || "ltr";
  }
  set pageDirection(value: string) {
    this.storage.setItem("pageDirection", value);
  }

  get language(): string {
    return this.storage.getItem("language") || "";
  }
  set language(value: string) {
    this.storage.setItem("language", value);
  }

  get baseMount(): string {
    return this.storage.getItem("baseMount") || "";
  }
  set baseMount(value: string) {
    this.storage.setItem("baseMount", value);
  }

  // Since this is a array we can't act directly on it so we need
  // functions to do the same modifications.
  // See the note at the start o
  popSecretPath(): void {
    const secPath = this.secretPath;
    secPath.pop();
    this.secretPath = secPath;
  }
  pushSecretPath(...args: string[]): void {
    const secPath = this.secretPath;
    secPath.push(...args);
    this.secretPath = secPath;
  }

  get secretPath(): string[] {
    return JSON.parse(this.storage.getItem("secretPath") || "[]") as string[];
  }
  set secretPath(value: string[]) {
    this.storage.setItem("secretPath", JSON.stringify(value));
  }

  get secretVersion(): string | null {
    const result = this.storage.getItem("secretVersion");
    return result != "null" ? result || null : null;
  }
  set secretVersion(value: string) {
    this.storage.setItem("secretVersion", String(value));
  }

  get secretItem(): string {
    return this.storage.getItem("secretItem") || "";
  }
  set secretItem(value: string) {
    this.storage.setItem("secretItem", value);
  }

  get secretMountType(): string {
    return this.storage.getItem("secretMountType") || "";
  }
  set secretMountType(value: string) {
    this.storage.setItem("secretMountType", value);
  }

  get policyItem(): string {
    return this.storage.getItem("policyItem") || "";
  }
  set policyItem(value: string) {
    this.storage.setItem("policyItem", value);
  }

  get authPath(): string {
    return this.storage.getItem("authPath") || "";
  }
  set authPath(value: string) {
    this.storage.setItem("authPath", value);
  }

  get userPassUser(): string {
    return this.storage.getItem("userPassUser") || "";
  }
  set userPassUser(value: string) {
    this.storage.setItem("userPassUser", value);
  }

  get currentPage(): string {
    const curPage = this.storage.getItem("currentPage") || "HOME";
    return curPage;
  }
  set currentPage(value: string) {
    this.storage.setItem("currentPage", value);
  }
}
