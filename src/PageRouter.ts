import { Page } from "./types/Page";
import { getObjectKeys } from "./utils";

type pageList = {
  [key: string]: Page;
};

const PageDoesNotExistError = new Error("Page does not exist.");
const PageHasNotBeenSetError = new Error("Page has not been set.");

export class PageRouter extends EventTarget {
  constructor(pages: pageList, pageContentElement: HTMLElement, pageTitleElement: HTMLElement) {
    super();
    this.pages = pages;
    this.pageContentElement = pageContentElement;
    this.pageTitleElement = pageTitleElement;
  }

  private pages: pageList;
  private currentPageID: string;
  private currentPage: Page;

  public pageContentElement: HTMLElement;
  public pageTitleElement: HTMLElement;

  public async getPageIDs(): Promise<string[]> {
    return getObjectKeys(this.pages);
  }

  public async getCurrentPageID(): Promise<string> {
    return this.currentPageID;
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

    // TODO: Make Page have a getTitle method.
    this.pageTitleElement.innerText = this.currentPage.name;

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
