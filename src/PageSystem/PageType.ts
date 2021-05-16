import { PageRouter } from "./PageRouter";

export type PageType = {
  render(): Promise<void>;
  getPageTitle(): Promise<Element | string>;
  goBack(): Promise<void>;
  cleanup(): Promise<void>;
  setRouterAndState(router: PageRouter, state: unknown): Promise<void>;
}