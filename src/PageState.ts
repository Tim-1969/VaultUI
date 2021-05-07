import { Page } from "./types/Page.js";
import { allPages } from "./allPages"
import {
  getKeyByObjectPropertyValue,
} from "./utils";

export class PageState {
  constructor() {
    // Do Nothing
  }

  // NOTE: When a item in the page state isn't a string (e.g it is a array or object),
  // you need to add helper methods to mutate it or else it wont save.
  // example: currentSecretPath is a array so when you try to .push() to it
  // it will modify the object that was getted from this class
  // then when you try to access it again, there will be a different object.
  // I guess you could make another class that emulates a Array or Map 
  // by using a bunch of functions and modifying localStorage in order to remove some of
  // the clunkyness of this approach, but for now, this works.

  get apiURL(): string | null {
    const apiurl = localStorage.getItem('apiURL') || "";
    return apiurl.length > 0 ? apiurl : null;
  }
  set apiURL(value: string) {
    localStorage.setItem('apiURL', value);
  }

  get token(): string | null {
    const tok = localStorage.getItem('token') || "";
    return tok.length > 0 ? tok : null;
  }
  set token(value: string) {
    localStorage.setItem('token', value);
  }

  get pageDirection(): string {
    return localStorage.getItem('pageDirection') || "ltr";
  }
  set pageDirection(value: string) {
    localStorage.setItem('pageDirection', value);
  }

  get language(): string {
    return localStorage.getItem('language') || "";
  }
  set language(value: string) {
    localStorage.setItem('language', value);
  }

  get currentBaseMount(): string {
    return localStorage.getItem('currentBaseMount') || "";
  }
  set currentBaseMount(value: string) {
    localStorage.setItem('currentBaseMount', value);
  }


  // Since this is a array we can't act directly on it so we need
  // functions to do the same modifications.
  // See the note at the start o
  popCurrentSecretPath(): void {
    const secPath = this.currentSecretPath;
    secPath.pop();
    this.currentSecretPath = secPath;
  }
  pushCurrentSecretPath(...args: string[]): void {
    const secPath = this.currentSecretPath;
    secPath.push(...args);
    this.currentSecretPath = secPath;
  }

  get currentSecretPath(): string[] {
    return JSON.parse(localStorage.getItem('currentSecretPath') || "[]");
  }
  set currentSecretPath(value: string[]) {
    localStorage.setItem('currentSecretPath', JSON.stringify(value));
  }

  get currentSecretVersion(): string | null {
    const result = localStorage.getItem('currentSecretVersion')
    return result != "null" ? result || null : null;
  }
  set currentSecretVersion(value: string) {
    localStorage.setItem('currentSecretVersion', String(value));
  }

  get currentSecret(): string {
    return localStorage.getItem('currentSecret') || "";
  }
  set currentSecret(value: string) {
    localStorage.setItem('currentSecret', value);
  }

  get currentMountType(): string {
    return localStorage.getItem('currentMountType') || "";
  }
  set currentMountType(value: string) {
    localStorage.setItem('currentMountType', value);
  }
  get currentPageString(): string {
    const key = getKeyByObjectPropertyValue(allPages, this.currentPage);
    return key;
  }
  get currentPage(): Page | string {
    const curPage = localStorage.getItem('currentPage') || "HOME";
    return (allPages as any)[curPage];
  }
  set currentPage(value: Page | string) {
    if (typeof value == 'object') {
      const key = getKeyByObjectPropertyValue(allPages, value);
      localStorage.setItem('currentPage', key);
    } else {
      localStorage.setItem('currentPage', (value as string));
    }
  }
}