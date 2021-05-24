import { PageRouter } from "z-pagerouter";
import { PageState } from "../PageState";

export class Page {
  constructor() {
    // Do Nothing
  }

  public router: PageRouter;
  public state: PageState;

  async render(): Promise<void> {}
  get name(): string {
    return "Page";
  }
  async renderPageTitle(): Promise<void> {
    this.router.pageTitleElement.innerText = this.name;
  }
  async goBack(): Promise<void> {
    await this.router.changePage("HOME");
  }
  async cleanup(): Promise<void> {
    // Do Nothing
  }
  async setRouterAndState(router: PageRouter, state: PageState): Promise<void> {
    this.router = router;
    this.state = state;
  }
}
