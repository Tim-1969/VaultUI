import { Page } from "../types/Page.js";
import { changePage, setPageContent, setTitleElement } from "../pageUtils.js";
import { makeElement } from "../htmlUtils.js";
import { pageState } from "../globalPageState.js";

export class TemplatePage extends Page {
  constructor() {
    super();
  }
  goBack() {
    changePage("HOME");
  }
  async render() {
    setTitleElement(pageState);
    setPageContent(makeElement({
      tag: "p",
      text: "[PLACEHOLDER]"
    }));
  }

  get name() {
    return "Template";
  }
}
