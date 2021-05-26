export class PageState {
  constructor() {
    // Do Nothing
  }

  // NOTE: When a item in the page state isn't a string (e.g it is a array or object),
  // you need to add helper methods to mutate it or else it wont save.
  // example: secretPath is a array so when you try to .push() to it
  // it will modify the object that was getted from this class
  // then when you try to access it again, there will be a different object.
  // I guess you could make another class that emulates a Array or Map
  // by using a bunch of functions and modifying localStorage in order to remove some of
  // the clunkyness of this approach, but for now, this works.

  get apiURL(): string | null {
    const apiurl = localStorage.getItem("apiURL") || "";
    return apiurl.length > 0 ? apiurl : null;
  }
  set apiURL(value: string) {
    localStorage.setItem("apiURL", value);
  }

  get token(): string | null {
    const tok = localStorage.getItem("token") || "";
    return tok.length > 0 ? tok : null;
  }
  set token(value: string) {
    localStorage.setItem("token", value);
  }

  get pageDirection(): string {
    return localStorage.getItem("pageDirection") || "ltr";
  }
  set pageDirection(value: string) {
    localStorage.setItem("pageDirection", value);
  }

  get language(): string {
    return localStorage.getItem("language") || "";
  }
  set language(value: string) {
    localStorage.setItem("language", value);
  }

  get baseMount(): string {
    return localStorage.getItem("baseMount") || "";
  }
  set baseMount(value: string) {
    localStorage.setItem("baseMount", value);
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
    return JSON.parse(localStorage.getItem("secretPath") || "[]") as string[];
  }
  set secretPath(value: string[]) {
    localStorage.setItem("secretPath", JSON.stringify(value));
  }

  get secretVersion(): string | null {
    const result = localStorage.getItem("secretVersion");
    return result != "null" ? result || null : null;
  }
  set secretVersion(value: string) {
    localStorage.setItem("secretVersion", String(value));
  }

  get secretItem(): string {
    return localStorage.getItem("secretItem") || "";
  }
  set secretItem(value: string) {
    localStorage.setItem("secretItem", value);
  }

  get secretMountType(): string {
    return localStorage.getItem("secretMountType") || "";
  }
  set secretMountType(value: string) {
    localStorage.setItem("secretMountType", value);
  }

  get policyItem(): string {
    return localStorage.getItem("policyItem") || "";
  }
  set policyItem(value: string) {
    localStorage.setItem("policyItem", value);
  }

  get authPath(): string {
    return localStorage.getItem("authPath") || "";
  }
  set authPath(value: string) {
    localStorage.setItem("authPath", value);
  }

  get userPassUser(): string {
    return localStorage.getItem("userPassUser") || "";
  }
  set userPassUser(value: string) {
    localStorage.setItem("userPassUser", value);
  }

  get currentPage(): string {
    const curPage = localStorage.getItem("currentPage") || "HOME";
    return curPage;
  }
  set currentPage(value: string) {
    localStorage.setItem("currentPage", value);
  }
}
