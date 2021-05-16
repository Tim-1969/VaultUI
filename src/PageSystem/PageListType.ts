import { PageType } from "./PageType";

export type PageListType = {
  getPageIDs(): Promise<string[]>;
  getPage(pageID: string): Promise<PageType>;
}