import { Page } from "./Page";
import { PageState } from "../PageState";
import { getObjectKeys } from "../utils";

type pageList = {
  [key: string]: Page;
};

const PageDoesNotExistError = new Error("Page does not exist.");
const PageHasNotBeenSetError = new Error("Page has not been set.");

export class PageRouter extends EventTarget {
  constructor(
    pages: pageList,
    state: PageState,
    pageContentElement: HTMLElement,
    pageTitleElement: HTMLElement,
  ) {
    super();
    this.pages = pages;
    this.state = state;
    this.pageContentElement = pageContentElement;
    this.pageTitleElement = pageTitleElement;
  }

  private pages: pageList;
  private currentPageID: string;
  private currentPage: Page;

  public state: PageState;
  public pageContentElement: HTMLElement;
  public pageTitleElement: HTMLElement;

  public async getPageIDs(): Promise<string[]> {
    return getObjectKeys(this.pages);
  }

  public async getCurrentPage(): Promise<Page> {
    return this.currentPage;
  }

  public async getCurrentPageID(): Promise<string> {
    return this.currentPageID;
  }

  public async setPageContent(content: string | HTMLElement): Promise<void> {
    if (typeof content === "string") {
      this.pageContentElement.innerHTML = content;
    } else {
      this.pageContentElement.innerHTML = "";
      this.pageContentElement.appendChild(content);
    }
  }

  public async changePage(pageID: string): Promise<void> {
    if (!(await this.getPageIDs()).includes(pageID)) throw PageDoesNotExistError;

    // Do cleanup on current page.
    if (this.currentPage) {
      await this.currentPage.cleanup();
    }

    // Set the current page to the new page
    this.currentPageID = pageID;
    this.currentPage = this.pages[pageID];

    await this.currentPage.setRouterAndState(this, this.state);

    // Dispatch an event saying the page has been changed.
    this.dispatchEvent(new CustomEvent("pageChanged"));

    // Render the page.
    await this.renderPage();
  }

  public async renderPage(): Promise<void> {
    if (!this.currentPage) throw PageHasNotBeenSetError;

    // Reset back to blank.
    this.pageContentElement.innerHTML = "";
    this.pageTitleElement.innerHTML = "";

    const pageTitle = await this.currentPage.getPageTitle();
    if (typeof pageTitle === "string") {
      this.pageTitleElement.innerText = pageTitle;
    } else {
      this.pageTitleElement.appendChild(pageTitle);
    }

    await this.currentPage.render();
  }

  public async refresh(): Promise<void> {
    await this.renderPage();
  }

  public async goBack(): Promise<void> {
    if (!this.currentPage) throw PageHasNotBeenSetError;
    await this.currentPage.goBack();
  }
}
